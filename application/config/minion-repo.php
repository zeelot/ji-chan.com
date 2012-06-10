<?php defined('SYSPATH') OR die('No direct script access.');

return array(
	'modules/assets' => array(
		'path'       => MODPATH.'assets',
		'fetch_from' => 'https://github.com/Zeelot/kohana-assets.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-assets.git',
		'checkout'   => 'origin/dev/1.1.x',
	),
	'modules/auth' => array(
		'path'       => MODPATH.'auth',
		'fetch_from' => 'https://github.com/kohana/auth.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-auth.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/database' => array(
		'path'       => MODPATH.'database',
		'fetch_from' => 'https://github.com/kohana/database.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-database.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/git' => array(
		'path'       => MODPATH.'git',
		'fetch_from' => 'https://github.com/Zeelot/kohana-git.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-git.git',
		'checkout'   => 'origin/dev/0.1.x',
	),
	'modules/image' => array(
		'path'       => MODPATH.'image',
		'fetch_from' => 'https://github.com/kohana/image.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-image.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/kostache' => array(
		'path'       => MODPATH.'kostache',
		'fetch_from' => 'https://github.com/zombor/KOstache.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-KOstache.git',
		'checkout'   => 'c274d014ed32d2022bb3818296891b7851e1a42b', // Last 3.2.x compatible commit
	),
	'modules/media' => array(
		'path'       => MODPATH.'media',
		'fetch_from' => 'https://github.com/Zeelot/kohana-media.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-media.git',
		'checkout'   => 'origin/dev/1.2.x',
	),
	'modules/minion' => array(
		'path'       => MODPATH.'minion',
		'fetch_from' => 'https://github.com/kohana/minion.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-minion.git',
		'checkout'   => 'k3.2-v1.0',
	),
	'modules/minion-tasks-repo' => array(
		'path'       => MODPATH.'minion-tasks-repo',
		'fetch_from' => 'https://github.com/Zeelot/minion-tasks-repo.git',
		'push_to'    => 'git@github.com:Zeelot/minion-tasks-repo.git',
		'checkout'   => 'origin/dev/0.6.x',
	),
	'modules/orm' => array(
		'path'       => MODPATH.'orm',
		'fetch_from' => 'https://github.com/kohana/orm.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-orm.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/unittest' => array(
		'path'       => MODPATH.'unittest',
		'fetch_from' => 'https://github.com/kohana/unittest.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-unittest.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/userguide' => array(
		'path'       => MODPATH.'userguide',
		'fetch_from' => 'https://github.com/kohana/userguide.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-userguide.git',
		'checkout'   => 'origin/3.2/master',
	),
	'modules/yform' => array(
		'path'       => MODPATH.'yform',
		'fetch_from' => 'https://github.com/Zeelot/kohana-yform.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-yform.git',
		'checkout'   => 'origin/dev/1.2.x',
	),
	'system' => array(
		'path'       => SYSPATH,
		'fetch_from' => 'https://github.com/kohana/core.git',
		'push_to'    => 'git@github.com:Zeelot/kohana-core.git',
		'checkout'   => 'origin/3.2/master',
	),
);
