/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/showcase/ZGBLD001/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
