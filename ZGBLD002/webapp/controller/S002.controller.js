sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/layout/VerticalLayout",
	"sap/m/RatingIndicator",
    "sap/ui/core/mvc/Controller",
    "showcase/ZGBLD002/util/Formatter",
	"showcase/ZGBLD002/util/DataManager"
], function (MessageBox, MessageToast, Button, Dialog, Text, VerticalLayout, RatingIndicator, Controller, Formatter, DataManager) {
	"use strict";

	return Controller.extend("showcase.ZGBLD002.controller.S002", {
		formatter: Formatter,

		onInit: function () {
			// this.oDataManager = new DataManager();
			var sParameter = "";
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oSelf = this;
			var oData = {};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
            this.getView().setModel(oModel);

			//define the repair check model
			var oRepairCheckModel = new sap.ui.model.json.JSONModel();
			var oRepairCheck = {
				"dateTimeFrom": "Error",
				"dateTimeTo": "Error",
				"repairPerson": "Error",
				"price": "Error",
				"currency": "Error",
				"content": "Error",
				"checkmessage": ""
			};
			oRepairCheckModel.setData(oRepairCheck);
            this.getView().setModel(oRepairCheckModel, "RepairCheck");
           
            

			//OLD_define repair person model
			// var oRepairPersonModel = new sap.ui.model.json.JSONModel();
			// var oPersonResult = {};
			// var aRepairPerson = this.oDataManager.getRepairPerson();
			// oPersonResult.repairPerson = aRepairPerson;
			// oRepairPersonModel.setData(oPersonResult);
            // this.getView().setModel(oRepairPersonModel, "RepairPerson");

            //define repair person model
            this._busyDialog = new sap.m.BusyDialog();
            this._busyDialog.open();
            var oRepairPersonModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oRepairPersonModel, "RepairPerson");
            this._getRepairPerson();

			// get the order
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("S002").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			var oSelf = this;
			// var oModel = new sap.ui.model.json.JSONModel();
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			var oComponent = sap.ui.component(sComponentId);
			var oStartupParameters = oComponent.getComponentData().startupParameters;
			var aParameter = oStartupParameters.orderNo;
			if (aParameter){
				var sParameter = aParameter.toString();
			}else{
				sParameter = "";
            }
            
			// var oData = this._editMianInfo(oSelf, sParameter);
			// oModel.setData(oData);
            // this.getView().setModel(oModel);
            var oModel = new sap.ui.model.json.JSONModel();
            this._editMianInfo(oSelf, sParameter);
		},

		_editMianInfo: function (oSelf, sParameter) {
			//Set Data To Model
            var oData = {};
            var oModel = this.getView().getModel();
            var oPromise = this.getOwnerComponent().oDataManager.getMaintenanceOrder(sParameter)
            oPromise.then(function(aDataRecieved) {
                this._setMaintenanceOrder(aDataRecieved, oSelf);
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
		},

		_dateTimeFormat: function (oDate, oTime) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy.MM.dd"
			});
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				// pattern: "KK:mm:ss a"
				pattern: "HH:mm:ss"
			});
			if (oDate && oTime) {
				var dateStr = dateFormat.format(new Date(oDate.getTime()));
				var timeStr = timeFormat.format(new Date(oTime.ms));

				var sDateTime = dateStr + " " + " " + timeStr;
				return sDateTime;
			}
		},

		onPressRepair: function () {

			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			oData.ScreenControl.displayModeVis = false;
			oData.ScreenControl.editModeVis = true;
			oModel.refresh();
			var oMaintenanceInfo = this.getView().byId("MaintenanceInfo");
			this.getView().byId("ObjectPageLayout").setSelectedSection(oMaintenanceInfo);
			var oRepairPerson = this.getView().byId("repairPerson");
			oRepairPerson.setValue(oData.RepairedPersonInfo.repPersonNo);
			//edit the date time picker
			var oDayFrom = oData.MaintenanceOrder.dateFrom;
			var oTimeFrom = oData.MaintenanceOrder.timeFrom;
			var oDayTo = oData.MaintenanceOrder.dateTo;
			var oTimeTo = oData.MaintenanceOrder.timeTo;
			if (oDayTo && oTimeTo) {
				var oDateTimeFrom = new Date(oDayFrom.getTime() + oTimeFrom.ms);
				var oDateTimeTo = new Date(oDayTo.getTime() + oTimeTo.ms);
				this.getView().byId("dateTimeFrom").setDateValue(oDateTimeFrom);
				this.getView().byId("dateTimeTo").setDateValue(oDateTimeTo);
			}
			this._repairInfoCheck(this);
		},

		_repairInfoCheck: function (oSelf) {
			var oView = this.getView();
			var oModel = oView.getModel("RepairCheck");
			var sDateTimeFrom = oView.byId("dateTimeFrom").getValue();
			oModel.setProperty("/dateTimeFrom", oSelf._RepairDateCheck(sDateTimeFrom));
			var sDateTimeTo = oView.byId("dateTimeTo").getValue();
			oModel.setProperty("/dateTimeTo", oSelf._RepairDateCheck(sDateTimeTo));
			var sRepairPerson = oView.byId("repairPerson").getValue();
			oModel.setProperty("/repairPerson", oSelf._RepairDateCheck(sRepairPerson));
			var sCurrency = oView.byId("currency").getValue();
			oModel.setProperty("/currency", oSelf._RepairDateCheck(sCurrency));
			var sContent = oView.byId("content").getValue();
			oModel.setProperty("/content", oSelf._RepairDateCheck(sContent));
			var nPrice = parseInt(oView.byId("price").getValue(), 10);
			if (isNaN(nPrice) || (nPrice === 0)) {
				oModel.setProperty("/price", "Error");
			} else {
				oModel.setProperty("/price", "None");
			}
		},

		_RepairDateCheck: function (sValue) {
			if (sValue) {
				return "None";
			} else {
				return "Error";
			}
		},

		onSelPerChange: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var sRepairPersonId = this.getView().byId("repairPerson").getSelectedKey();
			var aPersonData = this.getView().getModel("RepairPerson").getData().repairPerson;
			// var oSelectedPerson = aPersonData.find(aPersonData => aPersonData.repPersonNo === sRepairPersonId);
            // oData.RepairedPersonInfo = oSelectedPerson;
            var oSelectedPerson = aPersonData.filter(function(currentObject){
                return currentObject.repPersonNo === sRepairPersonId;
            });
            if (oSelectedPerson.length === 0) {
                oData.RepairedPersonInfo = {};
            } else {
                oData.RepairedPersonInfo = oSelectedPerson[0];
            }
			oModel.refresh();
		},
		//fired when input data changed
		onRepairInfoChange: function () {
			this._repairInfoCheck(this);
			var oModel = this.getView().getModel();
			var oCheckModel = this.getView().getModel("RepairCheck");
			var oData = oModel.getData();
			var sRepairPersonId = this.getView().byId("repairPerson").getSelectedKey();
			var aPersonData = this.getView().getModel("RepairPerson").getData().repairPerson;
			// var oSelectedPerson = aPersonData.find(aPersonData => aPersonData.repPersonNo === sRepairPersonId);
            // if (!oSelectedPerson) {
			// 	oData.RepairedPersonInfo = {};
			// 	oCheckModel.setProperty("/repairPerson", "Error");
			// } else {
			// 	oCheckModel.setProperty("/repairPerson", "None");
            // }
            var oSelectedPerson = aPersonData.filter(function(currentObject){
                return currentObject.repPersonNo === sRepairPersonId;
            });
            if (oSelectedPerson.length === 0) {
                oData.RepairedPersonInfo = {};
			    oCheckModel.setProperty("/repairPerson", "Error");
            } else {
                oCheckModel.setProperty("/repairPerson", "None");
            }

			oModel.refresh();
			oCheckModel.refresh();
		},

		onRepairAccept: function () {
			var oSelf = this;
			var oView = this.getView();
			var sMessage = "";
			var sRepairCheckFlg = false;
			var oModel = this.getView().getModel();
			var oData = oModel.getData();

			var sDateTimeFrom = oView.byId("dateTimeFrom").getValue();
			if (!sDateTimeFrom) {
				sMessage = sMessage + "Please input Date & Time(From)";
				sRepairCheckFlg = true;
			}
			var sDateTimeTo = oView.byId("dateTimeTo").getValue();
			if (!sDateTimeTo) {
				sMessage = sMessage + "\n" + "Please input Date & Time(To)";
				sRepairCheckFlg = true;
			}
			var sRepairPerson = oView.byId("repairPerson").getValue();
			if (!sRepairPerson) {
				sMessage = sMessage + "\n" + "Please input Repair Person Number";
				sRepairCheckFlg = true;
			}
			var nPrice = parseInt(oView.byId("price").getValue(), 10);
			if (!nPrice) {
				sMessage = sMessage + "\n" + "Please input Price";
				sRepairCheckFlg = true;
			}
			var sCurrency = oView.byId("currency").getValue();
			if (!sCurrency) {
				sMessage = sMessage + "\n" + "Please input Currency";
				sRepairCheckFlg = true;
			}
			var sContent = oView.byId("content").getValue();
			if (!sContent) {
				sMessage = sMessage + "\n" + "Please input Repair Content";
				sRepairCheckFlg = true;
			}
			if (sRepairCheckFlg) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					sMessage, {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd/MM/yyyy"
				});
				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm:ss"
				});

				var oType = new sap.ui.model.odata.type.DateTime({
					pattern: "PThh'H'mm'M'ss'S'"
				});

				var oDateTimeFrom = this.getView().byId("dateTimeFrom").getValue();
				var sDayFrom = oDateTimeFrom.substr(0, 10);
				var sTimeFrom = oDateTimeFrom.substr(-8);
				sTimeFrom = timeFormat.parse(sTimeFrom);

				oData.MaintenanceOrder.dateFrom = sDayFrom + "T00:00:00";
				oData.MaintenanceOrder.timeFrom = oType.formatValue(sTimeFrom, 'string');
				// oData.MaintenanceOrder.timeFrom = new sap.ui.model.odata.type.Time(sTimeFrom);

				var oDateTimeTo = this.getView().byId("dateTimeTo").getValue();
				var sDayTo = oDateTimeTo.substr(0, 10);
				var sTimeTo = oDateTimeTo.substr(-8);
				sTimeTo = timeFormat.parse(sTimeTo);

				oData.MaintenanceOrder.dateTo = sDayTo + "T00:00:00";
				oData.MaintenanceOrder.timeTo = oType.formatValue(sTimeTo, 'string');
				// oData.MaintenanceOrder.timeTo = timeFormat.parse(sTimeTo);

				var oMaintOrderData = oSelf.getView().getModel().getData();

				var oTempData = {};
                oTempData.orderNo = oMaintOrderData.MaintenanceOrder.orderNo;
				oTempData.statusNo = oMaintOrderData.MaintenanceOrder.statusNo;
				oTempData.productID = oMaintOrderData.MaintenanceOrder.productID;
				oTempData.customerNo = oMaintOrderData.MaintenanceOrder.customerNo;
				oTempData.issDate = oMaintOrderData.MaintenanceOrder.issDate;
				oTempData.issTime = oMaintOrderData.MaintenanceOrder.issTime;
				oTempData.issContent = oMaintOrderData.MaintenanceOrder.issContent;
				var sRepairPersonId = oView.byId("repairPerson").getSelectedKey();
				oTempData.repPersonNo = sRepairPersonId;
				oTempData.dateFrom = oMaintOrderData.MaintenanceOrder.dateFrom;
				oTempData.timeFrom = oMaintOrderData.MaintenanceOrder.timeFrom;
				oTempData.dateTo = oMaintOrderData.MaintenanceOrder.dateTo;
				oTempData.timeTo = oMaintOrderData.MaintenanceOrder.timeTo;

				var sPrice = oView.byId("price").getValue();
				var sCurrency = oView.byId("currency").getValue();
				var sContent = oView.byId("content").getValue();
				oTempData.repContent = sContent;
				oTempData.price = sPrice;
				oTempData.currKey = sCurrency;
				oTempData.feedBack = String(oMaintOrderData.MaintenanceOrder.feedBack);
				String(oMaintOrderData.MaintenanceOrder.feedBack);
				oTempData.deleteFlag = oMaintOrderData.MaintenanceOrder.deleteFlag;
				oTempData.action = "REPAIR";

				this._updateOrder(oSelf, oTempData);
			}
		},

		onRepairCancel: function () {
			var oSelf = this;
			var oMaintOrderData = oSelf.getView().getModel().getData();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				"Input data will be lost. Are you sure to continue?", {
					actions: ["Continue", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizecCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Continue") {
							oSelf.byId("dateTimeFrom").setValue("");
							oSelf.byId("dateTimeTo").setValue("");
							var oModel = oSelf.getView().getModel();
							var oBackUpData = oSelf._editMianInfo(oSelf, oMaintOrderData.MaintenanceOrder.orderNo);
							oModel.setData(oBackUpData);
							oModel.refresh();
						}
					}
				}
			);
		},

		onPressClose: function () {
			var oView = this.getView();
			var oDialog = oView.byId("CloseConfirm");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLD002.view.CloseConfirm", this);
				oView.addDependent(oDialog);
				oDialog.open();
			} else {
				oDialog.open();
			}
		},

		onSubmitConfirm: function () {
			var oSelf = this;
			var oView = this.getView();
			oView.byId("CloseConfirm").close();
			var oFeedBackRate = oView.byId("CloseFeedBack").getValue();
			var sFeedBackRate = oFeedBackRate.toString();
			var oMaintOrderData = oSelf.getView().getModel().getData();
			var oTempData = {};
			oTempData.orderNo = oMaintOrderData.MaintenanceOrder.orderNo;
			oTempData.languageKey = oMaintOrderData.MaintenanceOrder.languageKey;
			oTempData.statusNo = oMaintOrderData.MaintenanceOrder.statusNo;
			oTempData.productID = oMaintOrderData.MaintenanceOrder.productID;
			oTempData.customerNo = oMaintOrderData.MaintenanceOrder.customerNo;
			oTempData.issDate = oMaintOrderData.MaintenanceOrder.issDate;
			oTempData.issTime = oMaintOrderData.MaintenanceOrder.issTime;
			oTempData.issContent = oMaintOrderData.MaintenanceOrder.issContent;
			oTempData.repPersonNo = oMaintOrderData.MaintenanceOrder.repPersonNo;
			oTempData.dateFrom = oMaintOrderData.MaintenanceOrder.dateFrom;
			oTempData.timeFrom = oMaintOrderData.MaintenanceOrder.timeFrom;
			oTempData.dateTo = oMaintOrderData.MaintenanceOrder.dateTo;
			oTempData.timeTo = oMaintOrderData.MaintenanceOrder.timeTo;
			oTempData.repContent = oMaintOrderData.MaintenanceOrder.repContent;
			oTempData.price = oMaintOrderData.MaintenanceOrder.price;
			oTempData.currKey = oMaintOrderData.MaintenanceOrder.currKey;
			oTempData.feedBack = sFeedBackRate;
			oTempData.deleteFlag = oMaintOrderData.MaintenanceOrder.deleteFlag;
			oTempData.action = "CLOSE";

			this._updateOrder(oSelf, oTempData);
		},

		onCancelConfirm: function () {
			this.getView().byId("CloseConfirm").close();
		},

		onPressDelete: function (oEvent) {
			var oSelf = this;
			var sDeleteConfirm = this.oBundle.getText("ZZ_MESSAGE_DELETECONFIRM");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				sDeleteConfirm, {
					actions: ["Continue", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Continue") {
							oSelf._MaintenanceOrderDelete(oSelf);
						}
					}
				}
			);
		},

		_MaintenanceOrderDelete: function (oSelf) {
			var oMaintOrderData = oSelf.getView().getModel().getData();
			// var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSHOWCASE_SRV/", true);
			var oTempData = {};
			oTempData.orderNo = oMaintOrderData.MaintenanceOrder.orderNo;
			oTempData.languageKey = oMaintOrderData.MaintenanceOrder.languageKey;
			oTempData.statusNo = oMaintOrderData.MaintenanceOrder.statusNo;
			oTempData.productID = oMaintOrderData.MaintenanceOrder.productID;
			oTempData.customerNo = oMaintOrderData.MaintenanceOrder.customerNo;
			oTempData.issDate = oMaintOrderData.MaintenanceOrder.issDate;
			oTempData.issTime = oMaintOrderData.MaintenanceOrder.issTime;
			oTempData.issContent = oMaintOrderData.MaintenanceOrder.issContent;
			oTempData.repPersonNo = oMaintOrderData.MaintenanceOrder.repPersonNo;
			oTempData.dateFrom = oMaintOrderData.MaintenanceOrder.dateFrom;
			oTempData.timeFrom = oMaintOrderData.MaintenanceOrder.timeFrom;
			oTempData.dateTo = oMaintOrderData.MaintenanceOrder.dateTo;
			oTempData.timeTo = oMaintOrderData.MaintenanceOrder.timeTo;
			oTempData.repContent = oMaintOrderData.MaintenanceOrder.repContent;
			oTempData.price = oMaintOrderData.MaintenanceOrder.price;
			oTempData.currKey = oMaintOrderData.MaintenanceOrder.currKey;
			oTempData.feedBack = String(oMaintOrderData.MaintenanceOrder.feedBack);
			oTempData.deleteFlag = oMaintOrderData.MaintenanceOrder.deleteFlag;
			oTempData.action = "DELETE";

			this._updateOrder(oSelf, oTempData);
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
        },
         
        _getRepairPerson: function () {
            //Set Data To Model
            var oRepairPersonModel = this.getView().getModel("RepairPerson");
            var oPromise = this.getOwnerComponent().oDataManager.getRepairPerson()
            oPromise.then(function(aResults) {
                oRepairPersonModel.setData({
                    "repairPerson" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

        _setMaintenanceOrder: function (oDataRecieved, oSelf) {
            var oScreenControl = {
				"ScreenControl": {
					"displayModeVis": true,
					"editModeVis": false,
					"repairVis": false,
					"deleteVis": false,
					"closeVis": false
				}
            };
            //Set Data To Model
            var oData = {};
            oData.MaintenanceOrder = oDataRecieved;
			oData.ProductInformation = oDataRecieved.ENTITY002;
			oData.CustomerInformation = oDataRecieved.ENTITY003;
			oData.RepairedPersonInfo = oDataRecieved.ENTITY004;
            oData.MaintenanceHistory = oDataRecieved.ENTITY005.results;
            
			//edit the button visable by status
			switch (oData.MaintenanceOrder.statusNo) {
			case "NEW":
				oScreenControl.ScreenControl.repairVis = true;
				oScreenControl.ScreenControl.deleteVis = true;
				oScreenControl.ScreenControl.closeVis = false;
				break;
			case "REPAIRED":
				oScreenControl.ScreenControl.repairVis = true;
				oScreenControl.ScreenControl.deleteVis = false;
				oScreenControl.ScreenControl.closeVis = true;
				break;
			case "CLOSED":
				oScreenControl.ScreenControl.repairVis = false;
				oScreenControl.ScreenControl.deleteVis = false;
				oScreenControl.ScreenControl.closeVis = false;
				break;
			default:
				oScreenControl.ScreenControl.repairVis = false;
				oScreenControl.ScreenControl.deleteVis = false;
				oScreenControl.ScreenControl.closeVis = false;
			}
			oData.ScreenControl = oScreenControl.ScreenControl;
			//edit the data from backend
			oData.MaintenanceOrder.feedBack = parseInt(oData.MaintenanceOrder.feedBack, 10);
			oData.DateFromDisplay = oSelf._dateTimeFormat(oData.MaintenanceOrder.dateFrom, oData.MaintenanceOrder.timeFrom);
			oData.DateToDisplay = oSelf._dateTimeFormat(oData.MaintenanceOrder.dateTo, oData.MaintenanceOrder.timeTo);
            var oModel= oSelf.getView().getModel();
            oModel.setData(oData);
            this.getView().setModel(oModel);
        },
        _updateOrder: function (oSelf, oTempData) {
            //update Data from Model
            var oPromise = this.getOwnerComponent().oDataManager.updateOrder(oTempData)
            oPromise.then(function() {
                var oModel = this.getView().getModel();
                var oBackUpData = this._editMianInfo(oSelf, oTempData["orderNo"]);
                oModel.setData(oBackUpData);
                oModel.refresh();
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                var sMessage = this._praseError(aError);
                this._showMessageBox(sMessage);
                this._busyDialog.close();
            }.bind(this));
        }

	});

});