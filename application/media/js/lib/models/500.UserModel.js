(function ($, App, Lib, Templates) {
	Lib.UserModel = Backbone.Model.extend({
		'defaults': {
			'name': null,
			'email': null,
			'score': 0,
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));