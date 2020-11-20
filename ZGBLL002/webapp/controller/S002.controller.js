sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/model/json/JSONModel",
	'sap/ui/export/Spreadsheet'
], function (Controller, MessagePopover, MessageItem, JSONModel, Spreadsheet) {
	"use strict";
	return Controller.extend("showcase.ZGBLL002.controller.S002", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated. It sets up the constant and JSON Model.
		 * @public
		 */
		onInit: function (evt) {
			this.oConstant = {
				sTotal: "T",
				sWarning: "W",
				sSuccess: "S",
				sError: "E",
				sWarningText: "Warning",
				sSuccessText: "Success",
				sErrorText: "Error",
				sWarningIcon: "sap-icon://status-inactive",
				sSuccessIcon: "sap-icon://status-positive",
				sErrorIcon: "sap-icon://status-negative"
			};
			var oSummaryJSONModel = new JSONModel();
			var oMessageJSONModel = new JSONModel();
			this.getView().setModel(oSummaryJSONModel, "Summary");
			this.getView().setModel(oMessageJSONModel, "Message");
			var oModel = new JSONModel(jQuery.sap.getModulePath("showcase.ZGBLL002/data", "/template.json"));
			this.getView().setModel(oModel, "template");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * download the template with javascript only
		 * @public
		 */
		onDownloads: function (){
			
		},

		onDownload: function () {
			sap.m.URLHelper.redirect(jQuery.sap.getModulePath("showcase.ZGBLL002/data", "/Template.xlsx"));
			// var aTemplateData = this.getView().getModel("template").getProperty("/ProductInfo");
			
			// var aCols = [];

			// aCols.push({
			// 	label: "Product Number",
			// 	property: "ProductNumber",
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Language Key",
			// 	property: "LanguageKey",
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Product Name",
			// 	property: "ProductName",
			// 	width: '25',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Category",
			// 	property: "Category",
			// 	width: '20',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Product Information",
			// 	property: "ProductInformation",
			// 	width: '50',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Technical Information",
			// 	property: "TechnicalInformation",
			// 	width: '50',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Additional Information",
			// 	property: "AdditionalInformation",
			// 	width: '50',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Image URL",
			// 	property: "ImageURL",
			// 	width: '50',
			// 	type: "string"
			// });

			// aCols.push({
			// 	label: "Parts Information",
			// 	property: "PartsInformation",
			// 	width: '50',
			// 	type: "string"
			// });
		
			// var oSettings = {
			// 	workbook: { columns: aCols },
			// 	// dataSource: [""],
			// 	dataSource: aTemplateData,
			// 	fileName: "template.xlsx",
			// 	showProgress: false
			// };

			// new Spreadsheet(oSettings)
			// 	.build()
			// 	.then( function() {
			// 		// MessageToast.show("Spreadsheet export has finished");
			// 	});
		
		},
		/*
		 * Event handler for upload process is finished from backend server.
		 * Set the response to the screen
		 * @public
		 */
		onComplete: function (oControlEvent) {
			var sStatus = oControlEvent.getParameter("status");
			if (sStatus === 201) {
				var sResponseRaw = oControlEvent.getParameter("responseRaw");
				var oResponseRaw = JSON.parse(sResponseRaw);
				var oMessageList = JSON.parse(oResponseRaw.d.message);

				this.getView().getModel("Message").setData(oMessageList, false);
				var oSummaryJSONModel = this.getView().getModel("Summary");
				oSummaryJSONModel.setData(oResponseRaw.d, false);
				oSummaryJSONModel.setProperty("/FileAddress", this.getView().byId("FileUploader").getValue());

				var oSelect = this.getView().byId("messageTablefilter");
				oSelect.setSelectedKey(this.oConstant.sTotal);
				var oItem = this.getView().byId("MessageTable").getBinding("rows");
				if (oItem) {
					oItem.filter([], "Application");
				}

				var olength = new JSONModel({
					"messageLength": oMessageList.length
				});

				this.getView().setModel(olength, "length");

				var oDialog = this.getView().byId("BusyDialog");
				oDialog.close();

				if (!this.oMP) {
					this.createMessagePopover();
				}

				var oButton = this.getView().byId("messagePopoverBtn");
				oButton.setVisible(true);
				this.oMP.openBy(oButton).bind(this);

			}
		},

		createMessagePopover: function () {
			this.oMP = new MessagePopover({
				items: {
					path: "Message>/",
					template: new MessageItem({
						type: {
							parts: [{
								path: 'Message>TYPE'
							}],
							formatter: this.ZFormatPopoverStatus
						},
						title: "{Message>TEXT}",
						subtitle: "{Message>TEXT}",
						description: "{Message>TEXT}"
					})
				}
			});
			this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
		},

		handleMessagePopoverPress: function (oEvent) {
			if (!this.oMP) {
				this.createMessagePopover();
			}
			this.oMP.toggle(oEvent.getSource());
		},

		/**
		 * Event handler for Message Filter Event.
		 * @public
		 */
		onFilterMessage: function (oControlEvent) {
			var oSelect = oControlEvent.getSource();
			var sKey = oSelect.getSelectedKey();
			var oMessageTable = this.getView().byId("MessageTable");
			var aFilters = [];
			if (sKey !== this.oConstant.sTotal) {
				aFilters.push(new sap.ui.model.Filter("TYPE", sap.ui.model.FilterOperator.EQ, sKey));
			}

			var oItem = oMessageTable.getBinding("rows");
			if (oItem) {
				oItem.filter(aFilters, "Application");
			}
		},

		/**
		 * Event handler for Upload Event.
		 * @public
		 */
		onUpload: function (oControlEvent) {
			this._setUploadVariant();
			this._setCSRFTOKEN();
		},

		/**
		 * Event handler for Expand Event.
		 * @public
		 */
		onExpand: function (oControlEvent) {
			var oPanel = oControlEvent.getSource();
			var oMessageTable = this.getView().byId("MessageTable");
			if (oPanel.getExpanded()) {
				oMessageTable.setVisibleRowCount(5);

			} else {
				oMessageTable.setVisibleRowCount(10);
			}
		},
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Prepare Upload Variant and set to FileUploaderParameter 'slug'
		 * @private
		 */
		_setUploadVariant: function () {
			var filename = this.getView().byId("FileUploader").getValue();
			var oVariant = [{
				name: filename
			}];
			this.getView().byId("slug").setValue(JSON.stringify(oVariant));
		},

		_setCSRFTOKEN: function () {
            var oDataModel = this.getView().getModel();
            var sUrl =oDataModel.sServiceUrl + "/ENTITY006Set";
			oDataModel.setTokenHandlingEnabled(true);
            //Get Security Token
			var oPromise = new Promise(function (fnResolve) {
				oDataModel.refreshSecurityToken(function () {
					fnResolve();
				}.bind(this));
			});

			oPromise.then(function () {
				this.getView().byId("csrfToken").setValue(oDataModel.getSecurityToken());
                var oController = this.getView().byId("FileUploader");
                oController.setUploadUrl(sUrl);
				oController.upload();
				var oDialog = this.getView().byId("BusyDialog");
				oDialog.open();
			}.bind(this));
		},

		/* =========================================================== */
		/* begin: format methods                                     */
		/* =========================================================== */

		/**
		 * Format output the Date value
		 * @param {date} aDate	Date value
		 * @public
		 */
		ZFormatDateUTCOutput: function (aDate) {
			if (aDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "YYYY-MM-dd",
					UTC: true
				});
				return oDateFormat.format(new Date(parseInt(aDate.slice(6))));
			}
		},

		/**
		 * Format output the Time value
		 * @param {datetime} aTime	Time value
		 * @public
		 */
		ZFormatTimeOutput: function (aTime) {

			if (aTime) {
				var oTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "'PT'HH'H'mm'M'ss'S'"
				});
				var oTimeFormatTo = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "HH:mm:ss"
				});

				return oTimeFormatTo.format(oTimeFormat.parse(aTime));
			}
		},

		/**
		 * Format Message Status
		 * @param {string} aStatus	Message Status
		 * @public
		 */
		ZFormatMessageStatus: function (aStatus) {

			switch (aStatus) {
			case this.oConstant.sError:
				return sap.ui.core.ValueState.Error;
				break;
			case this.oConstant.sSuccess:
				return sap.ui.core.ValueState.Success;
				break;
			case this.oConstant.sWarning:
				return sap.ui.core.ValueState.Warning;
				break;
			default:
				return sap.ui.core.ValueState.None;
			}
		},

		ZFormatPopoverStatus: function (aStatus) {

			switch (aStatus) {
			case "E":
				return "Error";
				break;
			case "S":
				return "Success";
				break;
			case "W":
				return "Warning";
				break;
			}
		},

		/**
		 * Format Message Status Icon
		 * @param {string} aStatus	Message Status
		 * @public
		 */
		ZFormatMessageIcon: function (aStatus) {
			switch (aStatus) {
			case this.oConstant.sError:
				return this.oConstant.sErrorIcon;
				break;
			case this.oConstant.sSuccess:
				return this.oConstant.sSuccessIcon;
				break;
			case this.oConstant.sWarning:
				return this.oConstant.sWarningIcon;
				break;
			default:
				return "";

			}
		},

		/**
		 * Format Message Status Text
		 * @param {string} aStatus	Message Status
		 * @public
		 */
		ZFormatMessageText: function (aStatus) {
			switch (aStatus) {
			case this.oConstant.sError:
				return this.oConstant.sErrorText;
				break;
			case this.oConstant.sSuccess:
				return this.oConstant.sSuccessText;
				break;
			case this.oConstant.sWarning:
				return this.oConstant.sWarningText;
				break;
			default:
				return "";
			}
		},

		/**
		 * Format Result Counts
		 * @param {string} aCounts	Result Counts
		 * @public
		 */
		ZFormatResultCounts: function (aCounts) {

			var oStringType = new sap.ui.model.odata.type.String(
				//oFormatOptions
				{},
				//oConstraints?
				{
					isDigitSequence: true
				});

			try {
				var sCount = oStringType.parseValue(aCounts, "string");
				if (sCount) {
					return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ZRESULTCOUNTS", [sCount]);
				}
			} catch (e) {}
		}
	});

});