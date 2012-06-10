<?php defined('SYSPATH') OR die('No direct access allowed.');

return array(
	'default' => array(
		'type'       => 'mysql',
		'connection' => array(
			// @TODO change this to be project-specific
			'hostname'   => 'localhost',
			'username'   => 'user_name',
			'password'   => 'password',
			'database'   => 'db_name',
			'persistent' => FALSE,
		),
		'table_prefix' => '',
		'charset'      => 'utf8',
		'caching'      => TRUE,
		'profiling'    => FALSE,
	),
);
