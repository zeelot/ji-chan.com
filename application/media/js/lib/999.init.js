(function($, App, Lib, Templates) {
	// Initialize the app here
	$(function() {
		// Add all the templates to Templates
		$('script.template').each(function () {
			Templates[$(this).data('path')] = $(this).html();
		});

		// Initialize our Router and start the app
		App.appRouter = new Lib.AppRouter;
		// Start the backbone app if the router has been created
		Backbone.history && Backbone.history.start({pushState: true, root: '/'});
	});
})(jQuery, window.App, window.App.Lib, window.App.Templates);