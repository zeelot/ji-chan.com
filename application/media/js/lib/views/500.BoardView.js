(function ($, App, Lib, Templates) {
	Lib.BoardView = Backbone.View.extend({
		'template': null,

		'LevelCharactersCollection': null,
		'LevelSpawnZonesCollection': null,
		'LevelDropZonesCollection': null,

		'BoardDropZonesView': null,
		'BoardSpawnZonesView': null,

		'initialize': function () {
			this.template = Hogan.compile(Templates["widget/board"]);

			// Store the Collections that were passed in
			this.LevelCharactersCollection = this.options.LevelCharactersCollection;
			this.LevelSpawnZonesCollection = this.options.LevelSpawnZonesCollection;
			this.LevelDropZonesCollection = this.options.LevelDropZonesCollection;

			this.render();

			this.BoardDropZonesView = new Lib.BoardDropZonesView({
				'BoardDropZonesCollection': this.LevelDropZonesCollection,
				'BoardView': this
			});
			this.$('.drop-zones').html(this.BoardDropZonesView.$el);

			this.BoardSpawnZonesView = new Lib.BoardSpawnZonesView({
				'BoardSpawnZonesCollection': this.LevelSpawnZonesCollection
			});
			this.$('.spawn-zones').html(this.BoardSpawnZonesView.$el);
		},
		'render': function () {
			this.$el.html(this.template.render());
		},
		'findSpawnZone': function (cid) {
			return this.BoardSpawnZonesCollection.getByCid(cid);
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));