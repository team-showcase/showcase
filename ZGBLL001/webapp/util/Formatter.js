sap.ui.define([], function () {
	"use strict";
	return {
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
		}
	};
});