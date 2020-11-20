sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "sap/showcase/ZGBLD001/model/models",
    "./util/DataManager"
], function (UIComponent, Device, models, DataManager) {
	"use strict";

	return UIComponent.extend("sap.showcase.ZGBLD001.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
            // save the oData model
            this.oDataManager = new DataManager(this);

			// call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
			// enable routing
			this.getRouter().initialize();

			// set the device model
            this.setModel(models.createDeviceModel(), "device");
            
            
		}
	});
});
