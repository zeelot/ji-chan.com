(function ($, App, Lib, Templates) {
	Lib.BoardDropZoneModel = Backbone.Model.extend({
		'defaults': {
			'character': null,
			'tile': null
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));