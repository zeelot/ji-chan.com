<?php defined('SYSPATH') OR die('No direct access allowed.');
/**
 * Format helper class.
 *
 * $Id: format.php 4070 2009-03-11 20:37:38Z Geert $
 *
 * @package    Core
 * @author     Kohana Team
 * @copyright  (c) 2007-2008 Kohana Team
 * @license    http://kohanaphp.com/license.html
 */
class Format {

	/**
	 * Formats a phone number according to the specified format.
	 *
	 * @param   string  phone number
	 * @param   string  format string
	 * @return  string
	 */
	public static function phone($number, $format = '3-3-4')
	{
		// Get rid of all non-digit characters in number string
		$number_clean = preg_replace('/\D+/', '', (string) $number);

		// Array of digits we need for a valid format
		$format_parts = preg_split('/[^1-9][^0-9]*/', $format, -1, PREG_SPLIT_NO_EMPTY);

		// Number must match digit count of a valid format
		if (strlen($number_clean) !== array_sum($format_parts))
			return $number;

		// Build regex
		$regex = '(\d{'.implode('})(\d{', $format_parts).'})';

		// Build replace string
		for ($i = 1, $c = count($format_parts); $i <= $c; $i++)
		{
			$format = preg_replace('/(?<!\$)[1-9][0-9]*/', '\$'.$i, $format, 1);
		}

		// Hocus pocus!
		return preg_replace('/^'.$regex.'$/', $format, $number_clean);
	}

	/**
	 * Formats a URL to contain a protocol at the beginning.
	 *
	 * @param   string  possibly incomplete URL
	 * @return  string
	 */
	public static function url($str = '')
	{
		// Clear protocol-only strings like "http://"
		if ($str === '' OR substr($str, -3) === '://')
			return '';

		// If no protocol given, prepend "http://" by default
		if (strpos($str, '://') === FALSE)
			return 'http://'.$str;

		// Return the original URL
		return $str;
	}

	/**
	 * Format a date using the format specified in the dates config file.
	 *
	 * @param   string $date        the string to format
	 * @param   string $format      the config path in the dates config where the format is specified
	 * @param   mixed  $default     the default value to return if the date is invalid
	 * @param   bool   $allow_empty whether to allow an empty $date to specify 'now'
	 * @return  mixed
	 */
	public static function date($date = NULL, $format = 'mysql.DATETIME', $default = NULL, $allow_empty = TRUE)
	{
		if ( ! $allow_empty AND ! Validate::not_empty($date))
			return $default;

		$object = date_create($date);

		return ($object instanceof DateTime)
			? $object->format(Kohana::$config->load('dates.'.$format))
			: $default;
	}

	public static function empty_to_null($value)
	{
		return Valid::not_empty($value) ? $value : NULL;
	}

} // End format