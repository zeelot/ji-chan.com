<?php defined('SYSPATH') or die('No direct script access.');

$js_app_file = Kohana::$environment === Kohana::DEVELOPMENT
	? 'js/compiled/app.js'
	: 'js/compiled/app.min.js';

return array
(
	'default-template' => array
	(
		array('style', Media::url('css/compiled/styles.css'), 'head'),
		array('script', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js', 'body'),
		array('script', Media::url('js/vendor/hogan-2.0.0.min.js'), 'body', 10),
		array('script', Media::url('js/vendor/underscore-1.3.3.min.js'), 'body', 10),
		// Backbone.js depends on JQuery and Underscore
		array('script', Media::url('js/vendor/backbone-0.9.2.min.js'), 'body', 20),
		array('script', Media::url($js_app_file), 'body', 40),
	),
);