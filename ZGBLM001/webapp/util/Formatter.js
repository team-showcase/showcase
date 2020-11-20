sap.ui.define([], function () {
	"use strict";
	return {

		fmtStatus: function (sStatus) {
			switch (sStatus) {
			case "NEW":
				return "Error";
			case "REPAIRED":
				return "Warning";
			case "CLOSED":
				return "Success";
			case "DELETED":
				return "None";
			}
		},

		/* Date Formatter */
		fmtDate: function (aDate) {
			"use strict";
			var dateformat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy.MM.dd"
			});
			if (aDate === null || aDate === "") {
				return "";
			} else {
				return dateformat.format(aDate);
			}
		},

		fmtDatePicker: function (sIsphone) {
			if (sIsphone) {
				return "yyyy.MM.dd HH:mm:ss";
			} else {
				return "yyyy.MM.dd HH:mm:ss";
			}
		},

		fmtProductPath: function (sIsphone) {
			if (sIsphone) {
				return "showcase.ZGBLM001.view.ProductInfoPhone";
			} else {
				return "showcase.ZGBLM001.view.ProductInfo";
			}
		}

	};
});