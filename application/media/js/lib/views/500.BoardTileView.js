(function ($, App, Lib, Templates) {
	Lib.BoardTileView = Backbone.View.extend({
		'template': null,
		'tagName': 'div',
		'className': 'tile',
		'TileModel': null,
		'originalPosition': null,
		'initialize': function () {
			_.bindAll(this);

			this.TileModel = this.options.TileModel;
			this.render();
			this.$el.draggable({
				'containment': $('.board'),
				'zIndex': 1000,
				'snap': '.drop-zone',
				'snapMode': 'inner',
				'revert': 'invalid',
				'start': this.dragStart
			});
			this.$el.data('TileModel', this.TileModel);
			this.TileModel.bind('dropped:invalid', this.invalidDrop);
		},
		'render': function () {
			var characterView = new Lib.CharacterView({
				'CharacterModel': this.TileModel.get('character'),
				'display': 'hiragana'
			});

			this.$el.html(characterView.$el);
		},
		'dragStart': function (event, ui) {
			// Store the original position to be able to reset
			this.originalPosition = ui.originalPosition;
		},
		'invalidDrop': function (DropZoneModel, ui) {
			// Send the tile back to its Spawn Zone
			this.$el.animate({
				'top': this.originalPosition.top+'px',
				'left': this.originalPosition.left+'px'
			});
		},
		'enable': function () {
			this.$el.draggable('enable');
		},
		'disable': function () {
			this.$el.draggable('disable');
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));