(function ($, App, Lib, Templates) {
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
}(jQuery, window.App, window.App.Lib, window.App.Templates));