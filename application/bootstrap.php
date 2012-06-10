<?php defined('SYSPATH') or die('No direct script access.');

// -- Environment setup --------------------------------------------------------

// Load the core Kohana class
require SYSPATH.'classes/kohana/core'.EXT;

if (is_file(APPPATH.'classes/kohana'.EXT))
{
	// Application extends the core
	require APPPATH.'classes/kohana'.EXT;
}
else
{
	// Load empty core extension
	require SYSPATH.'classes/kohana'.EXT;
}

/**
 * Set the default time zone.
 *
 * @see  http://docs.kohanaphp.com/about.configuration
 * @see  http://php.net/timezones
 */
date_default_timezone_set('America/Phoenix');

/**
 * Set the default locale.
 *
 * @see  http://docs.kohanaphp.com/about.configuration
 * @see  http://php.net/setlocale
 */
setlocale(LC_ALL, 'en_US.utf-8', 'english-us');

/**
 * Enable the Kohana auto-loader.
 *
 * @see  http://docs.kohanaphp.com/about.autoloading
 * @see  http://php.net/spl_autoload_register
 */
spl_autoload_register(array('Kohana', 'auto_load'));

/**
 * Enable the Kohana auto-loader for unserialization.
 *
 * @see  http://php.net/spl_autoload_call
 * @see  http://php.net/manual/var.configuration.php#unserialize-callback-func
 */
ini_set('unserialize_callback_func', 'spl_autoload_call');

// -- Configuration and initialization -----------------------------------------

/**
 * Set the default language
 */
I18n::lang('en-us');

/**
 * Set Kohana::$environment if a 'KOHANA_ENV' environment variable has been supplied.
 *
 * Note: If you supply an invalid environment name, a PHP warning will be thrown
 * saying "Couldn't find constant Kohana::<INVALID_ENV_NAME>"
 */
if (($env = getenv('KOHANA_ENV')) !== FALSE)
{
	/**
	 * We have to ignore this line in the coding standards because it expects
	 * constants to always be uppercase.
	 *
	 * The error that is returned from PHPCS is:
	 * Constants must be uppercase; expected 'KOHANA::' but found 'Kohana::'
	 */
	// @codingStandardsIgnoreStart
	Kohana::$environment = constant('Kohana::'.strtoupper($env));
	// @codingStandardsIgnoreEnd
}
else
{
	$env = 'development';
}

Kohana::$environment_string = $env;

/**
 * Attach a file reader to config. Multiple readers are supported.
 */

Kohana::$config = new Config;
Kohana::$config->attach(new Config_File);

/**
 * Attach the environment specific configuration file reader to config if not in production.
 */
if (Kohana::$environment != Kohana::PRODUCTION)
{
	Kohana::$config->attach(new Config_File('config/environments/'.$env));
}

/**
 * Set the session save path.
 * @see  http://php.net/session-save-path
 */
$path = Kohana::$config->load('session')->save_path;
$real = realpath($path);
if ( ! is_dir($real) OR ! is_writable($real))
	throw new Kohana_Exception('Invalid session save path specified: :path',
		array(':path' => $path));

session_save_path($path);

unset($env, $path, $real);

/**
 * Initialize Kohana, setting the default options.
 *
 * The following options are available:
 *
 * - string   base_url    path, and optionally domain, of your application   NULL
 * - string   index_file  name of your index file, usually "index.php"       index.php
 * - string   charset     internal character set used for input and output   utf-8
 * - string   cache_dir   set the internal cache directory                   APPPATH/cache
 * - boolean  errors      enable or disable error handling                   TRUE
 * - boolean  profile     enable or disable internal profiling               TRUE
 * - boolean  caching     enable or disable internal caching                 FALSE
 */
Kohana::init(Kohana::$config->load('init')->as_array());

/**
 * Attach the file write to logging. Multiple writers are supported.
 */
Kohana::$log->attach(new Log_File(APPPATH.'logs'));

/**
 * Enable modules. Modules are referenced by a relative or absolute path.
 */
Kohana::modules(Kohana::$config->load('modules')->as_array());

/**
 * Cookie salt is used to make sure cookies haven't been modified by the client
 * @TODO: Change this for each project
 */
Cookie::$salt = 'KEVEHQxU;CfHY32LbpHn(c(uctcexPjA';

/**
 * Include default routes. Default routes are located in application/routes/default.php
 */
include Kohana::find_file('routes', 'default');

/**
 * Include the routes for the current environment.
 */

if ($routes = Kohana::find_file('routes', Kohana::$environment))
{
	include $routes;
}

/**
 * Enable modules. Modules are referenced by a relative or absolute path.
 */
Kohana::modules(Kohana::$config->load('modules')->as_array());
