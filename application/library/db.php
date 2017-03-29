<?php

	$field = Array('width' => 400, 'height' => 400);

	class DataBase {
	
		protected $host = 'localhost';
		protected $user = 'root';
		protected $pass = '';
		protected $dbname = 'agario';

		private $link;
		private $db;
		
		function __construct() {
			$this->link = mysql_connect($this->host, $this->user, $this->pass);
			if (!$this->link) {
				die('Error connect: ' . mysql_error());
			}
			$this->db = mysql_select_db($this->dbname, $this->link);
		}
		
		/* Private Methods */
		private function disconnect() {
			mysql_close($this->link);
		}
		
		private function getUser($nick, $password) {
			$user = null;
			$result = mysql_query('SELECT * FROM users WHERE nick="' .$nick .'" AND password="' .$password .'"');
			while ($row = mysql_fetch_object($result)) {
				$user = $row;
				break;
			}
			return $user;
		}
		
		private function addUser($nick, $password) {
			mysql_query('INSERT INTO users(nick, password) VALUES ("' .$nick .'", "' .$password .'")');
		}
		
		private function isNickUnique($nick) {
			$result = mysql_query('SELECT * FROM users WHERE nick="' .$nick .'"');
			while ($row = mysql_fetch_object($result)) {
				return false;
			}
			return true;
		}
		
		private function delBalls($id_user) {
			mysql_query('DELETE FROM balls WHERE id_user=' . $id_user);
		}
		
		private function insertBall($id_user) {
			$color = 'rgb(198, 38, 62)';
			$mass = 2;
			$x = rand(1, $field['width']);
			$y = rand(1, $field['height']);
			mysql_query('INSERT INTO balls(id_user, color, mass, x, y) VALUES (' .$id_user .', "' .$color .'", ' .$mass .', ' .$x .', ' .$y .')');
			$result = mysql_query('SELECT * FROM balls WHERE id_user=' . $id_user);
			while ($row = mysql_fetch_object($result)) {
				return $row;
			}
			return false;
		}
		
		private function getBalls() {
			$balls = Array();
			$result = mysql_query('SELECT b.id, u.nick, b.color, b.mass, b.x, b.y FROM balls AS b JOIN users AS u ON b.id_user = u.id');
			while ($row = mysql_fetch_object($result)) {
				$balls[] = $row;
			}
			return $balls;
		}
		
		private function getFood() {
			$food = Array();
			$result = mysql_query('SELECT * FROM food');
			while ($row = mysql_fetch_object($result)) {
				$food[] = $row;
			}
			return $food;
		}
		
		/* Public Methods */
		function registLoginUser($nick, $password) {
			$user = $this->getUser($nick, $password);
			if (!$user) {
				if ($this->isNickUnique($nick)) {
					$this->addUser($nick, $password);
					$user = $this->getUser($nick, $password);
				} else {
					return false;
				}
			}
			$this->disconnect();
			return $user;
		}
		
		function addBall($id_user) {
			$this->delBalls($id_user);
			$ball = $this->insertBall($id_user);
			$this->disconnect();
			return $ball;
		}
		
		function getField() {
			$balls = $this->getBalls();
			$food = $this->getFood();
			$this->disconnect();
			return Array(
				'balls' => $balls, 
				'food' => $food
			);
		}
		
		function finishGame($id_user) {
			return $this->delBalls($id_user);
		}
		
		/*function insertScore($nick, $mass) {
			$result = mysql_query('INSERT INTO score(nick, mass) VALUES ("' .$nick .'", ' .$mass .')');
			return $result;
		}
		
		function getScore() {
			$balls = Array();
			$result = mysql_query('SELECT u.nick, s.mass FROM users AS u, score AS s WHERE u.id = s.id_user ORDER BY s.mass DESC LIMIT 10');
			while ($row = mysql_fetch_object($result)) {
				$balls[] = $row;
			}
			return $balls;
		}*/

	}