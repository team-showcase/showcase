sap.ui.define([
		"sap/ui/base/Object"
	],
	function (BaseObject) {
		"use strict";
		return BaseObject.extend("showcase.ZGBLL001.util.DataManager", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the data manager object is to be created.
			 * @publicf
			 * 
			 * 
			 */
			constructor: function (aComponent) {
				"use strict";
				// this.oModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
                this.oDataModel = aComponent.getModel("ZGBLMTORDER_SRV");
                this.oDataModel.setUseBatch(false);
            },

			// getProductInfo: function () {
			// 	var aProductNumberHelp = [];
			// 	var sFilterSt = "ENTITY002Set?$select=productID";
			// 	this.oModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			aProductNumberHelp = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aProductNumberHelp;
            // },

            getProductInfo: function () {
                //Get ENTITY002Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY002Set",{
                        urlParameters: {
                            "$select" : "productID"
                        },
                        success: function(aDataRecieved, aResponce) {
                            fResolve(aDataRecieved["results"]);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
            return oPromise;
            },

			// getCustomerInfo: function () {
			// 	var aCustomerNoHelp = [];
			// 	var sFilterSt = "ENTITY003Set?$select=customerNo";
			// 	this.oModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			aCustomerNoHelp = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aCustomerNoHelp;
			// },

            getCustomerInfo: function () {
                //Get ENTITY003Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY003Set",{
                        urlParameters: {
                            "$select" : "customerNo"
                        },
                        success: function(aDataRecieved, aResponce) {
                            fResolve(aDataRecieved["results"]);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
            return oPromise;
            },

			// getRepairInfo: function () {
			// 	var aRepPersonNoHelp = [];
			// 	var sFilterSt = "ENTITY004Set?$select=repPersonNo";
			// 	this.oModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			aRepPersonNoHelp = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aRepPersonNoHelp;
			// },

            getRepairInfo: function () {
                //Get ENTITY004Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY004Set",{
                        urlParameters: {
                            "$select" : "repPersonNo"
                        },
                        success: function(aDataRecieved, aResponce) {
                            fResolve(aDataRecieved["results"]);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
            return oPromise;
            },

			getOrderList: function (sFilter, sOrderBy) {
				// var oDataModel = this.oModel;
				var pOrderList = new Promise(function (resolve, reject) {
					this.oDataModel.read("/ENTITY001Set", {
                        filters: [sFilter],
                        // filters: [new Filter("ProductID", FilterOperator.EQ, 1)]
                        urlParameters: {
                            "$orderby" : sOrderBy
                        },
						success: function (oDataRecieved, responce) {
							resolve(oDataRecieved);
						},
						error: function (err) {
							reject(err);
						}
					});
				}.bind(this));
				return pOrderList;
			},

			// getRepairPerson: function () {
			// 	var sFilterSt = "/ENTITY004Set";
			// 	var aPersonResult = [];
			// 	//call the odata request
			// 	this.oModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		// filters: aFilters,
			// 		success: function (oDataRecieved, responce) {
			// 			aPersonResult = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aPersonResult;
            // },
            
            getRepairPerson: function () {
                //Get ENTITY004Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY004Set",{
                        success: function(aDataRecieved, aResponce) {
                            fResolve(aDataRecieved["results"]);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
            return oPromise;
            },


			// getMaintenanceOrder: function (aParameter) {
			// 	var sFilterSt = "/ENTITY001Set(orderNo='" + aParameter + "')?$expand=ENTITY002,ENTITY003,ENTITY004,ENTITY005";
			// 	var oOrderData = {};
			// 	this.oModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			oOrderData = oDataRecieved;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return oOrderData;
            // },
            
			getMaintenanceOrder: function (aParameter) {
                //Get Data
                // var sFilterSt = "/ENTITY001Set(orderNo='" + aParameter + "')?$expand=ENTITY002,ENTITY003,ENTITY004,ENTITY005";
                var sFilterSt = "/ENTITY001Set(orderNo='" + aParameter + "')";
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read(sFilterSt,{
                        urlParameters: {
                            "$expand" : "ENTITY002,ENTITY003,ENTITY004,ENTITY005"
                        },
                        success: function(aDataRecieved, aResponce) {
                            fResolve(aDataRecieved);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
            return oPromise;
            },
			// updateOrder: function (oSelf, oTempData) {
			// 	var oDataModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
			// 	var sOptions = "/ENTITY001Set(orderNo='" + oTempData.orderNo + "')";
			// 	oDataModel.update(sOptions, oTempData, {
			// 		context: null,
			// 		async: false,
			// 		success: function (oData, responce) {
			// 			var oModel = oSelf.getView().getModel();
			// 			var oBackUpData = oSelf._getMaintenaceOrder(oSelf, oTempData.orderNo);
			// 			oModel.setData(oBackUpData);
			// 			oModel.refresh();
			// 		},
			// 		//エラーの場合
			// 		error: function (err) {
			// 			var sMessage = oSelf._PraseError(err);
			// 			oSelf._ShowMessageBox(sMessage);
			// 		}
			// 	});
            // }
            updateOrder: function (oTempData) {
                //Update ENTITY001Set Data
                var sOptions = "/ENTITY001Set(orderNo='" + oTempData.orderNo + "')";
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.update(sOptions, oTempData, {
                        success: function(aDataRecieved) {
                            fResolve(aDataRecieved);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
                return oPromise;
            }

		});
	});