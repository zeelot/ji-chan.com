<?php defined('SYSPATH') or die('No direct script access.');

return array(
	/**
	 * Use symlinks when possible (used when compiling files)
	 * Disable this if your filesystem has issues with the `ln` command
	 */
	'symlinks' => FALSE,
	'compilers' => array(
		'js' => array(
			// Regular expression the path must match
			'pattern' => '/^(media\/js\/lib\/).*\.js$/',
			'class'     => 'Media_Compiler_JS',
			'options'   => array(
				// Options for concatenating JS files
				'concat' => array(
					// Group name
					'main' => array(
						// Files get sorted by this before being merged
						'order' => 1,
						// Files belong to this group if the filepath matches the pattern
						'pattern' => '/^(media\/js\/lib\/).*\.js$/',
					),
				),
				// Where to save the concatenated JS
				'save_paths' => array(
					// Version best used in production (FALSE will disable)
					'minified'   => APPPATH.'media/js/compiled/app.min.js',
					// Unminified version for development
					'unminified' => APPPATH.'media/js/compiled/app.js',
				),
			),
		),
		'scss' => array(
			// Regular expression the path must match
			'pattern' => '/^(media\/css\/scss\/).*\.scss$/',
			'class'     => 'Media_Compiler_SCSS',
			'options'   => array(
				// Compass project settings (relative from tmp_dir)
				'css_dir'         => 'media/css/compiled',
				'sass_dir'        => 'media/css/scss',
				'output_style'    => ':compressed',
				'images_dir'      => 'media/images/',
				'relative_assets' => TRUE,
				// Where we create the temporary compass project
				'tmp_dir'         => APPPATH.'cache/compass',
				// We append css_dir to this path before saving compiled css files
				'save_dir'        => rtrim(APPPATH, '/'),
			),
		),
		'couchapp' => FALSE,
	),
);