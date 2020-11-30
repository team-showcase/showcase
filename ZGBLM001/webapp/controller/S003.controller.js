sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"showcase/ZGBLM001/util/Formatter",
	"showcase/ZGBLM001/util/DataManager"
], function (Controller, Filter, UIComponent, MessageBox, Formatter, DataManager) {
	"use strict";

	return Controller.extend("showcase.ZGBLM001.controller.S003", {

		formatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf showcase.ZSHOWCASE004.view.Detail
		 */
		onInit: function () {
			// this.oDataManager = new DataManager();

			var oDeviceModel = this.getOwnerComponent().getModel("device");
            var oDeviceData = oDeviceModel.getData();
			if (oDeviceData.isPhone === true) {
				var sProduct = "showcase.ZGBLM001.view.ProductInfoPhone";
				var sMiantSch = "showcase.ZGBLM001.view.MaintenanceSchPhone";
				var sMiantHis = "showcase.ZGBLM001.view.MaintenanceHisPhone";
				var sCustomer = "showcase.ZGBLM001.view.CustomerInfoPhone";
			} else {
				sProduct = "showcase.ZGBLM001.view.ProductInfo";
				sMiantSch = "showcase.ZGBLM001.view.MaintenanceSch";
				sMiantHis = "showcase.ZGBLM001.view.MaintenanceHis";
				sCustomer = "showcase.ZGBLM001.view.CustomerInfo";
			}
			var oProductFragment = sap.ui.xmlfragment(this.getView().getId(), sProduct, this);
			this.getView().byId("ProductFilter").addContent(oProductFragment);

			var oMiantSchFragment = sap.ui.xmlfragment(this.getView().getId(), sMiantSch, this);
			this.getView().byId("MiantSchFilter").addContent(oMiantSchFragment);

			var oMiantHisFragment = sap.ui.xmlfragment(this.getView().getId(), sMiantHis, this);
			this.getView().byId("MiantHisFilter").addContent(oMiantHisFragment);

			var oCustomerFragment = sap.ui.xmlfragment(this.getView().getId(), sCustomer, this);
			this.getView().byId("CustomerFilter").addContent(oCustomerFragment);

			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Detail").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function (oEvent) {
			var that = this;
			var sParameter = oEvent.getParameters().arguments.orderNo;
			if (sParameter === "orderdummy") {
				sParameter = "";
			}
			var sMasterId = oEvent.getParameters().arguments.masterId;
			this.MasterId = sMasterId;
			this._onLoad(sParameter, that);
		},

		_onLoad: function (sParameter, that) {
			

			// var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSHOWCASE_SRV/", true);
			// var sFilterSt = "ENTITY001Set(orderNo='" + sParameter + "')?$expand=ENTITY002,ENTITY003,ENTITY004,ENTITY005";

			var pDetailOrder = this.getOwnerComponent().oDataManager.getDetailOrder(sParameter);
			pDetailOrder.then(function (oDataRecieved) {
                var oScreenControl = {
				displayModeVis: true,
				editModeVis: false,
				footerVis: false,
				repairVis: false,
				deleteVis: false,
				closeVis: false,
				saveVis: false,
				cancelVis: false
                };
                var oStatusData = {
                    dateTimeFrom: "Error",
                    dateTimeTo: "Error",
                    repairPerson: "Error",
                    price: "Error",
                    currency: "Error",
                    repairContent: "Error"
                };
                var oModel = new sap.ui.model.json.JSONModel();
                var oData = {};
                // var oModel = this.getView().getModel();
                // var oData = oModel.getData();
				oData.MaintenanceOrder = oDataRecieved;
				oData.orderBackup = {};
				oData.ProductInformation = oDataRecieved.ENTITY002;
				oData.CustomerInformation = oDataRecieved.ENTITY003;
				oData.RepairedPersonInfo = oDataRecieved.ENTITY004;
				oData.repairBackup = {};
				oData.MaintenanceHistory = oDataRecieved.ENTITY005.results;
				//edit the button visable by status
				switch (oData.MaintenanceOrder.statusNo) {
				case "NEW":
					oScreenControl.footerVis = true;
					oScreenControl.repairVis = true;
					oScreenControl.deleteVis = true;
					oScreenControl.closeVis = false;
					break;
				case "REPAIRED":
					oScreenControl.footerVis = true;
					oScreenControl.repairVis = true;
					oScreenControl.deleteVis = false;
					oScreenControl.closeVis = true;
					break;
				case "CLOSED":
					oScreenControl.footerVis = false;
					// that.getView().byId("Toolbar").setVisible(false);
					// that.getView().byId("Toolbar").destroy();
					oScreenControl.repairVis = false;
					oScreenControl.deleteVis = false;
					oScreenControl.closeVis = false;
					break;
				default:
					oScreenControl.footerVis = false;
					oScreenControl.repairVis = false;
					oScreenControl.deleteVis = false;
					oScreenControl.closeVis = false;
				}
				oData.ScreenControl = oScreenControl;
				oData.screenBackup = {};
				oData.MaintenanceOrder.feedBack = parseInt(oData.MaintenanceOrder.feedBack, 10);
				oData.MaintenanceOrder.dateFromDis = that._dateEdit(oData.MaintenanceOrder.dateFrom);
				oData.MaintenanceOrder.timeFromDis = that._timeEdit(oData.MaintenanceOrder.timeFrom);
				oData.MaintenanceOrder.dateToDis = that._dateEdit(oData.MaintenanceOrder.dateTo);
				oData.MaintenanceOrder.timeToDis = that._timeEdit(oData.MaintenanceOrder.timeTo);
				if (oData.MaintenanceOrder.dateFromDis && oData.MaintenanceOrder.timeFromDis) {
					oData.MaintenanceOrder.dateTimeFrom = new Date(oData.MaintenanceOrder.dateFromDis + " " + oData.MaintenanceOrder.timeFromDis);
				} else {
					oData.MaintenanceOrder.dateTimeFrom = null;
				}
				if (oData.MaintenanceOrder.dateToDis && oData.MaintenanceOrder.timeToDis) {
					oData.MaintenanceOrder.dateTimeTo = new Date(oData.MaintenanceOrder.dateToDis + " " + oData.MaintenanceOrder.timeToDis);
				} else {
					oData.MaintenanceOrder.dateTimeTo = null;
				}
				oData.statusCtrl = oStatusData;
				oModel.setData(oData);
                that.getView().setModel(oModel);
                // oModel.refresh();
			}.bind(this)).catch(function (err) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				oRouter.navTo("NotFound");
			}.bind(this));
		},

		_dateEdit: function (oDate, bToserver) {
			if (oDate) {
				if (bToserver) {
					var oNewDate = new Date(Date.UTC(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 0, 0, 0));
				} else {
					oNewDate = new Date(oDate.getUTCFullYear(), oDate.getUTCMonth(), oDate.getUTCDate(), 0, 0, 0);
				}
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy.MM.dd"
				});
				var oDateEdited = dateFormat.format(oNewDate);
			} else {
				oDateEdited = "";
			}
			return oDateEdited;
		},

		_timeEdit: function (oTime) {
			if (oTime.ms !== 0) {
				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm:ss"
				});
				var oTimeEdited = timeFormat.format(new Date(oTime.ms));
			} else {
				oTimeEdited = "";
			}
			return oTimeEdited;
		},

		onPressRepair: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			jQuery.extend(true, oData.screenBackup, oData.ScreenControl);
			jQuery.extend(true, oData.orderBackup, oData.MaintenanceOrder);
			jQuery.extend(true, oData.repairBackup, oData.RepairedPersonInfo);

			oData.ScreenControl.editModeVis = true;
			oData.ScreenControl.displayModeVis = false;
			oData.ScreenControl.footerVis = true;
			oData.ScreenControl.repairVis = false;
			oData.ScreenControl.deleteVis = false;
			oData.ScreenControl.closeVis = false;
			oData.ScreenControl.saveVis = true;
			oData.ScreenControl.cancelVis = true;
			this.getView().byId("RepairInput").setValue(oData.RepairedPersonInfo.repPersonNo);

            oModel.refresh();
            var oRepairPersonModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oRepairPersonModel, "HelpRepair");
            this._getRepairPerson();
			this.onDateFromChange();
			this.onDateToChange();
			this._initRepairCheck();
			this.onPriceChange();
			this.onCurrencyChange();
			this.onContentChange();

			var oIconTabBar = this.getView().byId("IconTabBar");
			oIconTabBar.setSelectedKey("MiantSchFilterKey");
		},

		_getRepairPerson: function () {
		// 	var aRepairResult = this.getOwnerComponent().oDataManager.getDetailRepair();
		// 	var oRepairInfoModel = new sap.ui.model.json.JSONModel();
		// 	var oRepairInfoData = {};
		// 	oRepairInfoData.RepairInfo = aRepairResult;
		// 	oRepairInfoModel.setData(oRepairInfoData);
		// 	this.getView().setModel(oRepairInfoModel, "HelpRepair");
        // },
            this._busyDialog = new sap.m.BusyDialog();
            this._busyDialog.open();
            //Set Data To Model
            var oRepairPersonModel = this.getView().getModel("HelpRepair");
            var oPromise = this.getOwnerComponent().oDataManager.getDetailRepair()
            oPromise.then(function(aResults) {
                oRepairPersonModel.setData({
                    "RepairInfo" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

		RepairValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment(
					"showcase.ZGBLM001.view.RepairPersonHelp",
					this
				);
				this.getView().addDependent(this._valueHelpDialog3);
			}

			// create a filter for the binding
			this._valueHelpDialog3.getBinding("items").filter([new Filter(
				"repPersonNo",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		_repairValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"repPersonNo",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_repairValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var repairInput = this.getView().byId(this.inputId);
				repairInput.setValue(oSelectedItem.getTitle());
				this.onRepairChange();
			}
			evt.getSource().getBinding("items").filter([]);
		},

		onDateFromChange: function () {
			var bErrorFlag = false;
			var oDateFrom = this.getView().byId("dateTimeFrom").getDateValue();
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (oDateFrom) {
				oData.statusCtrl.dateTimeFrom = "None";
			} else {
				oData.statusCtrl.dateTimeFrom = "Error";
				bErrorFlag = true;
			}
			oModel.refresh();
			return bErrorFlag;
		},

		onDateToChange: function () {
			var bErrorFlag = false;
			var oDateTo = this.getView().byId("dateTimeTo").getDateValue();
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (oDateTo) {
				oData.statusCtrl.dateTimeTo = "None";
			} else {
				oData.statusCtrl.dateTimeTo = "Error";
				bErrorFlag = true;
			}
			oModel.refresh();
			return bErrorFlag;
		},

		onRepairChange: function () {
			var bErrorFlag = false;
			var oModel = this.getView().getModel();
			var oData = oModel.getData();

			var sRepairPerson = this.getView().byId("RepairInput").getValue();
			if (!sRepairPerson) {
				oData.statusCtrl.repairPerson = "Error";
				bErrorFlag = true;
			} else {
				var oPersonData = this.getView().getModel("HelpRepair").getData();
				var aPersonData = oPersonData.RepairInfo;
				var oSelectedPerson = aPersonData.find(aPersonData => aPersonData.repPersonNo === sRepairPerson);
				if (oSelectedPerson) {
					oData.RepairedPersonInfo = oSelectedPerson;
					oData.statusCtrl.repairPerson = "None";
				} else {
					oData.statusCtrl.repairPerson = "Error";
					bErrorFlag = true;
					oData.RepairedPersonInfo = null;
				}
			}
			oModel.refresh();
			return bErrorFlag;
		},

		_initRepairCheck: function () {
			var sRepairPerson = this.getView().byId("RepairInput").getValue();
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (!sRepairPerson) {
				oData.statusCtrl.repairPerson = "Error";
			} else {
				oData.statusCtrl.repairPerson = "None";
			}
			oModel.refresh();
		},

		onPriceChange: function () {
			var bErrorFlag = false;
			var sPrice = this.getView().byId("price").getValue();
			var nPrice = parseInt(sPrice, 10);
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (nPrice && nPrice !== 0) {
				oData.statusCtrl.price = "None";
			} else {
				oData.statusCtrl.price = "Error";
				bErrorFlag = true;
			}
			oModel.refresh();
			return bErrorFlag;
		},

		onCurrencyChange: function () {
			var bErrorFlag = false;
			var sCurrency = this.getView().byId("currency").getValue();
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (sCurrency) {
				oData.statusCtrl.currency = "None";
			} else {
				oData.statusCtrl.currency = "Error";
				bErrorFlag = true;
			}
			oModel.refresh();
			return bErrorFlag;
		},

		onContentChange: function () {
			var bErrorFlag = false;
			var sContent = this.getView().byId("content").getValue();
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			if (sContent) {
				oData.statusCtrl.repairContent = "None";
			} else {
				oData.statusCtrl.repairContent = "Error";
				bErrorFlag = true;
			}
			oModel.refresh();
			return bErrorFlag;
		},

		onAcceptPress: function () {
			var sMessage = this._editErrorMessage.bind(this)();
			if (sMessage) {
				this._showMessageBox(sMessage);
			} else {
				var oUpdateOrder = this._orderUpdateEdit.bind(this)();
                // var oError = this._orderUpdateExecute.bind(this, oUpdateOrder)();
                this._orderUpdateExecute(oUpdateOrder);
			}
		},

		_orderUpdateEdit: function () {
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HH:mm:ss"
			});
			var oDateTimeFormat = new sap.ui.model.odata.type.DateTime({
				pattern: "PThh'H'mm'M'ss'S'"
			});
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			//date from 
			var oDateTimeFrom = this.getView().byId("dateTimeFrom").getDateValue();
			var oDateFrom = new Date(Date.UTC(oDateTimeFrom.getFullYear(), oDateTimeFrom.getMonth(), oDateTimeFrom.getDate(), 0, 0, 0));
			//date to
			var oDateTimeTo = this.getView().byId("dateTimeTo").getDateValue();
			var oDateTo = new Date(Date.UTC(oDateTimeTo.getFullYear(), oDateTimeTo.getMonth(), oDateTimeTo.getDate(), 0, 0, 0));
			//time from
			var sDateTimeFrom = this.getView().byId("dateTimeFrom").getValue();
			var sTimeFrom = sDateTimeFrom.substr(-8);
			var oTimeFrom = timeFormat.parse(sTimeFrom);
			//time to
			var sDateTimeTo = this.getView().byId("dateTimeTo").getValue();
			var sTimeTo = sDateTimeTo.substr(-8);
			var oTimeTo = timeFormat.parse(sTimeTo);

			var oTempData = {};
			oTempData.orderNo = oData.MaintenanceOrder.orderNo;
			oTempData.statusNo = oData.MaintenanceOrder.statusNo;
			oTempData.productID = oData.MaintenanceOrder.productID;
			oTempData.customerNo = oData.MaintenanceOrder.customerNo;
			oTempData.issDate = oData.MaintenanceOrder.issDate;
			oTempData.issTime = oData.MaintenanceOrder.issTime;
			oTempData.issContent = oData.MaintenanceOrder.issContent;
			oTempData.repPersonNo = this.getView().byId("RepairInput").getValue();
			oTempData.dateFrom = oDateFrom;
			oTempData.timeFrom = oDateTimeFormat.formatValue(oTimeFrom, 'string');
			oTempData.dateTo = oDateTo;
			oTempData.timeTo = oDateTimeFormat.formatValue(oTimeTo, 'string');
			oTempData.repContent = oData.MaintenanceOrder.repContent;
			oTempData.price = oData.MaintenanceOrder.price;
			oTempData.currKey = oData.MaintenanceOrder.currKey;
			oTempData.feedBack = String(oData.MaintenanceOrder.feedBack);
			oTempData.deleteFlag = oData.MaintenanceOrder.deleteFlag;
			oTempData.action = "REPAIR";

			return oTempData;

		},

		_orderUpdateExecute: function (oUpdateData) {
			var that = this;
			var oUpdateOrder = oUpdateData;
			var sOptions = "/ENTITY001Set(orderNo='" + oUpdateOrder.orderNo + "')";
            // this.oDataManager.updateOrder(sOptions, oUpdateOrder, that);
            this._updateOrder(sOptions, oUpdateOrder, that);
        },
        
        _updateOrder: function (sOptions, oUpdateOrder, that) {
            //update Data from Model
            var oPromise = this.getOwnerComponent().oDataManager.updateOrder(sOptions, oUpdateOrder)
            oPromise.then(function() {
                this._onLoad(oUpdateOrder.orderNo, that);
				this._MasterRefresh();
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                var sMessage = this._praseError(aError);
                this._showMessageBox(sMessage);
                this._busyDialog.close();
            }.bind(this));
        },


		_editErrorMessage: function () {
			var sMessage = "";
			var bDateFromErr = this.onDateFromChange();
			if (bDateFromErr) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_DATEFROM");
			}
			var bDateToErr = this.onDateToChange();
			if (bDateToErr && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ERROR_DATETO");
			} else if (bDateToErr && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_DATETO");
			}
			var bRepairErr = this.onRepairChange();
			if (bRepairErr && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ERROR_REPAIR");
			} else if (bRepairErr && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_REPAIR");
			}
			var bPriceErr = this.onPriceChange();
			if (bPriceErr && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ERROR_PRICE");
			} else if (bPriceErr && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_PRICE");
			}
			var bCurrencyErr = this.onCurrencyChange();
			if (bCurrencyErr && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ERROR_CURRENCY");
			} else if (bCurrencyErr && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_CURRENCY");
			}
			var bContentErr = this.onContentChange();
			if (bContentErr && sMessage) {
				sMessage = sMessage + "\n" + this.oBundle.getText("ZZ_ERROR_CONTENT");
			} else if (bContentErr && !sMessage) {
				sMessage = sMessage + this.oBundle.getText("ZZ_ERROR_CONTENT");
			}
			return sMessage;
		},

		onCancelPress: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var oScreenData = {};
			var oOrderData = {};
			var oRepairData = {};
			jQuery.extend(true, oScreenData, oData.screenBackup);
			jQuery.extend(true, oOrderData, oData.orderBackup);
			jQuery.extend(true, oRepairData, oData.repairBackup);
			oData.ScreenControl = oScreenData;
			oData.MaintenanceOrder = oOrderData;
			oData.RepairedPersonInfo = oRepairData;
			oModel.refresh();
		},

		onPressClose: function () {
			var oView = this.getView();
			var oDialog = oView.byId("CloseConfirm");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLM001.view.CloseConfirm", this);
				oView.addDependent(oDialog);
				oDialog.open();
			} else {
				oDialog.open();
			}
		},

		onCloseConfirm: function () {
			var oData = this.getView().getModel().getData();
			var oTempData = {};
			oTempData.orderNo = oData.MaintenanceOrder.orderNo;
			oTempData.statusNo = oData.MaintenanceOrder.statusNo;
			oTempData.productID = oData.MaintenanceOrder.productID;
			oTempData.customerNo = oData.MaintenanceOrder.customerNo;
			oTempData.issDate = oData.MaintenanceOrder.issDate;
			oTempData.issTime = oData.MaintenanceOrder.issTime;
			oTempData.issContent = oData.MaintenanceOrder.issContent;
			oTempData.repPersonNo = oData.MaintenanceOrder.repPersonNo;
			oTempData.dateFrom = oData.MaintenanceOrder.dateFrom;
			oTempData.timeFrom = oData.MaintenanceOrder.timeFrom;
			oTempData.dateTo = oData.MaintenanceOrder.dateTo;
			oTempData.timeTo = oData.MaintenanceOrder.timeTo;
			oTempData.repContent = oData.MaintenanceOrder.repContent;
			oTempData.price = oData.MaintenanceOrder.price;
			oTempData.currKey = oData.MaintenanceOrder.currKey;
			var nFeedBack = this.getView().byId("CloseFeedBack").getValue();
			oTempData.feedBack = nFeedBack.toString();
			oTempData.deleteFlag = oData.MaintenanceOrder.deleteFlag;
			oTempData.action = "CLOSE";

			this.getView().byId("CloseConfirm").close();
			this._orderUpdateExecute(oTempData);
		},

		onCloseCancel: function () {
			this.getView().byId("CloseConfirm").close();
		},

		onPressDelete: function (oEvent) {
			var that = this;
			var sDeleteConfirm = this.oBundle.getText("ZZ_MESSAGE_DELETECONFIRM");
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				sDeleteConfirm, {
					actions: ["Continue", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Continue") {
							that._OrderDelete(that);
						}
					}
				}
			);
		},

		_OrderDelete: function (that) {
			var oData = that.getView().getModel().getData();
			var oTempData = {};
			oTempData.orderNo = oData.MaintenanceOrder.orderNo;
			oTempData.statusNo = oData.MaintenanceOrder.statusNo;
			oTempData.productID = oData.MaintenanceOrder.productID;
			oTempData.customerNo = oData.MaintenanceOrder.customerNo;
			oTempData.issDate = oData.MaintenanceOrder.issDate;
			oTempData.issTime = oData.MaintenanceOrder.issTime;
			oTempData.issContent = oData.MaintenanceOrder.issContent;
			oTempData.repPersonNo = oData.MaintenanceOrder.repPersonNo;
			oTempData.dateFrom = oData.MaintenanceOrder.dateFrom;
			oTempData.timeFrom = oData.MaintenanceOrder.timeFrom;
			oTempData.dateTo = oData.MaintenanceOrder.dateTo;
			oTempData.timeTo = oData.MaintenanceOrder.timeTo;
			oTempData.repContent = oData.MaintenanceOrder.repContent;
			oTempData.price = oData.MaintenanceOrder.price;
			oTempData.currKey = oData.MaintenanceOrder.currKey;
			oTempData.feedBack = oData.MaintenanceOrder.feedBack.toString();
			oTempData.deleteFlag = oData.MaintenanceOrder.deleteFlag;
			oTempData.action = "DELETE";

			that._orderUpdateExecute(oTempData);
		},

		onNavBack: function () {
			var oSplitApp = this.getView().getParent().getParent();
			var oMaster = oSplitApp.getMasterPages()[0];
			oSplitApp.toMaster(oMaster, "slide");
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("Master", false);
		},

		_MasterRefresh: function () {
			var oView = sap.ui.getCore().byId(this.MasterId);
			
			// var oData = oModel.getData();
			// var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSHOWCASE_SRV/", true);
            // var aOrderList = this.oDataManager.getMasterList();
            this._refreshMasterList(oView);

			// oData.orderList = aOrderList;
			// oData.orderCount = aOrderList.length;
			// oModel.refresh();

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
		 * @memberOf showcase.ZSHOWCASE004.view.Detail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf showcase.ZSHOWCASE004.view.Detail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf showcase.ZSHOWCASE004.view.Detail
		 */
		//	onExit: function() {
		//
		//	}

	});

});