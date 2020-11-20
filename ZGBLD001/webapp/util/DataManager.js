sap.ui.define([
		"sap/ui/base/Object"
	],
	function (BaseObject) {
		"use strict";
		return BaseObject.extend("sap.showcase.ZGBLD001.util.DataManager", {
            constructor : function(aComponent) {
                this.oDataModel = aComponent.getModel("ZGBLMTORDER_SRV");
                this.oDataModel.setUseBatch(false);
            },
			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the data manager object is to be created.
			 * @public
			 */

            //getProductInfo: function () {
			// 	var oDataProductModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
			// 	var sFilterSt = "ENTITY002Set";
			// 	var aProductResult = [];
			// 	oDataProductModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			aProductResult = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aProductResult;
            // },
            
			getProductInfo: function () {
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

			// getCustomerInfo: function () {
			// 	var oDataCustomerModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
			// 	var sFilterSt = "ENTITY003Set";
			// 	var aCustomerResult = [];
			// 	oDataCustomerModel.read(sFilterSt, {
			// 		context: null,
			// 		urlParameters: null,
			// 		async: false,
			// 		success: function (oDataRecieved, responce) {
			// 			aCustomerResult = oDataRecieved.results;
			// 		},
			// 		error: function (err) {}
			// 	});
			// 	return aCustomerResult;
            // },
            
			getCustomerInfo: function () {
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

			updateOrder: function (aTempData) {
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

				// var oDataModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
				// oDataModel.create("/ENTITY001Set", aTempData, {
				// 	context: null,
				// 	async: false,
				// 	success: function (oData, responce) {
				// 		aController._naviToOrderDisplay();
				// 	},
				// 	error: function (err) {
				// 		var sMessage = aController._praseError(err);
				// 		aController._showMessageBox(sMessage);
				// 	}
				// });
			}

		});
	});