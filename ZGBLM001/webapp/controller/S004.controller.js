sap.ui.define([
	"sap/m/MessageBox",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"showcase/ZGBLM001/util/DataManager"
], function (MessageBox, jQuery, MessageToast, Fragment, UIComponent, Controller, Filter, History, JSONModel, DataManager) {
	"use strict";

	return Controller.extend("showcase.ZGBLM001.controller.S004", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf showcase.ZSHOWCASE004.view.Create
		 */
		onInit: function () {
			// this.oDataManager = new DataManager();
			//i18n
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			// //the product information
			// var aProductResult = this.oDataManager.getCreateProduct();
			// var oProductInfoModel = new sap.ui.model.json.JSONModel();
			// var oProductInfoData = {};
			// oProductInfoData.ProductInfo = aProductResult;
			// oProductInfoModel.setData(oProductInfoData);
			// this.getView().setModel(oProductInfoModel, "HelpProduct");

			// //the customer information
			// var aCustomerResult = this.oDataManager.getCreateCustomer();
			// var oCustomerInfoModel = new sap.ui.model.json.JSONModel();
			// var oCustomerInfoData = {};
			// oCustomerInfoData.CustomerInfo = aCustomerResult;
			// oCustomerInfoModel.setData(oCustomerInfoData);
			// this.getView().setModel(oCustomerInfoModel, "HelpCustomer");

            // this._busyDialog = new sap.m.BusyDialog();
            // this._busyDialog.open();
            var oProductInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oProductInfoModel, "HelpProduct");
            this._getProductInfo();
            
            var oCustomerInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oCustomerInfoModel, "HelpCustomer");
            this._getCustomerInfo();
            
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Create").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var sMasterId = oEvent.getParameters().arguments.masterId;
			this.MasterId = sMasterId;

			var oModel = new sap.ui.model.json.JSONModel();
			var oData = {};
			var oCreateData = {
				"orderNo": "",
				"languageKey": "",
				"productID": "",
				"productName": "",
				"productCategory": "",
				"customerNo": "",
				"customerName1": "",
				"customerName2": "",
				"issContent": "",
				"action": "NEW"
			};
			var oVisbleData = {
				"productName": false,
				"category": false,
				"firstName": false,
				"lastName": false
			}
			var oStatusData = {
				"productStauts": "Error",
				"customerStatus": "Error",
				"issueStatus": "Error"
			}
			oData.createData = oCreateData;
			oData.visbleCtrl = oVisbleData;
			oData.statusCtrl = oStatusData;

			oModel.setData(oData);
			this.getView().setModel(oModel);

			this.getView().byId("productInput").setValue("");
			this.getView().byId("CustomerInput").setValue("");
			this.getView().byId("issueTextArea").setValue("");
        },
        
        _getProductInfo: function () {
            //Set Data To Model
            var oProductInfoModel = this.getView().getModel("HelpProduct");
            var oPromise = this.getOwnerComponent().oDataManager.getCreateProduct()
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
            var oPromise = this.getOwnerComponent().oDataManager.getCreateCustomer()
            oPromise.then(function(aResults) {
                oCustomerInfoModel.setData({
                    "CustomerInfo" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"showcase.ZGBLM001.view.ProductNoHelp",
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
					"showcase.ZGBLM001.view.CustomerNoHelp",
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

		onProductChange: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var sProductId = this.getView().byId("productInput").getValue();
			var aProductData = this.getView().getModel("HelpProduct").getData().ProductInfo;
			var oSelectedProduct = aProductData.find(aProductData => aProductData.productID === sProductId);
			if (oSelectedProduct) {
				oData.createData.productID = oSelectedProduct.productID;
				oData.createData.productName = oSelectedProduct.productName;
				oData.createData.productCategory = oSelectedProduct.productCategory;
				oData.visbleCtrl.productName = true;
				oData.visbleCtrl.category = true;
				oData.statusCtrl.productStauts = "None";
			} else {
				oData.createData.productID = "";
				oData.createData.productName = "";
				oData.createData.productCategory = "";
				oData.visbleCtrl.productName = false;
				oData.visbleCtrl.category = false;
				oData.statusCtrl.productStauts = "Error";
			}
			oModel.refresh();
		},

		onCustomerChange: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var sCustomerId = this.getView().byId("CustomerInput").getValue();
			var aCustomerData = this.getView().getModel("HelpCustomer").getData().CustomerInfo;
			var oSelectedCustomer = aCustomerData.find(aCustomerData => aCustomerData.customerNo === sCustomerId);
			if (oSelectedCustomer) {
				oData.createData.customerNo = oSelectedCustomer.customerNo;
				oData.createData.customerName1 = oSelectedCustomer.customerName1;
				oData.createData.customerName2 = oSelectedCustomer.customerName2;
				oData.visbleCtrl.firstName = true;
				oData.visbleCtrl.lastName = true;
				oData.statusCtrl.customerStatus = "None";
			} else {
				oData.createData.customerNo = "";
				oData.createData.customerName1 = "";
				oData.createData.customerName2 = "";
				oData.visbleCtrl.firstName = false;
				oData.visbleCtrl.lastName = false;
				oData.statusCtrl.customerStatus = "Error";
			}
			oModel.refresh();
		},

		onIssueChange: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var sIssue = this.getView().byId("issueTextArea").getValue();
			if (sIssue) {
				oData.statusCtrl.issueStatus = "None";
			} else {
				oData.statusCtrl.issueStatus = "Error";
			}
			oModel.refresh();
		},

		onAcceptPress: function () {
			// var that = this;
			// var oView = this.getView();
			var sMessage = "";
			var sProduct = this.getView().byId("productInput").getValue();
			var sCustomer = this.getView().byId("CustomerInput").getValue();
			var sIssue = this.getView().byId("issueTextArea").getValue();
			if (!sProduct) {
				sMessage = sMessage + this.oBundle.getText("ZZ_CREATE_PRODUCTMES");
			}
			if (!sCustomer && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_CREATE_CUSTOMERMES");
			} else if (!sCustomer && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_CREATE_CUSTOMERMES");
			}
			if (!sIssue && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_CREATE_ISSUEMES");
			} else if (!sIssue && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_CREATE_ISSUEMES");
			}
			if (sMessage) {
				this._showMessageBox(sMessage);
			} else {
				var oTempData = {};
				oTempData.orderNo = "";
				oTempData.productID = sProduct;
				oTempData.customerNo = sCustomer;
				oTempData.issContent = sIssue;
                oTempData.action = "NEW";
                
                this._createOrder(oTempData);
				// var pCreateOrder = this.oDataManager.createOrder(oTempData);
				// pCreateOrder.then(function (oDataRecieved) {
				// 	oView.byId("productInput").setValue("");
				// 	oView.byId("CustomerInput").setValue("");
				// 	oView.byId("issueTextArea").setValue("");
				// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				// 	var sOrderNo = "orderdummy";
				// 	that._MasterRefresh();
				// 	oRouter.navTo("Detail", {
				// 		masterId: that.MasterId,
				// 		orderNo: sOrderNo
				// 	});
				// }).catch(function (err) {
				// 	var sMessage = that._PraseError(err);
				// 	that._ShowMessageBox(sMessage);
				// });

			}
        },
        
        _createOrder: function (oTempData) {
            //update Data from Model
            var that = this;
            var oView = this.getView();
            var oPromise = this.getOwnerComponent().oDataManager.createOrder(oTempData)
            oPromise.then(function() {
                oView.byId("productInput").setValue("");
                oView.byId("CustomerInput").setValue("");
                oView.byId("issueTextArea").setValue("");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                var sOrderNo = "orderdummy";
                that._MasterRefresh();
                oRouter.navTo("Detail", {
                    masterId: that.MasterId,
                    orderNo: sOrderNo
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                var sMessage = that._praseError(aError);
                that._showMessageBox(sMessage);
                this._busyDialog.close();
            }.bind(this));
        },

		_MasterRefresh: function () {
			var oView = sap.ui.getCore().byId(this.MasterId);
            // var oModel = oView.getModel();
            this._refreshMasterList(oView);
			// var oData = oModel.getData();
			// var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSHOWCASE_SRV/", true);
			// var sFilterSt = "ENTITY001Set?$expand=ENTITY002";
			// oDataModel.read(sFilterSt, {
			// 	context: null,
			// 	urlParameters: null,
			// 	async: false,
			// 	success: function (oDataRecieved, responce) {
			// 		oData.orderList = oDataRecieved.results;
			// 		oData.orderCount = oDataRecieved.results.length;
			// 		oModel.refresh();
			// 	},
			// 	error: function (err) {}
			// });

			// var aSorters = [];
			// var oList = oView.byId("orderMasterlist");
			// var oBinding = oList.getBinding("items");
			// aSorters.push(new sap.ui.model.Sorter("orderNo", true));
			// oBinding.sort(aSorters);
        },
        
        _refreshMasterList: function (oView) {
            //Set Data To Model
            var oPromise = this.getOwnerComponent().oDataManager.getMasterList()
            oPromise.then(function(aResults) {
                this._setMasterList(aResults, oView);
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

        _setMasterList: function (aResults, oView) {
            var oModel = oView.getModel();
            var oData = oModel.getData();
            var oModel= this.getView().getModel();
            if (aResults) {
				oData.orderList = aResults;
				oData.orderCount = aResults.length;
			}
            oModel.refresh();
            var aSorters = [];
			var oList = oView.byId("orderMasterlist");
			var oBinding = oList.getBinding("items");
			aSorters.push(new sap.ui.model.Sorter("orderNo", true));
            oBinding.sort(aSorters);
        },

		onCancelPress: function () {
			var that = this;
			var oView = this.getView();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				"Input data will be lost. Are you sure to continue?", {
					actions: ["Continue", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Continue") {
							oView.byId("productInput").setValue("");
							oView.byId("CustomerInput").setValue("");
							oView.byId("issueTextArea").setValue("");
							var oHistory = History.getInstance();
							var sPreviousHash = oHistory.getPreviousHash();
							if (sPreviousHash !== undefined) {
								window.history.go(-1);
							} else {
								var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
								oRouter.navTo("NotFound");
							}
						}
					}
				}
			);
		},

		onNavBack: function () {
			var oSplitApp = this.getView().getParent().getParent();
			var oMaster = oSplitApp.getMasterPages()[0];
			oSplitApp.toMaster(oMaster, "slide");
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Master", false);
		},

		// _PraseError: function (error) {
		// 	var oBody = error.response.body;
		// 	oBody = JSON.parse(oBody);
		// 	var sMessage = oBody.error.message.value;
		// 	return sMessage;
        // },
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
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf showcase.ZSHOWCASE004.view.Create
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf showcase.ZSHOWCASE004.view.Create
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf showcase.ZSHOWCASE004.view.Create
		 */
		// onExit: function () {
		// 	this.getView().byId("productInput").setValue("");
		// 	this.getView().byId("CustomerInput").setValue("");
		// 	this.getView().byId("issueTextArea").setValue("");
		// }

	});

});