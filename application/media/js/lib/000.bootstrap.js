(function() {
	// Global app object everything will be inside of
	window.App = {
		/**
		 * I define all application classes in here using StudlyCaps.
		 */
		Lib: {},
		/**
		 * Contains all the templates for rendering in JS.
		 * Any script tag with a class of 'template' will be places in here
		 * for you based on the data-path attribute used.
		 * Ex:
		 * <script type="text/mustache" class="template" data-path="layout/default"></script>
		 * The above template will be accessible from App.Templates['layout/default']
		 *
		 */
		Templates: {},
		/**
		 * You can place object istances in here as well. Like a User instance
		 * for the currently logged in user.
		 *
		 * I use camelCase for class instances.
		 */
		appRouter: null, // Will contain the AppRouter instance when the app starts
	};
})();