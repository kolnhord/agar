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
		
		private function authMethod($param) {
			session_start();
			$nick = $param['nick'];
			$password = md5($param['pass']);
			if ($nick && $password) {
				$db = new DataBase();
				$user = $db->registLoginUser($nick, $password);
				if ($user && !isset($_SESSION['user_id']) ) $_SESSION['user_id'] = $user->id;
				return true;
			}
			return false;
		}
		
		private function startGameMethod($param) {
			$id = $param['id'];
			if (intval($id)) {
				$db = new DataBase();
				return $db->addBall($id);
			}
			return false;
		}
		
		private function getFieldMethod($param) {
			$db = new DataBase();
			return $db->getField();
		}
		
		private function moveBallMethod($param) {
			$db = new DataBase();
			return $db->update($param['id'], $param['mass'], $param['x'], $param['y']);
		}
		
		private function getScoreMethod($param) {
			$db = new DataBase();
			return $db->getScore();
		}
		
		private function finishGameMethod($param) {
			$id = $param['id'];
			if (intval($id)) {
				$db = new DataBase();
				return $db->finishGame($id);
			}
			return false;
		}
	}