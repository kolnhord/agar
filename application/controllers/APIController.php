<?php

	require_once('library/db.php');

	class API {
		function answer() {
			$method = $_GET['method'];
			if ($method) {
				if (method_exists($this, $method . 'Method')) {
					$result = $this->{$method ."Method"}($_GET);
					if ($result) {
						return Array(
							'result' => 'ok',
							'data' => $result
						);
					}
					return Array(
						'result' => 'error', 
						'error' => 'Fail to execute method ' . $method
					);
				}
				return Array(
					'result' => 'error', 
					'error' => 'There is no that method'
				);
			}
			return Array(
				'result' => 'error',
				'error' => 'Please write method name'
			);
		}
		
		function authMethod($param) {
			$nick = $param['nick'];
			$password = $param['pass'];
			if ($nick && $password) {
				$db = new DataBase();
				return $db->registLoginUser($nick, $password);
			}
			return false;
		}
		
		function startGameMethod($param) {
			$id = $param['id'];
			if (intval($id)) {
				$db = new DataBase();
				return $db->addBall($id);
			}
			return false;
		}
		
		function getFieldMethod($param) {
			$db = new DataBase();
			return $db->getField();
		}
		
		function moveBallMethod($param) {
			return false;
		}
		
		function getScoreMethod($param) {
			return false;
		}
		
		function finishGameMethod($param) {
			return false;
		}
	}