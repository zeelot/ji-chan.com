(function ($, App, Lib, Templates) {
	Lib.BoardLevel1View = Backbone.View.extend({
		'el': 'body',
		/**
		 * This is the Collection with all the Character Models needed in the
		 * Level. Eventually I will place the Characters in a dictionary of
		 * some sort and will simply populate this Collection from there.
		 */
		'LevelCharactersCollection': null,
		/**
		 * This is the Collection of Spawn Zone Models. Every Spawn Zone has the
		 * ability of being loaded with a Tile Model which can be dragged out.
		 * Levels usually decide how many Spawn Zones to place in this
		 * Collection before they are even populated with Tiles.
		 */
		'LevelSpawnZonesCollection': null,
		/**
		 * This Collection is similar to the Spawn Zones Collection, except
		 * that it is loaded directly with the Character Model that the Drop
		 * Zone should accept. A Drop Zone with no Character Model will simply
		 * not accept anything being dropped on it.
		 */
		'LevelDropZonesCollection': null,
		'progress': 0.0,
		'initialize': function () {
			_.bindAll(this);

			// First, we create the characters that will exist in this level
			this.LevelCharactersCollection = new Lib.CharactersCollection([
				// @TODO: Move these models to a Disctionary class
				{
					'english': 'a',
					'hiragana': 'あ',
				},
				{
					'english': 'i',
					'hiragana': 'い',
				},
				{
					'english': 'u',
					'hiragana': 'う',
				},
				{
					'english': 'e',
					'hiragana': 'え',
				},
				{
					'english': 'o',
					'hiragana': 'お',
				}
			]);

			/**
			 * We fill the Spawn Zones Collection with the number of Zones
			 * we want on this board. These Zones will not have Tiles in them
			 * until the level begins.
			 *
			 * Let's start with 3 zones :)
			 *
			 * @type {Lib.BoardSpawnZonesCollection}
			 */
			this.LevelSpawnZonesCollection = new Lib.BoardSpawnZonesCollection([{}, {}, {}, {}, {}]);

			// We do the same thing for the Drop Zones Collection
			this.LevelDropZonesCollection = new Lib.BoardDropZonesCollection([{}, {}, {}, {}, {}]);

			// Let's create out Board View and pass it our Collections
			this.BoardView = new Lib.BoardView({
				'el': this.$('.board-container'),
				'LevelCharactersCollection': this.LevelCharactersCollection,
				'LevelSpawnZonesCollection': this.LevelSpawnZonesCollection,
				'LevelDropZonesCollection': this.LevelDropZonesCollection
			});

			this.LevelDropZonesCollection.bind('dropped:valid', this.validDrop);
			this.LevelDropZonesCollection.bind('dropped:invalid', this.invalidDrop);

			this.start();
		},
		'validDrop': function (DropZoneModel, ui) {
			this.progress += 1.0/this.LevelDropZonesCollection.length;

			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				if (SpawnZone.get('tile') === ui.draggable.data('TileModel')) {
					SpawnZone.set({
						'enabled': false
					});

					DropZoneModel.set({
						'tile': SpawnZone.get('tile')
					});
					return true; // Stops the loop
				}
			});

			if (this.progress === 1) {
				alert('You win! Hold tight while we make some more levels.');
			}
		},
		'invalidDrop': function (DropZoneModel, ui) {
			// @TODO: Some score keeping
		},
		/**
		 * Sets up all the various timers for everything like creating Tiles or
		 * ending the game. This will probably be abstracted into a Model later.
		 */
		'start': function () {
			this.populateZones();
		},
		'populateZones': function () {
			var length = this.LevelSpawnZonesCollection.length,
				Tile,
				Character,
				EmptySpawnZone,
				EmptyDropZone,
				i;

			for (i = 0; i < length; i++) {
				Character = this.LevelCharactersCollection.at(i);
				Tile = new Lib.BoardTileModel({
					'character': Character
				});

				EmptySpawnZone = this.LevelSpawnZonesCollection.getRandomEmptyModel();
				EmptyDropZone = this.LevelDropZonesCollection.getRandomEmptyModel();

				EmptySpawnZone.set({
					'tile': Tile
				});
				EmptyDropZone.set({
					'character': Character
				});
			};
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));