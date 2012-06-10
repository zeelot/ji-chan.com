<?php defined('SYSPATH') or die('No direct script access.');

class CLI extends Kohana_CLI {

	public static function input($message, $default = NULL)
	{
		$message = (is_string($default))
			? ($message.' ['.$default.']: ')
			: ($message.': ');
		self::output($message, FALSE);
		$value = trim(fgets(STDIN));

		return ($default !== NULL AND empty($value))
			? $default
			: $value;
	}

	public static function output($messages, $eol = TRUE)
	{
		if (is_array($messages))
		{
			foreach ($messages as $message)
			{
				self::output($message);
			}
		}
		else
		{
			fwrite(STDOUT, $messages);
		}

		if ($eol)
		{
			fwrite(STDOUT, PHP_EOL);
		}
	}

	public static function error($messages, $eol = TRUE)
	{
		if (is_array($messages))
		{
			foreach ($messages as $message)
			{
				self::error($message);
			}
		}
		else
		{
			fwrite(STDERR, $messages);
		}

		if ($eol)
		{
			fwrite(STDERR, PHP_EOL);
		}
	}
}
