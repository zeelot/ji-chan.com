(function ($, App, Lib, Templates) {
	Lib.BoardSpawnZonesView = Backbone.View.extend({
		'tagName': 'ol',
		'className': 'board-spawn-zones',
		'BoardSpawnZonesCollection': null,
		'initialize': function () {
			this.BoardSpawnZonesCollection = this.options.BoardSpawnZonesCollection;
			this.render();

			this.BoardSpawnZonesCollection.bind('add', this.addSpawnZone, this);
		},
		'render': function () {
			this.BoardSpawnZonesCollection.each(this.addSpawnZone, this);
		},
		'addSpawnZone': function (spawnZoneModel) {
			var view = new Lib.BoardSpawnZoneView({
				model: spawnZoneModel
			});

			this.$el.append(view.$el);
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));