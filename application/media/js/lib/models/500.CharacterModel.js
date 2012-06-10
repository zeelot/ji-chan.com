(function ($, App, Lib, Templates) {
	/**
	 * A Character Model is a japanese character and all of its details. Tiles
	 * are made of a single Character Model and can choose to display any of its
	 * properties.
	 */
	Lib.CharacterModel = Backbone.Model.extend({
		// Only an English and one of the Japanese versions is required
		'defaults': {
			'english': null,
			'hiragana': null,
			'katakana': null,
			'romaji': null,
			'kanji': null
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));