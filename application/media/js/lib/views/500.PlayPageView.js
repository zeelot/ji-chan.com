(function ($, App, Lib, Templates) {
	Lib.PlayPageView = Lib.PageView.extend({
		'layoutPath': 'layout/game',
		'templatePath': 'page/play',
		'LevelView': null,
		'initialize': function () {
			// Calls the parent initialize function
			Lib.PageView.prototype.initialize.call(this);
			this.LevelView = new Lib.BoardLevelMMOView();
			App.appUser.bind('change', this.updateScore, this);
		},
		updateScore: function () {
			console.log('updating');
			this.$('.player-score').text(App.appUser.get('score'));
		}
	});
}(jQuery, window.App, window.App.Lib, window.App.Templates));