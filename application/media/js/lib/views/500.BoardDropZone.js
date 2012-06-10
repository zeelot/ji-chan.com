(function ($, App, Lib, Templates) {
	Lib.BoardDropZoneView = Backbone.View.extend({
		'tagName': 'li',
		'className': 'drop-zone',
		'BoardDropZoneModel': null,
		'BoardView': null,
		'initialize': function () {
			_.bindAll(this);
			this.BoardDropZoneModel = this.options.model;
			this.BoardView = this.options.BoardView;

			// Render this View every time the Model changes
			this.BoardDropZoneModel.bind('change:character', this.render, this);
			this.BoardDropZoneModel.bind('change:tile', this.render, this);

			this.render();
			this.$el.droppable({
				'drop': this.dropped
			});
		},
		'render': function () {
			//console.log('rendering');
			if (this.BoardDropZoneModel.get('character') === null) {
				this.$el.html('&nbsp;');
			} else {
				var characterView = new Lib.CharacterView({
					'CharacterModel': this.BoardDropZoneModel.get('character'),
					'display': this.BoardDropZoneModel.get('tile') ? 'hiragana' : 'english'
				});

				if (this.BoardDropZoneModel.get('tile')) {
					// This Drop Zone has a tile
					this.$el.addClass('has-tile');
				} else {
					this.$el.removeClass('has-tile');
				}

				this.$el.html(characterView.$el);
			}
		},
		'dropped': function (event, ui) {
			var TileModel = ui.draggable.data('TileModel');

			if (this.BoardDropZoneModel.get('character') === TileModel.get('character')) {
				this.BoardDropZoneModel.trigger('dropped dropped:valid', this.BoardDropZoneModel, ui);
				TileModel.trigger('dropped dropped:valid', this.BoardDropZoneModel, ui);
			} else {
				this.BoardDropZoneModel.trigger('dropped dropped:invalid', this.BoardDropZoneModel, ui);
				TileModel.trigger('dropped dropped:invalid', this.BoardDropZoneModel, ui);
			}
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));