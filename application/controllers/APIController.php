<?php

	require_once('library/db.php');

	class API {
		function answer() {
			$method = $_GET['method'];
			if ($method) {
				if (method_exists($this, $method . 'Method')) {
					if ( $_GET['method'] == 'auth' || $this->checkAccess() ) {
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
			session_start();
			if ( isset($_SESSION['hash']) && md5($_SERVER['HTTP_USER_AGENT']) === $_SESSION['hash'] )
				return true;
			else
				return false;
		}
		
		
		private function authMethod($param) {
			session_start();
			$nick = $param['nick'];
			$password = $param['pass'];
			if ($nick && $password) {
				$db = new DataBase();
				$user = $db->registLoginUser($nick, $password, md5($_SERVER['HTTP_USER_AGENT']));
				if ($user && $password === $user->password) {
						if ( isset($_SESSION['user_id']) ) unset($_SESSION['id_user']);
						$_SESSION['user_id'] = $user->id;
						$_SESSION['hash'] = md5($_SERVER['HTTP_USER_AGENT']);
					
					return true;
				}
			}
			return false;
		}
		
		private function startGameMethod($param) {
			$db = new DataBase();
			return $db->addBall($_SESSION['user_id']);
			return false;
		}
		
		private function getFieldMethod($param) {
			$db = new DataBase();
			return $db->getField();
		}
		
		private function moveBallMethod($param) {
			if ( isset($param['vx']) && isset($param['vy']) ) {
				$vx = $param['vx'];
				$vy = $param['vy'];
				//SetDirection vx, vy
				//move player
				//collision
				//eat
			}
			$db = new DataBase();
			return $db->update($_SESSION['user_id'], $param['mass'], $param['x'], $param['y']);
		}
		
		private function getScoreMethod($param) {
			$db = new DataBase();
			return $db->getScore();
		}
		
		private function finishGameMethod($param) {
			$db = new DataBase();
			return $db->finishGame($_SESSION['user_id']);
			return false;
		}
	}