/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"showcase/ZGBLL002/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
