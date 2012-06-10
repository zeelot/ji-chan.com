<?php defined('SYSPATH') or die('No direct script access.');

abstract class Abstract_View_Page extends Abstract_View_Layout {

	public $title = 'Page';

	public function assets($assets)
	{
		$assets->group('default-template');
		return parent::assets($assets);
	}

	public function js_array()
	{
		return array(
			'base_url'    => URL::base(),
			'environment' => Kohana::$environment_string,
			'media_url'   => Media::url('/'),
		);
	}

	public function js_export()
	{
		return json_encode($this->js_array());
	}

	public function i18n()
	{
		return function($string)
		{
			return __($string);
		};
	}

	public function title()
	{
		return __($this->title);
	}

	public function profiler()
	{
		return View::factory('profiler/stats');
	}

	public function assets_head()
	{
		if ( ! $this->_assets)
			return '';

		$assets = '';
		foreach ($this->_assets->get('head') as $asset)
		{
			$assets .= $asset."\n";
		}

		return $assets;
	}

	public function assets_body()
	{
		if ( ! $this->_assets)
			return '';

		$assets = '';
		foreach ($this->_assets->get('body') as $asset)
		{
			$assets .= $asset;
		}

		return $assets;
	}

	public function render($template = null, $view = null, $partials = null)
	{
		$content = parent::render($template, $view, $partials);

		return str_replace(array
		(
			'[[assets_head]]',
			'[[assets_body]]'
		), array
		(
			$this->assets_head(),
			$this->assets_body()
		), $content);
	}
}
