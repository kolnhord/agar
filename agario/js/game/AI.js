function AI(options) {
    var options = (options instanceof Object) ? options : {};
    var data = options.data;
    var food = data.getFood();
    var balls = data.getBalls();

	
    function searchFood(ball) {
    var closestD = Infinity;
	var j = -1;
	var bcoord = ball.getCoord();
        for (var i = 0; i < food.length - 1; i++) {
       	    if (food[i] != null) {
				var d = data.calcD(ball, food[i]);
				if (d < closestD) {
					closestD = d;
					j = i;
				};
	    	};
		};
	return j;
    } //main

    function searchBall(ball, cnt, rast) {
    var closestD = Infinity;
	var j = -1;
	var bcoord = ball.getCoord();
        for (var i = 0; i < balls.length; i++) {
       	    if (balls[i] != null && i != cnt) {
				var d = data.calcD(ball, balls[i]);
				if (d <= rast && d < closestD) {
					closestD = d;
					j = i;
				}; //if
	    	}; //if
		}; //for
	return j;
    } //main

    this.moveBalls = function () {
        for (var i = 1; i < balls.length; i++) {
            if (balls[i]) {
 				var bnum = searchBall(balls[i], i, balls[i].getRadius() + data.inRadius(balls[i].getInt()) );

				if (bnum < 0) {
				//Есть еду: просто бежать до неё
				var fnum = searchFood(balls[i]);
				var fobj = food[fnum];
				var fcoord = fobj.getCoord();

				balls[i].setDirection(fcoord.x, fcoord.y);
				balls[i].move();

				//Если могу, ем
				if (balls[i].isIEatedIt(fobj)) {
					balls[i].eat(fobj.getMass());
	                data.deleteFood(fobj);
	                data.newFood();

				};

				} else {
					var bobj = balls[bnum];
					//if (bnum == 0) console.log(balls[i].name, data.calcD(balls[i], data.getPlayer()), balls[i].getRadius() + data.inRadius(balls[i].getInt()));
					var bcoord = bobj.getCoord();
						if (balls[i].isIEatedIt(bobj)) {
							balls[i].eat(bobj.getMass());
			                data.deleteBall(bobj);
			                if (bnum == 0)
			                	data.newPlayer();
			                else
			                	data.newBall();
						};

					var d = data.calcD(bobj, balls[i]);
					/*if (d <= 1) {
					//Если враг очень близко..

					} else */ if (d <= balls[i].getRadius() + data.maxrad) {
					//Если враг близко..
						//Если я смогу его съесть, иду к нему..
						if (balls[i].canIEatIt(bobj) != Infinity) {
							balls[i].setDirection(bcoord.x, bcoord.y);
							balls[i].move();

						} else {
						//..иначе, отхожу
						function f(x, obj1, obj2) {
							var k = (obj2.getCoord().y - obj1.getCoord().y) / (obj2.getCoord().x - obj1.getCoord().x);
							var b = obj1.getCoord().y - obj1.getCoord().x * k;
							return k * x + b;
						};

						if (bobj.getCoord().x > balls[i].getCoord().x)
							var x = balls[i].getCoord().x - bobj.getCoord().x;
						else
							var x = balls[i].getCoord().x + bobj.getCoord().x;
/*						} else {
						//Если я могу схавать,..
*/
						var y = f(x, bobj, balls[i]);
						balls[i].setDirection(x, y);
						balls[i].move();

						};
						//Если я достаточно близко, то полгащаю его
						if (balls[i].isIEatedIt(bobj)) {
							balls[i].eat(bobj.getMass());
			                data.deleteBall(bobj);
			                if (bnum == 0)
			                	data.newPlayer();
			                else
			                	data.newBall();
						};

					};

				};
				

            }; //if
        }; //for
    }; //main

};