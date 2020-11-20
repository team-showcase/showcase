/*global QUnit*/

sap.ui.define([
	"sap/showcase/ZGBLD001/controller/S001.controller"
], function (Controller) {
	"use strict";

	QUnit.module("S001 Controller");

	QUnit.test("I should test the S001 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
