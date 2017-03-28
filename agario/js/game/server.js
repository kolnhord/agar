function Server(options) {
    var options 	 = (options instanceof Object) ? options : {};
    var $getBalls 	 = options.$getBalls;
    var $newBall 	 = options.$newBall;
    var $getPlayer   = options.$getPlayer;
    var $deleteBall  = options.$deleteBall;
    var $newFood     = options.$newFood;
    var $getFood	 = options.$getFood;

	this.startGame = function (nick = null, password = '') {
		if (nick == null) nick = 'Anonymus';
		$.get({
			url: "http://localhost/agario/site/api/index.php",
			dataType: "json",
			data: { 
				method: "startGame",
				nick: nick,
				password: password
			},
			success: function (data, textStatus) {
				var player = $getPlayer();
				for (key in data.data) {
					player[key] = data.data[key];
				}
				//console.log(data);
			}
		});
	}
	
	this.getScore = function () {
		$.get({
			url: "http://localhost/agario/site/api/index.php",
			dataType: "json",
			data: { 
				method: "getScore"
			},
			success: function (data, textStatus) {
				console.log(data);
			}
		});
	}
	
	this.moveBall = function () {
		$.get({
			url: "http://localhost/agario/site/api/index.php",
			dataType: "json",
			data: { 
				method: "moveBall",
				mass: $getPlayer().getMass(),
				x: $getPlayer().getCoord().x,
				y: $getPlayer().getCoord().y
			},
			success: function (data, textStatus) {
				console.log(data);
			}
		});
	}
	
	this.getField = function(/*x1, y1, x2, y2*/) {
		$.get({
			url: "http://localhost/agario/site/api/index.php",
			dataType: "json",
			data: { 
				method: "getField"/*,
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2*/
			},
			success: function (data, textStatus) {
				//balls
				var balls = $getBalls();
				balls.splice(0, balls.length);
				for (var i = 0; i < data.data.balls.length; i++) {
					var obj = data.data.balls[i];
					if (obj.nick != $getPlayer().name) {
						$newBall(obj.nick, parseInt(obj.x), parseInt(obj.y), parseFloat(obj.mass), obj.color);
					}
				}
				
				//food
				/*
				var food = $getBalls();
				food.splice(0, food.length);
				for (var i = 0; i < data.data.food.length; i++) {
					var obj = data.data.food[i];
					$newFood(parseInt(obj.x), parseInt(obj.y), parseFloat(obj.mass));
				}*/
			}
		});
	};

}