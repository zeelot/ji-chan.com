(function ($, App, Lib, Templates) {
	/**
	 * Character Models in this collection will always be unique.
	 */
	Lib.CharactersCollection = Backbone.Collection.extend({
		'model': Lib.CharacterModel,
		getRandomModel: function () {
			var randomIndex = Math.floor(Math.random()*this.length);
			return this.at(randomIndex);
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));