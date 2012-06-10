(function ($, App, Lib, Templates) {
	Lib.HomePageView = Lib.PageView.extend({
		// Specify the templatePath and let the PageView do the rest
		'templatePath': 'page/home'
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));
