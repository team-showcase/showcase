sap.ui.define([
		"sap/ui/base/Object"
	],
	function (BaseObject) {
		"use strict";
		return BaseObject.extend("showcase.ZGBLM001.util.DataManager", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the data manager object is to be created.
			 * @public
			 */
			constructor: function (aComponent) {
				"use strict";
				// this.oModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
                this.oDataModel = aComponent.getModel("ZGBLMTORDER_SRV");
                this.oDataModel.setUseBatch(false);
            },

            
            getMasterList: function () {
				// var oDataModel = this.oModel;
				var pMasterList = new Promise(function (resolve, reject) {
					this.oDataModel.read("/ENTITY001Set", {
                        urlParameters: {
                            "$expand" : "ENTITY002"
                        },
						success: function (oDataRecieved, responce) {
							resolve(oDataRecieved["results"]);
						},
						error: function (err) {
							reject(err);
						}
					});
				}.bind(this));
				return pMasterList;
            },
            

			           
            getProductID: function () {
                //product number
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
            
            getCustomerNo: function () {
                //customer number
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

			
            getRepairPerson: function () {
                //repair person number
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


            
            getFilterOrder: function (oDataFilter, oSorter) {
				var pOrderList = new Promise(function (resolve, reject) {
					this.oDataModel.read("/ENTITY001Set", {
                        filters: [oDataFilter],
                        sorters: [oSorter],
                        // urlParameters: {
                        //     "$orderby" : oSorter
                        // },
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

			
            
            getDetailOrder: function (sParameter) {
				var sFilterSt = "/ENTITY001Set(orderNo='" + sParameter + "')";
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

            
            getDetailRepair: function () {
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


			

            updateOrder: function (sOptions, oUpdateOrder) {
                //Update ENTITY001Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.update(sOptions, oUpdateOrder, {
                        success: function(aDataRecieved) {
                            fResolve(aDataRecieved);
                        },
                        error: function(aError) {
                            fReject(aError);
                        }
                    });
                }.bind(this));
                return oPromise;
            },

		

            getCreateProduct: function () {
                //Get ENTITY002Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY002Set",{
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

            getCreateCustomer: function () {
                //Get ENTITY003Set Data
                var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.read("/ENTITY003Set",{
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

			// createOrder: function (oTempData) {
			// 	var oDataModel = this.oModel;
			// 	var pCreateOrder = new Promise(function (resolve, reject) {
			// 		oDataModel.create("/ENTITY001Set", oTempData, {
			// 			context: null,
			// 			async: false,
			// 			success: function (oData, responce) {
			// 				resolve();
			// 			},
			// 			error: function (err) {
			// 				reject(err);
			// 			}
			// 		});
			// 	});
			// 	return pCreateOrder;
			// }

            createOrder: function (aTempData) {
                //Update ENTITY001Set Data
                 var oPromise = new Promise(function(fResolve,fReject){
                    this.oDataModel.create("/ENTITY001Set", aTempData, {
                        success: function(aDataRecieved) {
                            fResolve(aDataRecieved["results"]);
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