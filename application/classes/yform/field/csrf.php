<?php defined('SYSPATH') OR die('No direct access allowed.');

class YForm_Field_Csrf extends YForm_Field_Hidden {

	public function __construct($name = 'default')
	{
		parent::__construct('csrf-token', CSRF::token());
	}

	public function load_settings(YForm $settings)
	{
		// We'll call the parent method, but prevent it from overriding the value we've set
		$value = $this->get_attribute('value');

		parent::load_settings($settings);

		$this->set_attribute('value', $value);
	}

	public function set_value($value)
	{
		// Prevent the value from being overriden
		if ($this->get_attribute('value') === FALSE)
		{
			parent::set_value($value);
		}
	}
}
