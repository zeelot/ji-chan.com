(function ($, App, Lib, Templates) {
	/**
	 * Used everywhere a Character has to be displayed
	 */
	Lib.CharacterView = Backbone.View.extend({
		'className': 'character',
		'display': null,
		'CharacterModel': null,
		'initialize': function () {
			this.CharacterModel = this.options.CharacterModel;
			this.display = this.options.display || 'english';
			this.render();
		},
		'render': function () {
			this.$el.text(this.CharacterModel.get(this.display));
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));