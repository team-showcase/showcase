sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"showcase/ZGBLL001/util/Formatter",
	"showcase/ZGBLL001/util/DataManager"
], function (Controller, MessageBox, Formatter, DataManager) {
	"use strict";

	return Controller.extend("showcase.ZGBLL001.controller.S002", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf showcase.ZGBLL001.view.ZZorderlist
		 */
		onInit: function () {
			// this.oDataManager = new DataManager();
            var oModel = new sap.ui.model.json.JSONModel();
            this._busyDialog = new sap.m.BusyDialog();
            this._busyDialog.open();
			var oValueHelpDate = {};
			//product number
            // oValueHelpDate.productNumberHelp = this.oDataManager.getProductInfo();
            var oProductInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oProductInfoModel, "HelpProductNumber");
            this._getProductNumber();

			//customer number
            // oValueHelpDate.customerNoHelp = this.oDataManager.getCustomerInfo();
            var oCustomerInfoModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oCustomerInfoModel, "HelpCustomerNo");
			this._getCustomerInfo();

			//repair person number
            // oValueHelpDate.repPersonNoHelp = this.oDataManager.getRepairInfo();
            var oRepairPersonModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oRepairPersonModel, "HelpRepPersonNo");
            this._getRepairInfo();

			//set the Status select value use front end data
			var oStatusHelp = {
				"statusHelp": [{
					"status": "NEW"
				}, {
					"status": "REPAIRED"
				}, {
					"status": "CLOSED"
				}, {
					"status": "DELETED"
				}]
			};
			//decalre the IconTabFilter
			var oIconFilter = {
				"orderAll": 0,
				"orderNew": 0,
				"orderRepaired": 0,
				"orderClosed": 0,
				"orderDeleted": 0,
				"orderTitleCount": 0
			};
			//declare the default view setting data
			var oViewSetting = {
				"selectCount": "6",
				"selectAll": false,
				"orderNo": true,
				"orderStatus": true,
				"productNumber": true,
				"issueDate": true,
				"issue": false,
				"repairedContent": false,
				"repairPersonID": true,
				"customerID": true
			};
			// declare the back up date for view setting
			var oViewSettingBackup = {};

			//declare the default view sorting data
			var oViewSorting = {
				"orderNo": true,
				"orderStatus": false,
				"issueDate": false,
				"repairPersonID": false,
				"customerID": false
			};
			// declare the back up date for view sorting
			var oViewSortingBackup = {};
			//front end status
			oValueHelpDate.statusHelp = oStatusHelp.statusHelp;
			//icon filter 
			oValueHelpDate.iconfilter = oIconFilter;
			//front end view setting
			oValueHelpDate.viewsetting = oViewSetting;
			oValueHelpDate.viewsettingBackup = oViewSettingBackup;
			//front end view sorting
			oValueHelpDate.viewsorting = oViewSorting;
			oValueHelpDate.viewsortingBackup = oViewSortingBackup;

			oModel.setData(oValueHelpDate);
			this.getView().setModel(oModel);

        },
        _getProductNumber: function () {
            //Set Data To Model
            var oProductInfoModel = this.getView().getModel("HelpProductNumber");
            var oPromise = this.getOwnerComponent().oDataManager.getProductInfo()
            oPromise.then(function(aResults) {
                oProductInfoModel.setData({
                    "productNumberHelp" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

        _getCustomerInfo: function () {
            //Set Data To Model
            var oCustomerInfoModel = this.getView().getModel("HelpCustomerNo");
            var oPromise = this.getOwnerComponent().oDataManager.getCustomerInfo()
            oPromise.then(function(aResults) {
                oCustomerInfoModel.setData({
                    "customerNoHelp" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },
        
        _getRepairInfo: function () {
            //Set Data To Model
            var oRepairPersonModel = this.getView().getModel("HelpRepPersonNo");
            var oPromise = this.getOwnerComponent().oDataManager.getRepairInfo()
            oPromise.then(function(aResults) {
                oRepairPersonModel.setData({
                    "repPersonNoHelp" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

		// open the fragment of view setting
		onViewSettingPress: function () {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oData = oModel.getData();
			jQuery.extend(true, oData.viewsettingBackup, oData.viewsetting);
			oModel.refresh();
			var oDialog = oView.byId("ViewSetting");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLL001.view.ViewSetting", this);
				oView.addDependent(oDialog);
				oDialog.open();
			} else {
				oDialog.open();
			}
		},
		//when the view setting choose select all
		onViewSetAll: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var sSelectAll = this.getView().byId("VSCheckAll").getSelected();
			if (sSelectAll) {
				oData.viewsetting.selectCount = "8";
				oData.viewsetting.selectAll = true;
				oData.viewsetting.orderNo = true;
				oData.viewsetting.orderStatus = true;
				oData.viewsetting.productNumber = true;
				oData.viewsetting.issueDate = true;
				oData.viewsetting.issue = true;
				oData.viewsetting.repairedContent = true;
				oData.viewsetting.repairPersonID = true;
				oDfata.viewsetting.customerID = true;
			} else {
				oData.viewsetting.selectCount = "0";
				oData.viewsetting.selectAll = false;
				oData.viewsetting.orderNo = false;
				oData.viewsetting.orderStatus = false;
				oData.viewsetting.productNumber = false;
				oData.viewsetting.issueDate = false;
				oData.viewsetting.issue = false;
				oData.viewsetting.repairedContent = false;
				oData.viewsetting.repairPersonID = false;
				oData.viewsetting.customerID = false;
			}
			oModel.refresh();
		},
		//change the count of view setting selected items
		onViewSetChange: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var aSelectedItem = Object.values(oData.viewsetting);

			function fctCheck(isSelected) {
				return isSelected === true;
			}
			var saSelectedItemCount = aSelectedItem.filter(fctCheck);
			oData.viewsetting.selectCount = saSelectedItemCount.length;
			oModel.refresh();
		},

		//when view setting is accepted ,change the columns of table
		onViewSettingConfirm: function () {
			this.getView().byId("ViewSetting").close();
		},

		// when view setting is canceled, backup the selected item
		onViewSettingCancel: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			jQuery.extend(true, oData.viewsetting, oData.viewsettingBackup);
			oModel.refresh();
			this.getView().byId("ViewSetting").close();
		},

		//when the view sorting icon was pressed
		onViewSortingPress: function () {
			var oView = this.getView();
			var oModel = oView.getModel();
			var oData = oModel.getData();
			jQuery.extend(true, oData.viewsortingBackup, oData.viewsorting);
			oModel.refresh();
			var oDialog = oView.byId("ViewSorting");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLL001.view.ViewSorting", this);
				oView.addDependent(oDialog);
				oDialog.open();
			} else {
				oDialog.open();
			}
		},

		//when view sorting is accepted,set the new request to server,and relaod date
		onViewSortingConfirm: function () {
			var oSelf = this;
			this._orderDateRequest(oSelf);
			this.getView().byId("ViewSorting").close();
		},

		//when view sorting is canceled,backup the selected item
		onViewSortingCancel: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			jQuery.extend(true, oData.viewsorting, oData.viewsortingBackup);
			oModel.refresh();
			this.getView().byId("ViewSorting").close();
		},

		// when the go button is fired,send request to server
		onOrderSearch: function () {
			var oSelf = this;
			this._orderDateRequest(oSelf);
		},

		_orderDateRequest: function (oSelf) {
            // Array to combine filters
			
            var oView = oSelf.getView();
            var aFilters = [];
			//get the filter values of four filters
			var aStatusSelect = oView.byId("statusSelect").getSelectedKeys(),
				sStatusFilter = oSelf._filterEdit(aStatusSelect, "statusNo"),

				aProductSelect = oView.byId("productNumberSelect").getSelectedKeys(),
				sProductSelect = oSelf._filterEdit(aProductSelect, "productID"),

				aCustomerSelect = oView.byId("customerSelect").getSelectedKeys(),
				sCustomerSelect = oSelf._filterEdit(aCustomerSelect, "customerNo"),

				aRepairSelect = oView.byId("repairSelect").getSelectedKeys(),
                sRepairSelect = oSelf._filterEdit(aRepairSelect, "repPersonNo");

            var sFilter = [];
            if (sStatusFilter) {
				sFilter.push(new sap.ui.model.Filter(sStatusFilter));
            } 
            if (sProductSelect) {
					sFilter.push(new sap.ui.model.Filter(sProductSelect));
            }
            if (sCustomerSelect) {
				sFilter.push(new sap.ui.model.Filter(sCustomerSelect));
            } 
            if (sRepairSelect) {
					sFilter.push(new sap.ui.model.Filter(sRepairSelect));
			}
            var sFilterFinal = new sap.ui.model.Filter(sFilter,true);
            // if (sStatusFilter) {
			// 	sFilter.push(new sap.ui.model.Filter(sStatusFilter));
			// } else {
			// 	if (sStatusFilter) {
			// 		sFilter = sStatusFilter;
			// 	}
			// }
			// if (sFilter) {
			// 	if (sProductSelect) {
			// 		sFilter.push(new sap.ui.model.Filter(sProductSelect));
			// 	}
			// } else {
			// 	if (sProductSelect) {
			// 		sFilter = sProductSelect;
			// 	}
			// }

			// if (sFilter) {
			// 	if (sCustomerSelect) {
			// 		sFilter.push(new sap.ui.model.Filter(sCustomerSelect));
			// 	}
			// } else {
			// 	if (sCustomerSelect) {
			// 		sFilter = sCustomerSelect;
			// 	}
			// }

			// if (sFilter) {
			// 	if (sRepairSelect) {
			// 		sFilter.push(new sap.ui.model.Filter(sRepairSelect));
			// 	}
			// } else {
            //     if (sRepairSelect) {
			// 		sFilter = sRepairSelect;
			// 	}
			// }

			//get the order conditions
			var oData = oView.getModel().getData();
			var aSortArray = oData.viewsorting;

			//because of the auto sort of array,edit the orderby conditon manually
			var sOrderBy = "";
			if (aSortArray.orderNo) {
				sOrderBy = sOrderBy + "orderNo";
			}
			if (sOrderBy) {
				if (aSortArray.orderStatus) {
					sOrderBy = sOrderBy + "," + "statusNo";
				}
			} else {
				if (aSortArray.orderStatus) {
					sOrderBy = sOrderBy + "statusNo";
				}
			}
			if (sOrderBy) {
				if (aSortArray.issueDate) {
					sOrderBy = sOrderBy + "," + "issDate";
				}
			} else {
				if (aSortArray.issueDate) {
					sOrderBy = sOrderBy + "issDate";
				}
			}
			if (sOrderBy) {
				if (aSortArray.repairPersonID) {
					sOrderBy = sOrderBy + "," + "repPersonNo";
				}
			} else {
				if (aSortArray.repairPersonID) {
					sOrderBy = sOrderBy + "repPersonNo";
				}
			}
			if (sOrderBy) {
				if (aSortArray.customerID) {
					sOrderBy = sOrderBy + "," + "customerNo";
				}
			} else {
				if (aSortArray.customerID) {
					sOrderBy = sOrderBy + "customerNo";
				}
			}

			//concatenate the filter and sort
			// var sRequst = "ENTITY001Set";
			// if (sFilter) {
			// 	sRequst = sRequst + "?$filter=" + sFilter + "&$orderby=" + sOrderBy;
			// } else {
			// 	if (sOrderBy) {
			// 		sRequst = sRequst + "?$orderby=" + sOrderBy;
			// 	}
			// }

			//declare the model for table
			var oTableModel = new sap.ui.model.json.JSONModel();
			var oTableData = {};
			var oTableModelShadow = new sap.ui.model.json.JSONModel();
			var aArrayShadow = [];
            // var oTableDataShadow = {};
            
			var pOrderList = this.getOwnerComponent().oDataManager.getOrderList(sFilterFinal, sOrderBy);
			pOrderList.then(function (oDataRecieved) {
				oTableData.orderList = oDataRecieved.results;
				oTableModel.setData(oTableData);
				oSelf._iconFilterCount(oSelf, oDataRecieved.results);
				oView.setModel(oTableModel, "orderList");
				// paste the order list data 
				jQuery.extend(true, aArrayShadow, oDataRecieved.results);
				oTableModelShadow.setData(aArrayShadow);
				oView.setModel(oTableModelShadow, "orderListShadow");
				//set the icon filter to defualt value
				oView.byId("iconTabBar").setSelectedKey("orderAll");
			}.bind(this)).catch(function (err) {
				var aBlank = [];
				oTableData.orderList = aBlank;
				oTableModel.setData(oTableData);
				oSelf._iconFilterCount(oSelf, aBlank);
				oView.setModel(oTableModel, "orderList");
				//set the icon filter to defualt value
				oView.byId("iconTabBar").setSelectedKey("orderAll");
				var oShadowMedel = oView.getModel("orderListShadow");
				if (oShadowMedel) {
					var aShadow = oShadowMedel.getData();
					aShadow = aBlank;
					oShadowMedel.setData(aShadow);
				}
				var sMessage = oSelf._praseError(err);
				oSelf._showMessageBox(sMessage);
			}.bind(this));
		},

		_filterEdit: function (aFilterArray, sFilterKey) {
			
			if (aFilterArray.length === 0) {
				var sBlank = "";
				return sBlank;
			} else {
                var sFilterTemp = [];
                for(var i=0; i<aFilterArray.length; i++){
                    sFilterTemp.push(new sap.ui.model.Filter(sFilterKey, sap.ui.model.FilterOperator.EQ, aFilterArray[i]));
                }
                var sFilterFinal=new sap.ui.model.Filter(sFilterTemp,false);
                return sFilterFinal;
			}
		},

		_iconFilterCount: function (oSelf, aOrderList) {
			function checkNew(sStatus) {
				return sStatus.statusNo === "NEW";
			}

			function checkRepaired(sStatus) {
				return sStatus.statusNo === "REPAIRED";
			}

			function checkClosed(sStatus) {
				return sStatus.statusNo === "CLOSED";
			}

			function checkDeleted(sStatus) {
				return sStatus.statusNo === "DELETED";
			}
			var oModel = oSelf.getView().getModel();
			var oIconFilter = oModel.getData().iconfilter;

			oIconFilter.orderAll = aOrderList.length;
			oIconFilter.orderTitleCount = aOrderList.length;
			oIconFilter.orderNew = aOrderList.filter(checkNew).length;
			oIconFilter.orderRepaired = aOrderList.filter(checkRepaired).length;
			oIconFilter.orderClosed = aOrderList.filter(checkClosed).length;
			oIconFilter.orderDeleted = aOrderList.filter(checkDeleted).length;
			oModel.refresh();

		},

		onQuickFilter: function (oEvent) {
			var sKey = oEvent.getParameter("selectedKey");
			var oDefualtModel = this.getView().getModel();
			var oModel = this.getView().getModel("orderList");
			var aOrderList = this.getView().getModel("orderListShadow").getData();
			var oDummyData = {};

			function checkNew(sStatus) {
				return sStatus.statusNo === "NEW";
			}

			function checkRepaired(sStatus) {
				return sStatus.statusNo === "REPAIRED";
			}

			function checkClosed(sStatus) {
				return sStatus.statusNo === "CLOSED";
			}

			function checkDeleted(sStatus) {
				return sStatus.statusNo === "DELETED";
			}
			switch (sKey) {
			case "orderAll":
				oDummyData.orderList = aOrderList;
				oModel.setData(oDummyData);
				oModel.refresh();
				oDefualtModel.setProperty("/iconfilter/orderTitleCount", oDummyData.orderList.length);
				oDefualtModel.refresh();
				break;
			case "orderNew":
				oDummyData.orderList = aOrderList.filter(checkNew);
				oModel.setData(oDummyData);
				oModel.refresh();
				oDefualtModel.setProperty("/iconfilter/orderTitleCount", oDummyData.orderList.length);
				oDefualtModel.refresh();
				break;
			case "orderRepaired":
				oDummyData.orderList = aOrderList.filter(checkRepaired);
				oModel.setData(oDummyData);
				oModel.refresh();
				oDefualtModel.setProperty("/iconfilter/orderTitleCount", oDummyData.orderList.length);
				oDefualtModel.refresh();
				break;
			case "orderClosed":
				oDummyData.orderList = aOrderList.filter(checkClosed);
				oModel.setData(oDummyData);
				oModel.refresh();
				oDefualtModel.setProperty("/iconfilter/orderTitleCount", oDummyData.orderList.length);
				oDefualtModel.refresh();
				break;
			case "orderDeleted":
				oDummyData.orderList = aOrderList.filter(checkDeleted);
				oModel.setData(oDummyData);
				oModel.refresh();
				oDefualtModel.setProperty("/iconfilter/orderTitleCount", oDummyData.orderList.length);
				oDefualtModel.refresh();
				break;
			default:
			}
		},

		onNaviToDetail: function (oEvent) {
			var oSelectedItem = oEvent.getSource();
			var sOrderNumber = oSelectedItem.getBindingContext("orderList").getProperty("orderNo");

			/*because of external navigation will end the lifecycle,
			add the ZSHOWCASE002 as part of app,and change to internal navigation*/
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("objectdetail", {
				orderNo: sOrderNumber
			});
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
		 * @memberOf showcase.ZGBLL001.view.ZZorderlist
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf showcase.ZGBLL001.view.ZZorderlist
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf showcase.ZGBLL001.view.ZZorderlist
		 */
		//	onExit: function() {
		//
		//	}

	});

});