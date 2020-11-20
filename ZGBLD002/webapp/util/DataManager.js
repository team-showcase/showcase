sap.ui.define([
		"sap/ui/base/Object"
	],
	function (BaseObject) {
		"use strict";
		return BaseObject.extend("showcase.ZGBLD002.util.DataManager", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the data manager object is to be created.
			 * @public
			 */
            //get the odata model
            constructor : function(aComponent) {
                this.oDataModel = aComponent.getModel("ZGBLMTORDER_SRV");
                this.oDataModel.setUseBatch(false);
            },  

			// getRepairPerson: function () {
			// 	var oDataPersonModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
			// 	var sFilterSt = "/ENTITY004Set";
			// 	var aPersonResult = [];
			// 	//call the odata request
			// 	oDataPersonModel.read(sFilterSt, {
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
			// 	var oDataModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZGBLMTORDER_SRV/", true);
			// 	var sFilterSt = "/ENTITY001Set(orderNo='" + aParameter + "')?$expand=ENTITY002,ENTITY003,ENTITY004,ENTITY005";
			// 	var oOrderData = {};
			// 	oDataModel.read(sFilterSt, {
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
			// 			var oBackUpData = oSelf._editMianInfo(oSelf, oTempData.orderNo);
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