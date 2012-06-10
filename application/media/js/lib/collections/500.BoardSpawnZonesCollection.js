(function ($, App, Lib, Templates) {
	Lib.BoardSpawnZonesCollection = Backbone.Collection.extend({
		'model': Lib.BoardSpawnZoneModel,
		getRandomModel: function () {
			var randomIndex = Math.floor(Math.random()*this.length);
			return this.at(randomIndex);
		},
		getRandomEmptyModel: function () {
			var filtered = this.filter(function (Zone) {
				return Zone.get('tile') === null;
			});

			if (filtered.length === 0) {return null;}

			var randomIndex = Math.floor(Math.random()*filtered.length);
			return filtered[randomIndex];
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));