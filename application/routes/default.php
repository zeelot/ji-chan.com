<?php defined('SYSPATH') or die('No direct script access.');

/**
 * Set the routes. Each route must have a minimum of a name, a URI and a set of
 * defaults for the URI.
 */
Route::set('default', '(<uri>)', array('uri' => '.*'))
	->defaults(array(
		'controller' => 'main',
		'action'     => 'index',
	));