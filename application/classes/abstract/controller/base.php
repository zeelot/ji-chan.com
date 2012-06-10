<?php defined('SYSPATH') or die('No direct script access.');

abstract class Abstract_Controller_Base extends Controller {

	/**
	 * This view is rendered into the Response body in `after()`
	 * @var object the content View object
	 */
	protected $_view;

	/**
	 * Values sent to _view in `after()` method.
	 * This defaults to the `$_POST` array but can be replaced in specific actions.
	 * @var array
	 */
	protected $_values = array();

	/**
	 * Filters sent to _view in `after()` method.
	 * This defaults to the `$_GET` array but can be replaced in specific actions.
	 * `$_GET` is usually for filtering results with pagination or search values.
	 *
	 * @var array
	 */
	protected $_filters = array();

	public function before()
	{
		try
		{
			$this->_view = $this->_response_view();
		}
		catch (Kohana_Exception_ViewNotFound $x)
		{
			/*
			 * The View class could not be found, so the controller action is
			 * repsonsible for making sure this is resolved.
			 */
			$this->_view = NULL;
		}
	}

	/**
	 * Assigns the title to the template.
	 *
	 * @param   string   request method
	 * @return  void
	 */
	public function after()
	{
		if ($this->_view)
		{
			$this->_view
				// Passed in so we can determine the URL for forms and links
				->set('_request', $this->request)
				// For populating forms
				->set('_values', $this->_values)
				// For filtering results
				->set('_filters', $this->_filters);

			$this->response->body($this->_view->render());
		}
		elseif ( ! strlen($this->response->body()))
		{
			// This request has no response
			throw new Kohana_Exception('There was no View created for this request.');
		}
	}

	/**
	 * Returns the view that should be used for this request.
	 * @return object
	 * @throws  Kohana_Exception_ViewNotFound If The view does not exist
	 */
	protected function _response_view()
	{
		/**
		 * We can determine the view for each request based on the route
		 * directory/controller/action
		 */
		$directory = $this->request->directory();
		$controller = $this->request->controller();
		$action = $this->request->action();

		// Removes leading slash if this is not a subdirectory controller
		$controller_path = trim($directory.'/'.$controller.'/'.$action, '/');

		return Kostache::factory('page/'.$controller_path)
				->assets(new Assets);
	}

	/**
	 * Returns true if the post has a valid CSRF
	 *
	 * @return  bool
	 */
	public function valid_post()
	{
		if ($this->request->method() !== HTTP_Request::POST)
			return FALSE;

		if (Request::post_max_size_exceeded())
		{
			return FALSE;
		}

		$csrf = $this->request->post('csrf-token');
		return ( ! empty($csrf) AND CSRF::valid($csrf));
	}
}