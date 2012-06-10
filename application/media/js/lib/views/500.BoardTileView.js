(function ($, App, Lib, Templates) {
	Lib.BoardTileView = Backbone.View.extend({
		'template': null,
		'tagName': 'div',
		'className': 'tile',
		'TileModel': null,
		'originalPosition': null,
		'cancelledDrag': false,
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
				'drag': this.drag,
				'start': this.start,
				'stop': this.stop
			});
			this.$el.data('TileModel', this.TileModel);
			this.TileModel.bind('dropped:invalid', this.invalidDrop);
			this.TileModel.on('remoteDrag', this.remoteDrag);
			this.TileModel.on('remoteInvalidDrop', this.remoteInvalidDrop);
		},
		'render': function () {
			var characterView = new Lib.CharacterView({
				'CharacterModel': this.TileModel.get('character'),
				'display': 'hiragana'
			});

			this.$el.html(characterView.$el);

			this.originalPosition = this.$el.position();
		},
		'drag': function (event, ui) {
			if (this.cancelledDrag) {
				this.revertPosition();
				return false;
			} else {
				this.TileModel.trigger('localDrag', ui.position);
			}
		},
		'remoteDrag': function (tilePosition) {
			this.$el.stop(true, true).animate({
				'top': tilePosition.top+'px',
				'left': tilePosition.left+'px'
			});
		},
		'remoteInvalidDrop': function () {
			this.revertPosition();
		},
		'start': function (event, ui) {
			this.TileModel.trigger('localDragStart');
		},
		'stop': function (event, ui) {
			console.log(this.$el.position().top, this.originalPosition.top);
			if (this.$el.position().top === this.originalPosition.top)
			{
				// Failed drop
				this.TileModel.trigger('localInvalidDrop');
			}
		},
		'revertPosition': function () {
			// Send the tile back to its Spawn Zone
			this.$el.animate({
				'top': this.originalPosition.top+'px',
				'left': this.originalPosition.left+'px'
			});
		},
		'invalidDrop': function (DropZoneModel, ui) {
			// Send the tile back to its Spawn Zone
			this.revertPosition();
			console.log('invalid drop');
		},
		'enable': function () {
			this.$el.draggable('enable');
			this.cancelledDrag = false;
		},
		'disable': function () {
			this.$el.draggable('disable');
			this.cancelledDrag = true;
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));