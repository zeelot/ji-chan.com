<?php defined('SYSPATH') or die('No direct script access.');

class Kohana extends Kohana_Core
{
	const APP_VERSION = '0.0.0';
	const QA = 5;
	const BETA = 6;

	// Useful for when the constant is too vague as an int
	public static $environment_string = 'development';

	public static function app_revision()
	{
		static $revision;

		if ( ! $revision)
		{
			$git = new Git(APPPATH);
			$revision = $git->execute('log --pretty=format:\'%H\' -1');
		}

		return $revision;
	}

	public static function init(array $settings = NULL)
	{
		if (Kohana::$_init)
		{
			// Do not allow execution twice
			return;
		}

		// Kohana is now initialized
		Kohana::$_init = TRUE;

		if (isset($settings['profile']))
		{
			// Enable profiling
			Kohana::$profiling = (bool) $settings['profile'];
		}

		// Start an output buffer
		ob_start();

		if (isset($settings['errors']))
		{
			// Enable error handling
			Kohana::$errors = (bool) $settings['errors'];
		}

		if (Kohana::$errors === TRUE)
		{
			// Enable Kohana exception handling, adds stack traces and error source.
			set_exception_handler(array('Kohana_Exception', 'handler'));

			// Enable Kohana error handling, converts all PHP errors to exceptions.
			set_error_handler(array('Kohana', 'error_handler'));
		}

		// Enable the Kohana shutdown handler, which catches E_FATAL errors.
		register_shutdown_function(array('Kohana', 'shutdown_handler'));

		if (ini_get('register_globals'))
		{
			// Reverse the effects of register_globals
			Kohana::globals();
		}

		if (isset($settings['expose']))
		{
			Kohana::$expose = (bool) $settings['expose'];
		}

		// Determine if we are running in a command line environment
		Kohana::$is_cli = (PHP_SAPI === 'cli');

		// Determine if we are running in a Windows environment
		Kohana::$is_windows = (DIRECTORY_SEPARATOR === '\\');

		// Determine if we are running in safe mode
		Kohana::$safe_mode = (bool) ini_get('safe_mode');

		if (isset($settings['cache_dir']))
		{
			if ( ! is_dir($settings['cache_dir']))
			{
				try
				{
					// Create the cache directory
					mkdir($settings['cache_dir'], 0755, TRUE);

					// Set permissions (must be manually set to fix umask issues)
					chmod($settings['cache_dir'], 0755);
				}
				catch (Exception $e)
				{
					throw new Kohana_Exception('Could not create cache directory :dir',
						array(':dir' => Debug::path($settings['cache_dir'])));
				}
			}

			// Set the cache directory path
			Kohana::$cache_dir = realpath($settings['cache_dir']);
		}
		else
		{
			// Use the default cache directory
			Kohana::$cache_dir = APPPATH.'cache';
		}

		if ( ! is_writable(Kohana::$cache_dir))
		{
			throw new Kohana_Exception('Directory :dir must be writable',
				array(':dir' => Debug::path(Kohana::$cache_dir)));
		}

		if (isset($settings['cache_life']))
		{
			// Set the default cache lifetime
			Kohana::$cache_life = (int) $settings['cache_life'];
		}

		if (isset($settings['caching']))
		{
			// Enable or disable internal caching
			Kohana::$caching = (bool) $settings['caching'];
		}

		if (Kohana::$caching === TRUE)
		{
			// Load the file path cache
			Kohana::$_files = Kohana::cache('Kohana::find_file()');
		}

		if (isset($settings['charset']))
		{
			// Set the system character set
			Kohana::$charset = strtolower($settings['charset']);
		}

		if (function_exists('mb_internal_encoding'))
		{
			// Set the MB extension encoding to the same character set
			mb_internal_encoding(Kohana::$charset);
		}

		if (isset($settings['base_url']))
		{
			// Set the base URL
			Kohana::$base_url = rtrim($settings['base_url'], '/').'/';
		}

		if (isset($settings['index_file']))
		{
			// Set the index file
			Kohana::$index_file = trim($settings['index_file'], '/');
		}

		// Determine if the extremely evil magic quotes are enabled
		Kohana::$magic_quotes = (bool) get_magic_quotes_gpc();

		// Sanitize all request variables
		$_GET    = Kohana::sanitize($_GET);
		$_POST   = Kohana::sanitize($_POST);
		$_COOKIE = Kohana::sanitize($_COOKIE);

		// Load the logger
		if ( ! Kohana::$log)
		{
			Kohana::$log = Log::instance();
		}

		// Load the config
		if ( ! Kohana::$config)
		{
			Kohana::$config = new Kohana_Config;
		}
	}
}
