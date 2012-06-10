<?php defined('SYSPATH') or die('No direct script access.');

class Kostache extends Kohana_Kostache
{
	/**
	 * Factory method for Kostache views. Accepts a template path and an
	 * optional array of partial paths.
	 *
	 * @param   string  template path
	 * @param   array   partial paths
	 * @return  Kostache
	 * @throws  Kohana_Exception  if the view class does not exist
	 */
	public static function factory($path, array $partials = NULL)
	{
		$class = 'View_'.str_replace('/', '_', $path);

		if ( ! class_exists($class))
		{
			throw new Kohana_Exception_ViewNotFound('View class does not exist: :class', array(
				':class' => $class,
			));
		}

		return new $class(NULL, $partials);
	}

	/**
	 * Loads the template and partial paths.
	 *
	 * @param   string  template path
	 * @param   array   partial paths
	 * @return  void
	 * @uses    Kostache::template
	 * @uses    Kostache::partial
	 */
	public function __construct($template = NULL, array $partials = NULL)
	{
		parent::__construct($template, $partials);

		$this->_initialize();
	}

	/**
	 * Allows for things to be set up in View classes.
	 * Avoids having to extend the constructor and pass around all those parameters.
	 *
	 * @return  void
	 */
	public function _initialize() {}

	public function app_version()
	{
		return Kohana::APP_VERSION;
	}
}
