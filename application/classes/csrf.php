<?php defined('SYSPATH') or die('No direct script access.');

class CSRF {

	/**
	 * Returns the token in the session or generates a new one
	 *
	 * @return  string
	 */
	public static function token()
	{
		$token = Cookie::get('csrf-token');

		// Generate a new token if no token is found
		if ( ! $token)
		{
			$token = Text::random('alnum', rand(20, 30));
			Cookie::set('csrf-token', $token);
		}

		return $token;
	}

	/**
	 * Validation rule for checking a valid token
	 *
	 * @param   string  $token - the token string to check for
	 * @return  bool
	 */
	public static function valid($token)
	{
		return $token === self::token();
	}
}