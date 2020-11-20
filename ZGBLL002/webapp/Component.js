sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"showcase/ZGBLL002/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("showcase.ZGBLL002.Component", {

		metadata : {
            manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
            this.getRouter().initialize();
            
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var mConfig = this.getMetadata().getConfig();

			// always use absolute paths relative to our own
			// component
			// (relative paths will fail if running in the Fiori
			// Launchpad)
			var rootPath = jQuery.sap.getModulePath("showcase.ZGBLL002");
			
			this.getRouter().initialize();
			jQuery.sap.includeStyleSheet(sap.ui.resource("showcase.ZGBLL002", "css/ZCSS001.css"));
		}
	});

});