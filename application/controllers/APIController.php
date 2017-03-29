<?php

	require_once('library/db.php');

	class API {
		function answer() {
			$method = $_GET['method'];
			if ($method) {
				if (method_exists($this, $method . 'Method')) {
					if ($this->checkAccess()) {
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
						'error' => 'You can not perform this action'
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
		
		//private functions
		
		private function checkAccess() {
			/*
			пользователь логиниться, передавая логин и пароль
			сервер их проверяет
			и если все ок
				записывает в сессию,
				а id сесии передает в куки
			*/
			return true;
		}
		
		
		private function authMethod($param) {
			$nick = $param['nick'];
			$password = $param['pass'];
			if ($nick && $password) {
				$db = new DataBase();
				return $db->registLoginUser($nick, $password);
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