(function ($, App, Lib, Templates) {
	Lib.BoardSpawnZoneModel = Backbone.Model.extend({
		'defaults': {
			'tile': null,
			'enabled': true
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));