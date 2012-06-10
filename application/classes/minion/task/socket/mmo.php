<?php defined('SYSPATH') or die('No direct script access.');

class Minion_Task_Socket_MMO extends Minion_Task {

	protected $_server;

	protected $_placed = 0;

	protected $_board = array(
		array(
			'character' => 0,
			'dropzone'  => 3,
			'placed'    => FALSE,
		),
		array(
			'character' => 2,
			'dropzone'  => 0,
			'placed'    => FALSE,
		),
		array(
			'character' => 1,
			'dropzone'  => 1,
			'placed'    => FALSE,
		),
		array(
			'character' => 3,
			'dropzone'  => 2,
			'placed'    => FALSE,
		),
		array(
			'character' => 4,
			'dropzone'  => 4,
			'placed'    => FALSE,
		),
	);

	public function execute(array $config)
	{
		require_once Kohana::find_file('vendor', 'websockets/WebSocket');

		$this->_server = new PHPWebSocket();
		$this->_server->bind('message', array($this, 'message'));
		$this->_server->bind('open', array($this, 'open'));
		$this->_server->bind('close', array($this, 'close'));
		$this->_server->wsStartServer('192.168.50.167', 8000);
	}

	protected $_clients = array();

	public function open($client_id)
	{
		$this->_clients[$client_id] = $client_id;
		Minion_CLI::write($client_id);
	}

	public function close($client_id, $status)
	{
		unset($this->_clients[$client_id]);
		Minion_CLI::write('disconnected');
	}

	public function message($client_id, $message, $message_length, $binary)
	{
		$data = json_decode($message, TRUE);

		Minion_CLI::write($data['type']);

		switch ($data['type'])
		{
			case 'getBoardInfo':
				$this->_send_board_info($client_id);
				break;
			case 'tileDragStart':
				$this->_broadcast_tile_drag_start($client_id, $data['tileID']);
				break;
			case 'tileDrag':
				$this->_broadcast_tile_drag($client_id, $data['tileID'], $data['tilePosition']);
				break;
			case 'invalidTileDrop':
				$this->_broadcast_invalid_tile_drop($client_id, $data['tileID']);
				break;
			case 'validTileDrop':
				$this->_place_tile($data['tileID']);
				$this->_broadcast_valid_tile_drop($client_id, $data['tileID']);
				if ($this->_placed === 5)
				{
					$this->_reset_board();
				}
				break;
		}
	}

	protected function _place_tile($tile_id)
	{
		$this->_placed++;
		$this->_board[$tile_id]['placed'] = TRUE;
	}

	protected function _reset_board()
	{
		foreach ($this->_board as $id => $array)
		{
			$this->_board[$id] = array(
				'character' => $array['character'],
				'dropzone'  => $array['dropzone'],
				'placed'    => FALSE,
			);
		}

		shuffle($this->_board);
		$this->_placed = 0;

		$this->_broadcast_board_info();
	}

	protected function _send_board_info($client_id)
	{
		$this->_server->wsSend($client_id, json_encode(array(
			'type'  => 'boardInfo',
			'board' => $this->_board,
		)));
	}

	protected function _broadcast_board_info()
	{
		foreach ($this->_clients as $client)
		{
			$this->_send_board_info($client);
		}
	}

	protected function _broadcast_tile_drag_start($client_id, $tile_id)
	{
		$data = json_encode(array(
			'type'   => 'tileDragStart',
			'tileID' => $tile_id,
		));

		foreach ($this->_clients as $id)
		{
			if ($client_id === $id)
				continue;

			$this->_server->wsSend($id, $data);
		}
	}

	protected function _broadcast_tile_drag($client_id, $tile_id, $tile_position)
	{
		$data = json_encode(array(
			'type'         => 'tileDrag',
			'tileID'       => $tile_id,
			'tilePosition' => $tile_position,
		));

		foreach ($this->_clients as $id)
		{
			if ($client_id === $id)
				continue;

			$this->_server->wsSend($id, $data);
		}
	}

	protected function _broadcast_invalid_tile_drop($client_id, $tile_id)
	{
		$data = json_encode(array(
			'type'   => 'invalidTileDrop',
			'tileID' => $tile_id,
		));

		foreach ($this->_clients as $id)
		{
			if ($client_id === $id)
				continue;

			$this->_server->wsSend($id, $data);
		}
	}

	protected function _broadcast_valid_tile_drop($client_id, $tile_id)
	{
		$data = json_encode(array(
			'type'   => 'validTileDrop',
			'tileID' => $tile_id,
		));
		foreach ($this->_clients as $id)
		{
			$this->_server->wsSend($id, $data);
		}
	}
}