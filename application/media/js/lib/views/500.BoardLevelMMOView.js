(function ($, App, Lib, Templates) {
	Lib.BoardLevelMMOView = Backbone.View.extend({
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
		'socket': null,
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

			this.connectSocket();
		},
		'connectSocket': function () {
			var self = this;
			try {
				this.socket = new WebSocket('ws://192.168.50.167:8000');

				this.socket.onopen = this.socketOpen;
				this.socket.onmessage = this.socketMessage;
				this.socket.onclose = this.socketClose;

				this.socket_send = _.throttle(function (message) {
					self.socket.send(message);
				}, 100);
			} catch (exception) {
				console.log(exception);
			}
		},
		'socketOpen': function () {
			this.start();
		},
		'socketClose': function () {
			//alert('Oops! Reloading page!');
			//window.location.reload();
		},
		'socketMessage': function (message) {
			var obj = $.parseJSON(message.data);
			console.log(obj.type);
			if (obj.type === 'boardInfo') {
				this.populateZones(obj.board);
			} else if (obj.type === 'validTileDrop') {
				this.setTile(obj.tileID);
			} else if (obj.type === 'invalidTileDrop') {
				this.invalidTileDrop(obj.tileID);
			} else if (obj.type === 'tileDragStart') {
				this.tileDragStart(obj.tileID);
			} else if (obj.type === 'tileDrag') {
				this.tileDrag(obj.tileID, obj.tilePosition);
			}
		},
		'validDrop': function (DropZoneModel, ui) {
			this.socket_send(JSON.stringify({
				'type': 'validTileDrop',
				'tileID': ui.draggable.data('TileModel').get('id')
			}));
		},
		'invalidTileDrop': function (tileID) {
			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				var tile = SpawnZone.get('tile');
				if (tile === null) {
					return false; // Next!
				}
				if (tile.get('id') === tileID) {
					tile.trigger('remoteInvalidDrop');

					return true; // Stops looking
				}
			});
		},
		'tileDragStart': function (tileID) {
			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				var tile = SpawnZone.get('tile');
				if (tile === null) {
					return false; // Next!
				}
				if (tile.get('id') === tileID) {
					tile.trigger('remoteDragStart');

					return true; // Stops looking
				}
			});
		},
		'tileDrag': function (tileID, tilePosition) {
			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				var tile = SpawnZone.get('tile');
				if (tile === null) {
					return false; // Next!
				}
				if (tile.get('id') === tileID) {
					tile.trigger('remoteDrag', tilePosition);

					return true; // Stops looking
				}
			});
		},
		/**
		 * Sets up all the various timers for everything like creating Tiles or
		 * ending the game. This will probably be abstracted into a Model later.
		 */
		'start': function () {
			this.socket_send(JSON.stringify({
				'type': 'getBoardInfo'
			}));
		},
		'populateZones': function (board) {
			var length = board.length,
				Tile,
				Character,
				SpawnZone,
				DropZone,
				i,
				self = this;

			for (i = 0; i < length; i++) {
				Character = this.LevelCharactersCollection.at(board[i]['character']);
				Tile = new Lib.BoardTileModel({
					'id': i,
					'character': Character
				});

				(function (T) {
					T.on('localDrag', function (tilePosition) {
						self.socket_send(JSON.stringify({
							'type': 'tileDrag',
							'tileID': T.get('id'),
							'tilePosition': tilePosition
						}));
					});
					T.on('localDragStart', function () {
						self.socket_send(JSON.stringify({
							'type': 'tileDragStart',
							'tileID': T.get('id')
						}));
					});
					T.on('localInvalidDrop', function () {
						self.socket_send(JSON.stringify({
							'type': 'invalidTileDrop',
							'tileID': T.get('id')
						}));
					});
				}(Tile));

				SpawnZone = this.LevelSpawnZonesCollection.at(i);
				DropZone = this.LevelDropZonesCollection.at(board[i]['dropzone']);

				DropZone.set({
					'character': Character
				});

				if (board[i]['placed']) {
					DropZone.set({
						'tile': Tile
					});
				} else {
					SpawnZone.set({
						'tile': Tile
					});
				}
			};
		},
		'setTile': function (tileID) {
			var self = this;
			this.LevelSpawnZonesCollection.any(function (SpawnZone) {
				var tile = SpawnZone.get('tile');
				if (tile === null) {
					return false; // Next!
				}
				if (tile.get('id') === tileID) {
					SpawnZone.set({
						'tile': null
					});

					self.LevelDropZonesCollection.any(function (DropZone) {
						if (DropZone.get('character') === tile.get('character')) {
							DropZone.set({
								'tile': tile
							});

							return true;
						}
					});

					return true; // Stops the loop
				}
			});
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));