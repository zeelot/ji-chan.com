(function ($, App, Lib, Templates) {
	Lib.BoardSpawnZoneView = Backbone.View.extend({
		'tagName': 'li',
		'className': 'spawn-zone',
		'BoardSpawnZoneModel': null,
		'TileView': null,
		'initialize': function () {
			this.BoardSpawnZoneModel = this.options.model;

			// Render this View every time the Model changes
			this.BoardSpawnZoneModel.bind('change:tile', this.render, this);
			this.BoardSpawnZoneModel.bind('change:enabled', this.changedEnabled, this);

			this.render();
		},
		'changedEnabled': function () {
			if (this.BoardSpawnZoneModel.get('enabled')) {
				this.$el.show();
				this.TileView.enable();
			} else {
				this.$el.hide();
				this.TileView.disable();
			}
		},
		'render': function () {
			if (this.BoardSpawnZoneModel.get('tile') === null) {
				this.$el.html('');
				this.TileView = null;
			} else {
				this.TileView = new Lib.BoardTileView({
					'TileModel': this.BoardSpawnZoneModel.get('tile')
				});
				this.$el.html(this.TileView.$el);
			}
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));