sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	'sap/m/ColumnListItem',
	'sap/m/Table',
	'sap/m/Label',
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"showcase/ZGBLM001/util/Formatter",
	"showcase/ZGBLM001/util/DataManager"
], function (Controller, UIComponent, ColumnListItem, Table, Label, MessageBox, Filter, Formatter, DataManager) {
	"use strict";

	return Controller.extend("showcase.ZGBLM001.controller.S002", {
		//declare the format
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf showcase.ZSHOWCASE004.view.Master
		 */
		onInit: function () {
			// this.oDataManager = new DataManager();

			var oView = this.getView();
			var oBusyDialog = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLM001.view.BusyDialog", this);
			oView.addDependent(oBusyDialog);
            this._busyDialog = new sap.m.BusyDialog();
            this._busyDialog.open();
            var oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel);
            this._getMasterList();
			// var oData = {};
			// var aOrderList = this.oDataManager.getMasterList();
			// if (aOrderList) {
			// 	oData.orderList = aOrderList;
			// 	oData.orderCount = aOrderList.length;
			// 	oModel.setData(oData);
			// 	this.getView().setModel(oModel);
			// }

			var aSorters = [];
			var oList = this.getView().byId("orderMasterlist");
			var oBinding = oList.getBinding("items");
			aSorters.push(new sap.ui.model.Sorter("orderNo", true));
			if (oBinding) {
				oBinding.sort(aSorters);
			}
			var sViewId = this.getView().getId();
			var sOrderNumber = "orderdummy";
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detail", {
				"masterId": sViewId,
				"orderNo": sOrderNumber
			});
        },
        
        _getMasterList: function () {
            //Set Data To Model
            var oPromise = this.getOwnerComponent().oDataManager.getMasterList()
            oPromise.then(function(aResults) {
                this._setMasterList(aResults);
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },
        
        _setMasterList: function (aResults) {
            var oData = {};
            var oModel= this.getView().getModel();
            if (aResults) {
				oData.orderList = aResults;
				oData.orderCount = aResults.length;
			}
            oModel.setData(oData);
			this.getView().setModel(oModel);  
        },
               
		onSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("orderNo", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.getView().byId("orderMasterlist");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
        },
        
		onFilterPress: function () {
			var oDeviceModel = this.getOwnerComponent().getModel("device");
			var oDeviceData = oDeviceModel.getData();

			var oView = this.getView();
			var oDialogFilter = oView.byId("orderFilter");
			if (!oDialogFilter) {
				if (oDeviceData.isPhone === false) {
					var oSelectButton = new sap.m.Button({
						text: "Select",
						press: this.onOrderFilterSelect.bind(this)
					});
					var oCancelButton = new sap.m.Button({
						text: "Cancel",
						press: this.onOrderFilterCancel.bind(this)
					});
					oDialogFilter = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLM001.view.OrderFilter", this);
					oDialogFilter.getButtons()[1].setVisible(false);
					oDialogFilter.addButton(oSelectButton);
					oDialogFilter.addButton(oCancelButton);
					// oDialogFilter.getButtons()[0].setText("Select");
				} else {
					oDialogFilter = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLM001.view.OrderFilterPhone", this);
				}
				oView.addDependent(oDialogFilter);
				//get the value help from backend
				(this._getValueHelpRequest.bind(this))();
				// oBusyDialog.close();
				// oDialogFilter.open();
			} else {
				oDialogFilter.open();
			}
		},

		_getValueHelpRequest: function () {
			// var oBusyDialog = this.byId("BusyDialog");
			// var oBusyDialog = new sap.m.BusyDialog();
			// oBusyDialog.open();
			var oDialogFilter = this.getView().byId("orderFilter");
			var aPromises = [];

			var oModel = this.getView().getModel();
			var oData = oModel.getData();
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
			//front end status
			oData.statusHelp = oStatusHelp.statusHelp;

			//get the select list from server
			// var pProductId = this.getOwnerComponent().oDataManager.getProductID();
			// aPromises.push(pProductId);
			// var pCustomerNo = this.getOwnerComponent().oDataManager.getCustomerNo();
			// aPromises.push(pCustomerNo);
			// var pRepairNo = this.getOwnerComponent().oDataManager.getRepairPerson();
			// aPromises.push(pRepairNo);

			// Promise.all(aPromises).then(function (aDataResult) {
			// 	oData.productNumberHelp = aDataResult[0];
			// 	oData.customerNoHelp = aDataResult[1];
			// 	oData.repPersonNoHelp = aDataResult[2];
			// 	oModel.refresh();
			// 	oBusyDialog.close();
			// 	oDialogFilter.open();
			// }, function () {
			// 	oBusyDialog.close();
            // });

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
            this.getView().setModel(oRepairPersonModel, "HelpRepair");
            this._getRepairInfo();
	        oModel.refresh();
			oDialogFilter.open();
		},

        _getProductNumber: function () {
            //Set Data To Model
            var oProductInfoModel = this.getView().getModel("HelpProductNumber");
            var oPromise = this.getOwnerComponent().oDataManager.getProductID()
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
            var oPromise = this.getOwnerComponent().oDataManager.getCustomerNo()
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
            var oRepairPersonModel = this.getView().getModel("HelpRepair");
            var oPromise = this.getOwnerComponent().oDataManager.getRepairPerson()
            oPromise.then(function(aResults) {
                oRepairPersonModel.setData({
                    "repPersonNoHelp" : aResults
                });
                this._busyDialog.close();
            }.bind(this)).catch(function(aError){
                this._busyDialog.close();
            }.bind(this));
        },

		onFilterBarSearch: function () {
            
            var oSelf = this;
            this._orderDateRequest(oSelf);

			// var oDataRecieved = (this._orderDateRequest.bind(this))();

            // var oModel = new sap.ui.model.json.JSONModel();
            // var oView = this.getView();
			// oModel.setData(oDataRecieved);
			// // oView.setModel(oModel, "orderFilter");
			// var aColumns = [{
			// 	"label": "Order No.",
			// 	"template": "orderNo"
			// }, {
			// 	"label": "Status",
			// 	"template": "statusNo"
			// }, {
			// 	"label": "Product Number",
			// 	"template": "productID"
			// }, {
			// 	"label": "Customer ID",
			// 	"template": "customerNo"
			// }, {
			// 	"label": "Repair Person ID",
			// 	"template": "repPersonNo"
			// }];
			// var oColData = {};
			// oColData.cols = aColumns;
			// var oColModel = new sap.ui.model.json.JSONModel();
			// oColModel.setData(oColData);

			// var oDialog = oView.byId("orderFilter");
			// var oTable = oDialog.getTable();
			// // var oTable = new Table();
			// oTable.setModel(oModel);
			// oTable.setModel(oColModel, "columns");

			// if (oTable.bindRows) {
			// 	oTable.bindAggregation("rows", "/results");
			// 	// oDialog.setTable(oTable);
			// }

			// if (oTable.bindItems) {
			// 	oTable.bindAggregation("items", "/results", function () {
			// 		return new ColumnListItem({
			// 			cells: aColumns.map(function (column) {
			// 				return new Label({
			// 					text: "{" + column.template + "}"
			// 				});
			// 			})
			// 		});
			// 	});
			// 	// oDialog.setTable(oTable);
			// 	oDialog.update();
			// }

		},

		onFilterPhoneOK: function () {
            var oSelf = this;
			var oDataRecieved = (this._orderDateRequest(oSelf).bind(this))();
			if (oDataRecieved && oDataRecieved.results.length > 0) {
				var oModel = this.getView().getModel();
				var oData = oModel.getData();
				oData.orderList = oDataRecieved.results;
				oData.orderCount = oDataRecieved.results.length;
				oModel.refresh();
				this.getView().byId("orderFilter").close();
			}

		},

		_orderDateRequest: function (oSelf) {
			var oView = this.getView();
            // var that = this;
            var oDataFilter = [];

			//get the filter condition from filter fragment
			if (oView.byId("orderFilter")) {
				var aStatusSelect = oView.byId("statusSelect").getSelectedKeys();
				var aProductSelect = oView.byId("productNumberSelect").getSelectedKeys();
				var aCustomerSelect = oView.byId("customerSelect").getSelectedKeys();
				var aRepairSelect = oView.byId("repairSelect").getSelectedKeys();
                

				//status
				if (aStatusSelect.length > 0) {
					var aStatusFilter = [];
					for (var i = 0; i < aStatusSelect.length; i++) {
						aStatusFilter.push(new sap.ui.model.Filter("statusNo", sap.ui.model.FilterOperator.EQ, aStatusSelect[i]));
					}
					var oStatusFilterOr = new sap.ui.model.Filter(aStatusFilter, false);
				}

				//product
				if (aProductSelect.length > 0) {
					var aProductFilter = [];
					for (i = 0; i < aProductSelect.length; i++) {
						aProductFilter.push(new sap.ui.model.Filter("productID", sap.ui.model.FilterOperator.EQ, aProductSelect[i]));
					}
					var oProductFilterOr = new sap.ui.model.Filter(aProductFilter, false);
				}

				//customer 
				if (aCustomerSelect.length > 0) {
					var aCustomerFilter = [];
					for (i = 0; i < aCustomerSelect.length; i++) {
						aCustomerFilter.push(new sap.ui.model.Filter("customerNo", sap.ui.model.FilterOperator.EQ, aCustomerSelect[i]));
					}
					var oCustomerFilterOr = new sap.ui.model.Filter(aCustomerFilter, false);
				}

				//repair person
				if (aRepairSelect.length > 0) {
					var aRepairFilter = [];
					for (i = 0; i < aRepairSelect.length; i++) {
						aRepairFilter.push(new sap.ui.model.Filter("repPersonNo", sap.ui.model.FilterOperator.EQ, aRepairSelect[i]));
					}
					var oRepairFilterOr = new sap.ui.model.Filter(aRepairFilter, false);
				}

                var aFilter = [];
                
				if (oStatusFilterOr) {
					aFilter.push(new sap.ui.model.Filter(oStatusFilterOr));
				}
				if (oProductFilterOr) {
					aFilter.push(new sap.ui.model.Filter(oProductFilterOr));
				}
				if (oCustomerFilterOr) {
					aFilter.push(new sap.ui.model.Filter(oCustomerFilterOr));
				}
				if (oRepairFilterOr) {
					aFilter.push(new sap.ui.model.Filter(oRepairFilterOr));
				}
				if (aFilter.length > 0) {
				// 	var oDataFilter = [
				// 		new Filter({
				// 			filters: aFilter,
				// 			and: true
				// 		})
                //     ];
                // }
                 oDataFilter = new sap.ui.model.Filter(aFilter, true);
				}
			}

			if (oView.byId("OrderSorting")) {
				//get the sort condition from sort fragment
				var sSortKey = "";
				if (oView.byId("GroupA_No").getSelected()) {
					sSortKey = "orderNo";
				}
				if (oView.byId("GroupA_Status").getSelected()) {
					sSortKey = "statusNo";
				}
				if (oView.byId("GroupA_Date").getSelected()) {
					sSortKey = "issDate";
				}
				if (oView.byId("GroupA_Person").getSelected()) {
					sSortKey = "repPersonNo";
				}
				if (oView.byId("GroupA_Customer").getSelected()) {
					sSortKey = "customerNo";
				}
				// var bSortMethod = "";
				if (oView.byId("GroupB_ASC").getSelected()) {
					var bSortMethod = false;
				} else {
					bSortMethod = true;
				}
				var oSorter = new sap.ui.model.Sorter(sSortKey, bSortMethod);
			} else {
				oSorter = new sap.ui.model.Sorter("orderNo", true);
			}
            //odata request
			var pOrderList = this.getOwnerComponent().oDataManager.getFilterOrder(oDataFilter, oSorter);
			pOrderList.then(function (oDataRecieved) {
                this._setDataRequest(oDataRecieved);
			}.bind(this)).catch(function (err) {
				var sMessage = this._praseError(err);
				this._showMessageBox(sMessage);
			}.bind(this));
        },
        
        _setDataRequest: function (oDataRecieved) {
            var oModel = new sap.ui.model.json.JSONModel();
            var oView = this.getView();
			oModel.setData(oDataRecieved);
			// oView.setModel(oModel, "orderFilter");
			var aColumns = [{
				"label": "Order No.",
				"template": "orderNo"
			}, {
				"label": "Status",
				"template": "statusNo"
			}, {
				"label": "Product Number",
				"template": "productID"
			}, {
				"label": "Customer ID",
				"template": "customerNo"
			}, {
				"label": "Repair Person ID",
				"template": "repPersonNo"
			}];
			var oColData = {};
			oColData.cols = aColumns;
			var oColModel = new sap.ui.model.json.JSONModel();
			oColModel.setData(oColData);

			var oDialog = oView.byId("orderFilter");
			var oTable = oDialog.getTable();
			// var oTable = new Table();
			oTable.setModel(oModel);
			oTable.setModel(oColModel, "columns");

			if (oTable.bindRows) {
				oTable.bindAggregation("rows", "/results");
				// oDialog.setTable(oTable);
			}

			if (oTable.bindItems) {
				oTable.bindAggregation("items", "/results", function () {
					return new ColumnListItem({
						cells: aColumns.map(function (column) {
							return new Label({
								text: "{" + column.template + "}"
							});
						})
					});
				});
				// oDialog.setTable(oTable);
				oDialog.update();
			}
        },

		onFilterBarClear: function () {
			var oView = this.getView();
			oView.byId("statusSelect").removeAllSelectedItems();
			oView.byId("productNumberSelect").removeAllSelectedItems();
			oView.byId("customerSelect").removeAllSelectedItems();
			oView.byId("repairSelect").removeAllSelectedItems();
		},

		onOrderFilterSelect: function () {
			//get the data from filter table
			var oDialog = this.getView().byId("orderFilter");
			var oTable = oDialog.getTable();
			var oTableModel = oTable.getModel();
			var oTableData = oTableModel.getData();
			//get the data from master list
			if (oTableData.results.length > 0) {
				var oModel = this.getView().getModel();
				var oData = oModel.getData();

				//change the master list to filter table data
				oData.orderList = oTableData.results;
				oData.orderCount = oTableData.results.length;
				oModel.refresh();
				oDialog.close();
			}
		},

		onOrderFilterCancel: function () {
			this.getView().byId("orderFilter").close();
		},

		onSortPress: function () {
			var oView = this.getView();
			var oDialogSort = oView.byId("OrderSorting");
			if (!oDialogSort) {
				oDialogSort = sap.ui.xmlfragment(oView.getId(), "showcase.ZGBLM001.view.OrderSorting", this);
				oView.addDependent(oDialogSort);
				oDialogSort.open();
			} else {
				oDialogSort.open();
			}
		},

		onSortConfirm: function () {
			// var that = this;
			// this._orderDateRequest(that);
			var aSorters = [];
			var oView = this.getView();
			var oList = this.getView().byId("orderMasterlist");
			var oBinding = oList.getBinding("items");

			var sSortKey = "";
			if (oView.byId("GroupA_No").getSelected()) {
				sSortKey = "orderNo";
			}
			if (oView.byId("GroupA_Status").getSelected()) {
				sSortKey = "statusNo";
			}
			if (oView.byId("GroupA_Date").getSelected()) {
				sSortKey = "issDate";
			}
			if (oView.byId("GroupA_Person").getSelected()) {
				sSortKey = "repPersonNo";
			}
			if (oView.byId("GroupA_Customer").getSelected()) {
				sSortKey = "customerNo";
			}
			var bSortMethod = "";
			if (oView.byId("GroupB_ASC").getSelected()) {
				bSortMethod = false;
			} else {
				bSortMethod = true;
			}

			aSorters.push(new sap.ui.model.Sorter(sSortKey, bSortMethod));
			// apply the selected sort and group settings
			oBinding.sort(aSorters);
			this.getView().byId("OrderSorting").close();
		},

		onSortCancel: function () {
			this.getView().byId("OrderSorting").close();
		},

		onAddNewOrder: function () {
			var sViewId = this.getView().getId();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// var oRouterName = oRouter.getTarget();
			// if () {}
			// oRouter.navTo("Create", false);
			oRouter.navTo("Create", {
				masterId: sViewId
			});
		},

		onListItemPress: function (oEvent) {
			var sViewId = this.getView().getId();
			var oSelectedItem = oEvent.getSource();
			var sOrderNumber = oSelectedItem.getBindingContext().getProperty("orderNo");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detail", {
				masterId: sViewId,
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
		 * @memberOf showcase.ZSHOWCASE004.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf showcase.ZSHOWCASE004.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf showcase.ZSHOWCASE004.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});