(function ($, App, Lib, Templates) {
	/**
	 * A Board Tile is simply an object that represents a character on the board.
	 * Multiple Tiles can represent the same character so there can be many
	 * Tiles of the character 'あ' but only one character object for it.
	 */
	Lib.BoardTileModel = Backbone.Model.extend({
		'defaults': {
			'character': null,
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));