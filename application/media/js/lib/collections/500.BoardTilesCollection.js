(function ($, App, Lib, Templates) {
	Lib.BoardTilesCollection = Backbone.Collection.extend({
		'model': Lib.BoardTileModel
	});
}(jQuery, window.App, window.App.Lib, window.Templates));