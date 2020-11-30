sap.ui.define([
	"sap/m/MessageBox",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/showcase/ZGBLD001/util/DataManager"
], function (MessageBox, jQuery, MessageToast, Fragment, Controller, Filter, JSONModel, DataManager) {
	"use strict";

	return Controller.extend("sap.showcase.ZGBLD001.controller.S002", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.showcase.ZSHOWCASE001.view.ZZcreate
		 */
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oMaintenanceOrder = {
				"MaintenanceOrder": {
					"orderNo": "",
					"statusNo": "",
					"productID": "",
					"customerNo": "",
					"issContent": "",
					"action": ""
				}
			};
			var oProductInformation = {
				"ProductInformation": {
					"productID": "",
					"productName": "",
					"productCategory": "",
					"productInfo": "",
					"technicalInfo": "",
					"additionalInfo": "",
					"imageURL": "",
					"partsInfo": ""
				}
			};
			var oCustomerInformation = {
				"CustomerInformation": {
					"customerNo": "",
					"customerName1": "",
					"customerName2": "",
					"telepNo": "",
					"faxNo": "",
					"emailAdd": "",
					"countryName": "",
					"cityName": "",
					"streetNo": "",
					"postalNo": ""
				}
			};

			var oInputState = {
				"ProductNumberState": "Error",
				"IssueContentState": "Error",
				"CustomerIDState": "Error"
			};
			var oData = {};
			oData.MaintenanceOrder = oMaintenanceOrder.MaintenanceOrder;
			oData.ProductInformation = oProductInformation.ProductInformation;
			oData.CustomerInformation = oCustomerInformation.CustomerInformation;
			oData.InputState = oInputState;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			this.getView().setModel(oModel);

			// var aProductInfo = new DataManager().getProductInfo();
			// var oProductInfoModel = new sap.ui.model.json.JSONModel();
			// var oProductInfoData = {};
			// oProductInfoData.ProductInfo = aProductInfo;
			// oProductInfoModel.setData(oProductInfoData);
			// this.getView().setModel(oProductInfoModel, "HelpProduct");

			// var aCustomerInfo = new DataManager().getCustomerInfo();
			// var oCustomerInfoModel = new sap.ui.model.json.JSONModel();
			// var oCustomerInfoData = {};
			// oCustomerInfoData.CustomerInfo = aCustomerInfo;
			// oCustomerInfoModel.setData(oCustomerInfoData);
            // this.getView().setModel(oCustomerInfoModel, "HelpCustomer");
            
            this._busyDialog = new sap.m.BusyDialog();
            this._busyDialog.open();
            var oProductInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oProductInfoModel, "HelpProduct");
            this._getProductInfo();
            
            var oCustomerInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oCustomerInfoModel, "HelpCustomer");
			this._getCustomerInfo();
        },
  
		onProductChange: function () {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oData = oModel.getData();
			var oInputState = oModel.getData().InputState;
			var sProductId = oView.byId("productInput").getValue();
			var aProductData = this.getView().getModel("HelpProduct").getData().ProductInfo;
			// var oSelectedProduct = aProductData.find(aProductData => aProductData.productID === sProductId);
			// if (!oSelectedProduct) {
			// 	oInputState.ProductNumberState = "Error";
			// 	oData.ProductInformation = {};
			// } else {
			// 	oInputState.ProductNumberState = "None";
			// 	oData.ProductInformation = oSelectedProduct;
			// }
            // oModel.refresh();
            var aSelectedProduct = aProductData.filter(function(currentObject){
                return currentObject.productID === sProductId;
            });
            if (aSelectedProduct.length === 0) {
                oInputState.ProductNumberState = "Error";
                oData.ProductInformation = {};
            } else {
                oInputState.ProductNumberState = "None";
                oData.ProductInformation = aSelectedProduct[0];
            }
            oModel.refresh();
		},

		onCustomerChange: function () {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oData = oModel.getData();
			var oInputState = oModel.getData().InputState;
			var sCustomerId = oView.byId("CustomerInput").getValue();
            var aCustomerData = this.getView().getModel("HelpCustomer").getData().CustomerInfo;
            
			// var oSelectedCustomer = aCustomerData.find(aCustomerData => aCustomerData.customerNo === sCustomerId);
			// if (!oSelectedCustomer) {
			// 	oInputState.CustomerIDState = "Error";
			// 	oData.CustomerInformation = {};
			// } else {
			// 	oInputState.CustomerIDState = "None";
			// 	oData.CustomerInformation = oSelectedCustomer;
			// }
            // oModel.refresh();
            var aSelectedCustomer = aCustomerData.filter(function(currentObject){
                return currentObject.customerNo === sCustomerId;
            });
            if (aSelectedCustomer.length === 0) {
                oInputState.CustomerIDState = "Error";
                oData.CustomerInformation = {};
            } else {
                oInputState.CustomerIDState = "None";
                oData.CustomerInformation = aSelectedCustomer[0];
            }
            oModel.refresh();
		},

		onInputChange: function () {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oInputState = oModel.getData().InputState;
			if (!oView.byId("issueTextArea").getValue()) {
				oInputState.IssueContentState = "Error";
			} else {
				oInputState.IssueContentState = "None";
			};
			oModel.refresh();
		},

		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"sap.showcase.ZGBLD001.view.ProductNo",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"productID",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"productID",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				this.onProductChange();
			}
			evt.getSource().getBinding("items").filter([]);
		},

		customerValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment(
					"sap.showcase.ZGBLD001.view.CustomerNo",
					this
				);
				this.getView().addDependent(this._valueHelpDialog2);
			}

			// create a filter for the binding
			this._valueHelpDialog2.getBinding("items").filter([new Filter(
				"customerNo",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		_customerValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"customerNo",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_customerValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var customerInput = this.getView().byId(this.inputId);
				customerInput.setValue(oSelectedItem.getTitle());
				this.onCustomerChange();
			}
			evt.getSource().getBinding("items").filter([]);
		},

		onAcceptPress: function () {
			var oSelf = this;
			var oView = this.getView();
			var oMaintOrderData = oView.getModel().getData();
			var sMessage = "";
			oMaintOrderData.MaintenanceOrder.productID = oView.byId("productInput").getValue();
			oMaintOrderData.MaintenanceOrder.issContent = oView.byId("issueTextArea").getValue();
			oMaintOrderData.MaintenanceOrder.customerNo = oView.byId("CustomerInput").getValue();
			if (!oMaintOrderData.MaintenanceOrder.productID) {
				sMessage = sMessage + this.oBundle.getText("ZZ_PRODUCT_CHECK");
			}
			if (!oMaintOrderData.MaintenanceOrder.issContent) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ISSUE_CHECK");
			}
			if (!oMaintOrderData.MaintenanceOrder.customerNo) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_CUSTOMER_CHECK");
			}
			if (!oMaintOrderData.MaintenanceOrder.productID || !oMaintOrderData.MaintenanceOrder.issContent || !oMaintOrderData.MaintenanceOrder
				.customerNo) {
				this._showMessageBox(sMessage);
			} else {
				var oTempData = {};
                oTempData.orderNo = oMaintOrderData.MaintenanceOrder.orderNo;
				oTempData.statusNo = oMaintOrderData.MaintenanceOrder.statusNo;
				oTempData.productID = oMaintOrderData.MaintenanceOrder.productID;
				oTempData.customerNo = oMaintOrderData.MaintenanceOrder.customerNo;
				oTempData.issContent = oMaintOrderData.MaintenanceOrder.issContent;
				oTempData.action = "NEW";
                this._updateOrder(oTempData);
			}
        },

		_naviToOrderDisplay: function () {
			var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNav.toExternal({
				target: {
					semanticObject: "Order",
					action: "Display"
				},
				params: {
					orderNo: ""
				}
			});
		},

		onCancelPress: function () {
			var sMessage = this.oBundle.getText("ZZ_MESSAGE_LEAVE");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				sMessage, {
					actions: ["Continue", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Continue") {
							var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
							oCrossAppNav.toExternal({
								target: {
									shellHash: "#"
								}
							});
						}
					}
				}
			);
		},

		_praseError: function (aError) {
			var oBody = aError.responseText;
			oBody = JSON.parse(oBody);
			var sMessage = oBody["error"]["message"]["value"];
			return sMessage;
		},

		_showMessageBox: function (sMessage) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				sMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
        },
              
        _getProductInfo: function () {
            //Set Data To Model
            var oProductInfoModel = this.getView().getModel("HelpProduct");
            var oPromise = this.getOwnerComponent().oDataManager.getProductInfo()
            oPromise.then(function(aResults) {
                oProductInfoModel.setData({
                    "ProductInfo" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },
                
        _getCustomerInfo: function () {
            //Set Data To Model
            var oCustomerInfoModel = this.getView().getModel("HelpCustomer");
            var oPromise = this.getOwnerComponent().oDataManager.getCustomerInfo()
            oPromise.then(function(aResults) {
                oCustomerInfoModel.setData({
                    "CustomerInfo" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

        _updateOrder: function (oTempData) {
            //update Data from Model
            var oPromise = this.getOwnerComponent().oDataManager.updateOrder(oTempData)
            oPromise.then(function() {
                MessageToast.show("create the order");
                this._naviToOrderDisplay();
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                var sMessage = this._praseError(aError);
                this._showMessageBox(sMessage);
                this._busyDialog.close();
            }.bind(this));
        }

	});

});