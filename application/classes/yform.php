<?php defined('SYSPATH') or die('No direct script access.');

class YForm extends Yuriko_YForm
{
	public function open($action = NULL, array $attributes = array())
	{
		return parent::open($action, $attributes)
			.$this->csrf('token');
	}

	public function open_multipart($action = NULL, array $attributes = array())
	{
		// Set multi-part form type
		$attributes['enctype'] = 'multipart/form-data';
		
		// Add a $_GET variable to check if an upload exceeds the post_max_size
		$action = ($action ?: Request::instance()->uri).'?uploading=yes';

		return $this->open($action, $attributes);
	}
}
