function Server(options) {
    var options	= (options instanceof Object) ? options : {};
	var a_data = options.data;

	this.startGame = function ( func ) {
		var func = (func instanceof Object) ? func : {};
		var $inputGetPlayer = func.$inputGetPlayer;
		$.get({
			url: "./api/",
			dataType: "json",
			data: { 
				method: "startGame"
			},
			success: function (data, textStatus) {
				if (data && data.result == "ok" && data.data) {
					var obj = data.data;
					a_data.newPlayer(obj.nick, parseInt(obj.x), parseInt(obj.y), parseInt(obj.mass), obj.color);
					$inputGetPlayer();
				}
			}
		});
	}
	
	this.moveBall = function () {
		var player = a_data.getPlayer();
		if (player)
		$.get({
			url: "./api/",
			dataType: "json",
			data: { 
				method: "moveBall",
				vx: player.getDXDY().vx,
				vy: player.getDXDY().vy
			},
			success: function (data, textStatus) {
				//console.log(data);
			}
		});
	}
	
	this.getField = function(/*x1, y1, x2, y2*/) {
		$.get({
			url: "./api/",
			dataType: "json",
			data: { 
				method: "getField"/*,
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2*/
			},
			success: function (data, textStatus) {
				if (data && data.result == "ok" && data.data) {
					//balls
					var balls = a_data.getBalls();
					//Отчищение массива от всех шариков
					balls.splice(0, balls.length);
					var obj = data.data.balls;
					var player = a_data.getPlayer();
					for (var i = 0; i < obj.length; i++) {
						if (player && obj[i].nick == a_data.getPlayer().name) {
							for (key in obj[i])
								player[key] = obj[i][key];
						} else
							a_data.newBall(obj[i].nick, parseInt(obj[i].x), parseInt(obj[i].y), parseFloat(obj[i].mass), obj[i].color);
					}
					
					//food
					/*
					var food = a_data.getBalls();
					food.splice(0, food.length);
					var obj = data.data.food;
					for (var i = 0; i < obj.length; i++) {
						a_data.newFood(parseInt(obj[i].x), parseInt(obj[i].y), parseFloat(obj[i].mass));
					}*/
				}
			}
		});
	};
	
	this.getScore = function () {
		$.get({
			url: "./api/",
			dataType: "json",
			data: { 
				method: "getScore"
			},
			success: function (data, textStatus) {
				console.log(data);
			}
		});
	}

}