<?php defined('SYSPATH') OR die('No direct access allowed.');

return array(
	'default' => array(
		'type'       => 'mysql',
		'connection' => array(
			'hostname'   => 'localhost',
			'username'   => 'root',
			'password'   => 'root',
			'database'   => 'web_app',
			'persistent' => FALSE,
		),
		'table_prefix' => '',
		'charset'      => 'utf8',
		'caching'      => FALSE,
		'profiling'    => TRUE,
	),
);
