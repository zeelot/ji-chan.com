/**
 * Our one global object everything sits in
 */
window.App = {
	/**
	 * Contains all our class definitions
	 */
	'Lib': {},
	'Templates': {},
	'Router': null
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
		'LevelCharactersCollection': null,
		'LevelSpawnZonesCollection': null,
		'LevelDropZonesCollection': null,
		initialize: function () {
			_.bindAll(this);

			// First, we create the characters that will exist in this level
			this.LevelCharactersCollection = new Lib.CharactersCollection([
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
			this.LevelSpawnZonesCollection = new Lib.BoardSpawnZonesCollection([{}, {}, {}]);

			// We do the same thing for the Drop Zones Collection
			this.LevelDropZonesCollection = new Lib.BoardDropZonesCollection([{}, {}, {}]);

			// Let's create out Board View and pass it our Collections
			this.BoardView = new Lib.BoardView({
				'el': this.$('.board-container'),
				'LevelCharactersCollection': this.LevelCharactersCollection,
				'LevelSpawnZonesCollection': this.LevelSpawnZonesCollection,
				'LevelDropZonesCollection': this.LevelDropZonesCollection
			});

			this.start();
		},
		/**
		 * Sets up all the various timers for everything like creating Tiles or
		 * ending the game. This will probably be abstracted into a Model later.
		 */
		start: function () {
			setInterval(this.addRandomTile, 1000);
			setInterval(this.addRandomDropZoneCharacter, 1000);
		},
		addRandomTile: function () {
			var Tile = new Lib.BoardTileModel({
				'character': this.LevelCharactersCollection.getRandomModel()
			});

			// Place the new Tile onto a random Spawn Zone (Must be empty)
			var EmptyZoneModel = this.LevelSpawnZonesCollection.getRandomEmptyModel();

			if (EmptyZoneModel) {
				EmptyZoneModel.set({
					'tile': Tile
				});

				setTimeout(function () {
					EmptyZoneModel.set({
						'tile': null
					});
				}, Math.floor(Math.random()*10000));
			}
		},
		addRandomDropZoneCharacter: function () {
			var Character = this.LevelCharactersCollection.getRandomModel();

			// Place the new Character into a random Drop Zone (Must be empty)
			var EmptyZoneModel = this.LevelDropZonesCollection.getRandomEmptyModel();

			if (EmptyZoneModel) {
				EmptyZoneModel.set({
					'character': Character
				});

				setTimeout(function () {
					EmptyZoneModel.set({
						'character': null
					});
				}, Math.floor(Math.random()*10000));
			}
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
		'template': null,
		'tagName': 'li',
		'className': 'board-drop-zone',
		'BoardDropZoneModel': null,
		'BoardView': null,
		'events': {
			'dragover': 'draggedOver',
			'dragenter': 'dragEntered',
			'dragleave': 'dragLeft',
			'drop': 'dropped'
		},
		'initialize': function () {
			this.template = Hogan.compile(Templates["widgets/board/drop-zone"]);
			this.BoardDropZoneModel = this.options.model;
			this.BoardView = this.options.BoardView;

			// Render this View every time the Model changes
			this.BoardDropZoneModel.bind('change:character', this.render, this);

			this.render();
		},
		'render': function () {
			if (this.BoardDropZoneModel.get('character') === null) {
				this.$el.html('');
			} else {
				this.$el.html(this.template.render(this.templateData()));
			}
		},
		'templateData': function () {
			return {
				'english': this.BoardDropZoneModel.get('character').get('english'),
				'hiragana': this.BoardDropZoneModel.get('character').get('hiragana'),
				'katakana': this.BoardDropZoneModel.get('character').get('katakana'),
				'romaji': this.BoardDropZoneModel.get('character').get('romaji'),
				'kanji': this.BoardDropZoneModel.get('character').get('kanji')
			};
		},
		'draggedOver': function (event) {
			event.preventDefault();
		},
		'dragEntered': function (event) {
			event.preventDefault();
		},
		'dragLeft': function (event) {},
		'dropped': function (event) {
			var cid = event.originalEvent.dataTransfer.getData('CharacterID');

			if (this.BoardDropZoneModel.get('character').cid === cid) {
				alert('Correct!');
			} else {
				alert('Incorrect!');
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
		'className': 'spawn-drop-zone',
		'BoardSpawnZoneModel': null,
		'initialize': function () {
			this.BoardSpawnZoneModel = this.options.model;

			// Render this View every time the Model changes
			this.BoardSpawnZoneModel.bind('change:tile', this.render, this);

			this.render();
		},
		'render': function () {
			if (this.BoardSpawnZoneModel.get('tile') === null) {
				this.$el.html('');
			} else {
				var TileView = new Lib.BoardTileView({
					'TileModel': this.BoardSpawnZoneModel.get('tile')
				});
				this.$el.html(TileView.$el);
			}
		}
	});

	Lib.BoardTileView = Backbone.View.extend({
		'template': null,
		'tagName': 'div',
		'className': 'tile',
		'attributes': {
			'draggable': 'true'
		},
		'TileModel': null,
		'events': {
			'dragstart': 'dragStart'
		},
		'initialize': function () {
			this.template = Hogan.compile(Templates["widgets/board/tile"]);
			this.TileModel = this.options.TileModel;
			this.render();
		},
		'render': function () {
			this.$el.html(this.template.render(this.templateData()));
		},
		'templateData': function () {
			return {
				'english': this.TileModel.get('character').get('english'),
				'hiragana': this.TileModel.get('character').get('hiragana'),
				'katakana': this.TileModel.get('character').get('katakana'),
				'romaji': this.TileModel.get('character').get('romaji'),
				'kanji': this.TileModel.get('character').get('kanji')
			};
		},
		'dragStart': function (event) {
			event.originalEvent.dataTransfer.setData('CharacterID', this.TileModel.get('character').cid);
		}
	});

	Lib.BoardModel = Backbone.Model.extend({});
	Lib.BoardDropZoneModel = Backbone.Model.extend({
		'defaults': {
			'character': null
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
			'tile': null
		},
		getCharacterHiragana: function () {
			return (this.get('tile') === null) ? null : this.get('tile').get('character').get('hiragana');
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

}(window.App, window.App.Lib, window.App.Templates));

jQuery(document).ready(function($) {
	// Add all the templates to window.App.Templates
	$('script.template').each(function () {
		window.App.Templates[$(this).data('path')] = $(this).html();
	});

	// Initialize our Router and start the app
	window.App.Router = new window.App.Lib.AppRouter;
	Backbone.history.start({pushState: true, root: '/jpn-games/'});
});