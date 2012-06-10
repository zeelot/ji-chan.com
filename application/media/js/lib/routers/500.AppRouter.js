(function ($, App, Lib) {
	Lib.AppRouter = Backbone.Router.extend({
		/**
		 * This is the main router that every page uses.
		 * Define your routes here.
		 */
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
}(jQuery, window.App, window.App.Lib));