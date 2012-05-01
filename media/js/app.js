/**
 * Our one global object everything sits in
 */
window.App = {
	/**
	 * Contains all our class definitions
	 */
	'Lib': {},
	/**
	 * Contains the templates for the app
	 */
	'Templates': {},
	/**
	 * Contains the main Router instance
	 */
	'Router': null,
	/**
	 * Contains the User Model for the user on the page
	 */
	'User': null
};

/**
 * This section defines all the application classes. Eventually, each class will
 * go in its own file.
 *
 * @param  {Object} App       The entire App object where everything sits
 * @param  {Object} Lib       Lib contains all classes
 * @param  {Object} Templates Contains the templates for the app
 * @return {void}
 */
(function (App, Lib, Templates) {
	Lib.AppRouter = Backbone.Router.extend({
		'routes': {
			'': 'home',
			'play': 'play'
		},
		'currentPage': null,
		'home': function () {
			this.currentPage = new Lib.HomePageView();
		},
		'play': function () {
			this.currentPage = new Lib.PlayPageView();
		}
	});

	Lib.HomePageView = Backbone.View.extend({
		'el': 'body',
		'template': null,
		'events': {
			'click button': 'buttonClicked'
		},
		'initialize': function () {
			this.template = Hogan.compile(Templates["page/home"]);

			this.render();
		},
		'buttonClicked': function () {
			App.Router.navigate('play', {trigger: true});
		},
		'render': function () {
			this.$el.html(this.template.render());
		}
	});

	Lib.PlayPageView = Backbone.View.extend({
		'el': 'body',
		'template': null,
		'BoardView': null,
		'LevelView': null,
		'initialize': function () {
			this.template = Hogan.compile(Templates["page/play"]);

			this.render();
			this.LevelView = new Lib.BoardLevel1View;
		},
		'render': function () {
			this.$el.html(this.template.render());
		}
	});

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
		'validDrop': function (event, DropZoneModel) {
			var TileID = event.originalEvent.dataTransfer.getData('TileID');

			this.progress += 1.0/this.LevelDropZonesCollection.length;

			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				if (SpawnZone.get('tile').cid === TileID) {
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
		'invalidDrop': function (event) {
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

	Lib.BoardDropZonesView = Backbone.View.extend({
		'tagName': 'ol',
		'className': 'board-drop-zones',
		'BoardDropZonesCollection': null,
		'BoardView': null,
		'initialize': function () {
			this.BoardDropZonesCollection = this.options.BoardDropZonesCollection;
			this.BoardView = this.options.BoardView;

			this.render();

			this.BoardDropZonesCollection.bind('add', this.addDropZone, this);
		},
		'render': function () {
			this.BoardDropZonesCollection.each(this.addDropZone, this);
		},
		'addDropZone': function (dropZoneModel) {
			var view = new Lib.BoardDropZoneView({
				'model': dropZoneModel,
				'BoardView': this.BoardView
			});

			this.$el.append(view.$el);
		}
	});

	Lib.BoardDropZoneView = Backbone.View.extend({
		'tagName': 'li',
		'className': 'drop-zone',
		'BoardDropZoneModel': null,
		'BoardView': null,
		'events': {
			'dragover': 'draggedOver',
			'dragenter': 'dragEntered',
			'dragleave': 'dragLeft',
			'drop': 'dropped'
		},
		'initialize': function () {
			this.BoardDropZoneModel = this.options.model;
			this.BoardView = this.options.BoardView;

			// Render this View every time the Model changes
			this.BoardDropZoneModel.bind('change:character', this.render, this);
			this.BoardDropZoneModel.bind('change:tile', this.render, this);

			this.render();
		},
		'render': function () {
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
		'draggedOver': function (event) {
			// We need to preventDefault() to allow dropping items on this Zone
			if (this.BoardDropZoneModel.get('tile') === null) {
				// Only allow dropping when there is no tile in here
				event.preventDefault();
			}
		},
		'dragEntered': function (event) {
			// We need to preventDefault() to allow dropping items on this Zone
			if (this.BoardDropZoneModel.get('tile') === null) {
				// Only allow dropping when there is no tile in here
				event.preventDefault();
			}
		},
		'dragLeft': function (event) {},
		'dropped': function (event) {
			var cid = event.originalEvent.dataTransfer.getData('CharacterID');

			if (this.BoardDropZoneModel.get('character').cid === cid) {
				this.BoardDropZoneModel.trigger('dropped dropped:valid', event, this.BoardDropZoneModel);
			} else {
				this.BoardDropZoneModel.trigger('dropped dropped:invalid', event, this.BoardDropZoneModel);
			}
		}
	});

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
				this.$el.removeClass('disabled');
				this.TileView.enable();
			} else {
				this.$el.addClass('disabled');
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

	Lib.BoardTileView = Backbone.View.extend({
		'template': null,
		'tagName': 'div',
		'className': 'tile',
		'attributes': {
			'draggable': true
		},
		'TileModel': null,
		'events': {
			'dragstart': 'dragStart'
		},
		'initialize': function () {
			_.bindAll(this);

			this.TileModel = this.options.TileModel;
			this.render();
		},
		'render': function () {
			var characterView = new Lib.CharacterView({
				'CharacterModel': this.TileModel.get('character'),
				'display': 'hiragana'
			});

			this.$el.html(characterView.$el);
		},
		'dragStart': function (event) {
			event.originalEvent.dataTransfer.setData('CharacterID', this.TileModel.get('character').cid);
			event.originalEvent.dataTransfer.setData('TileID', this.TileModel.cid);
		},
		'enable': function () {
			this.$el.attr('draggable', true);
		},
		'disable': function () {
			this.$el.attr('draggable', false);
		}
	});

	Lib.BoardModel = Backbone.Model.extend({});
	Lib.BoardDropZoneModel = Backbone.Model.extend({
		'defaults': {
			'character': null,
			'tile': null
		}
	});
	Lib.BoardDropZonesCollection = Backbone.Collection.extend({
		'model': Lib.BoardDropZoneModel,
		getRandomModel: function () {
			var randomIndex = Math.floor(Math.random()*this.length);
			return this.at(randomIndex);
		},
		getRandomEmptyModel: function () {
			var filtered = this.filter(function (Zone) {
				return Zone.get('character') === null;
			});

			if (filtered.length === 0) {return null;}

			var randomIndex = Math.floor(Math.random()*filtered.length);
			return filtered[randomIndex];
		}
	});
	Lib.BoardSpawnZoneModel = Backbone.Model.extend({
		'defaults': {
			'tile': null,
			'enabled': true
		}
	});
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

	/**
	 * A Board Tile is simply an object that represents a character on the board.
	 * Multiple Tiles can represent the same character so there can be many
	 * Tiles of the character 'あ' but only one character object for it.
	 */
	Lib.BoardTileModel = Backbone.Model.extend({
		'defaults': {
			'character': null,
		}
	});
	Lib.BoardTilesCollection = Backbone.Collection.extend({
		'model': Lib.BoardTileModel
	});

	/**
	 * A Character Model is a japanese character and all of its details. Tiles
	 * are made of a single Character Model and can choose to display any of its
	 * properties.
	 */
	Lib.CharacterModel = Backbone.Model.extend({
		// Only an English and one of the Japanese versions is required
		'defaults': {
			'english': null,
			'hiragana': null,
			'katakana': null,
			'romaji': null,
			'kanji': null
		}
	});
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

	Lib.User = Backbone.Model.extend({
		'defaults': {
			'name': null,
			'email': null,
			'score': 0,
		}
	});

}(window.App, window.App.Lib, window.App.Templates));

jQuery(document).ready(function($) {
	// Add all the templates to window.App.Templates
	$('script.template').each(function () {
		window.App.Templates[$(this).data('path')] = $(this).html();
	});

	// Initialize our user
	// @TODO: Load returning users
	window.App.User = new window.App.Lib.User;

	// Initialize our Router and start the app
	window.App.Router = new window.App.Lib.AppRouter;
	Backbone.history.start({pushState: true, root: '/jpn-games/'});
});