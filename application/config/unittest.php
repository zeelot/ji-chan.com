<?php defined('SYSPATH') or die('No direct script access.');

return array(
	'environment'    => Kohana::TESTING,
	'temp_path'      => Kohana::$cache_dir.'/unittest',
	'cc_report_path' => 'report',
	'use_whitelist'  => FALSE,
	'whitelist'      => array(),
	'use_blacklist'  => TRUE,
	'blacklist'      => array(
		MODPATH.'userguide',
	),
	'db_connection' => 'default',
);