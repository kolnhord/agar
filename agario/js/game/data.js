function Data(options) {
    var options = (options instanceof Object) ? options : {};
    var gnicks = new GNicks();

//Исправить аишник, дистансЭкран. Ники, соразмерные с массой шарика.

    var dataself = this;

    dataself.inRadian = function(x) {
        return x * (Math.PI / 180);
    };
    dataself.inAngular = function(x) {
        return x * (180 / Math.PI);
    };
    dataself.calcD = function(obj1, obj2) {
        var coord1 = obj1.getCoord();
        var coord2 = obj2.getCoord();

        return Math.sqrt((coord1.x - coord2.x) * (coord1.x - coord2.x) + (coord1.y - coord2.y) * (coord1.y - coord2.y));
    }

    function Field(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    function Food(x, y, mass) {
        var x = x;
        var y = y;
        var mass = mass;
        this.n;
        this.offsetAlpha;

        this.setValue = function () {
            var alpha = 100;
            this.n = Math.random() * 3 + 5;
            this.n = this.n - this.n % 1;
            this.offsetAlpha = Math.random() * alpha - alpha / 2;
        }
        this.getCoord = function () {
            return { x: x, y: y };
        };
        this.getMass = function () {
            return mass;
        };
        this.getRadius = function () {
            return Math.sqrt(mass / Math.PI);
        };

        this.setValue();
    }

    function Ball(_name, _x, _y, _mass, _color) {

        var self = this;

        var x = _x;
        var y = _y;
        var mass = _mass;
        var vx = 0;
        var vy = 0;
        this.name = _name;
        this.color = _color;

        this.getCoord = function () {
            return { x: x, y: y };
        };
        this.getMass = function () {
            return mass;
        };
        this.getRadius = function () {
            return Math.sqrt(mass / Math.PI);
        };
        this.eat = function (_mass) {
            mass += _mass;
        };

        this.getSpeed = function () {
            return 1 / Math.pow(this.getMass(), 1 / 7) / 1.7;
        };
        this.setDirection = function (xs, ys) {
            vx = xs - x;
            vy = ys - y;
            var d = Math.sqrt(vx * vx + vy * vy);
            if (d > 1) {
                vx = vx / d;
                vy = vy / d;
            }
        };
        this.move = function () {
            x += vx * this.getSpeed();
            if (x + this.getRadius() > field.width) { x = field.width - this.getRadius(); };
            if (x - this.getRadius() <= 0) { x = this.getRadius(); };
            y += vy * this.getSpeed();
            if (y + this.getRadius() > field.height) { y = field.height - this.getRadius(); };
            if (y - this.getRadius() <= 0) { y = this.getRadius(); };
        };

        this.isIEatedIt = function (obj) {
            if (self.getRadius() < obj.getRadius()) return false;
            else {
                var d = dataself.calcD(self, obj);
                return !!(d < self.getRadius());
            }
        };
        this.canIEatIt = function (obj) {
            if (self.getRadius() > obj.getRadius()) {
                return dataself.calcD(self, obj);
            }
            return Infinity;
        };
        this.canItEatMe = function (obj) {
            if (self.getRadius() <= obj.getRadius()) {
                return dataself.calcD(self, obj);
            }
            return Infinity;
        };
    }

    var field = new Field(0, 0, 400, 400);
    var ekran = new Field(0, 0, 30,  30 );
    var food  = [];
    var balls = [];
    
    var player = new Ball(
            gnicks.randomNick(), 
            Math.random() * field.width, 
            Math.random() * field.height, 
            2,
            'rgb(198, 38, 62)'
            );

    this.newFood = function () {
        food.push(
        new Food(
             Math.random() * field.width,
             Math.random() * field.height,
             Math.random() * 0.4 + 0.1)
        );
    };

    this.newFood = function (x, y, mass) {
        food.push(
            new Food(
                 x,
                 y,
                 mass
                 )
        );
    };

    this.deleteFood = function (fobj) {
        var j = food.indexOf(fobj);
        food.splice(j, 1);
    }

    this.deleteBall = function(bobj) {
        var j = balls.indexOf(bobj);
        balls.splice(j, 1);
    }

    this.newBall = function() {
        balls.push(
            new Ball(
                gnicks.randomNick(), 
                Math.random() * field.width, 
                Math.random() * field.height, 
                2,
                'rgb(198, 38, 62)'
                )
        );
    };

    this.newBall = function(name, x, y, mass, color = "") {
        balls.push(
            new Ball(
                name, 
                x, 
                y, 
                mass,
                'rgb(198, 38, 62)'
                )
        );
    };

    this.generateFood = function (_num, maxMass) {
        for (var i = 0; i < _num; i++) {
            food.push(
                new Food(
                    Math.random() * field.width,
                    Math.random() * field.height,
                    Math.random() * maxMass)
            );
            food[food.length - 1].setN;
        }
    };

    this.getField = function () {
        return field;
    };
    this.getEkran = function () {
        return ekran;
    };
    this.getFood = function () {
        return food;
    };
    this.getBalls = function () {
        return balls;
    };
    this.getPlayer = function () {
        return player;
    };

    function moveEkran() {
        var k = 4;
        if (player.getCoord().x >= field.left + ekran.width / 2 - k & player.getCoord().x <= field.left + field.width - ekran.width / 2 + k) {
            ekran.left = player.getCoord().x - ekran.width / 2;
        }
        if (player.getCoord().y >= field.top + ekran.height / 2 - k * 2 & player.getCoord().y <= field.top + field.height - ekran.height / 2 + k * 2) {
            ekran.top = player.getCoord().y - ekran.height / 2;
        }
    }

    function collision() {
		if (player) {
			for (var i = 0; i < food.length; i++) {
				if (food[i] && player.isIEatedIt(food[i])) {
					player.eat(food[i].getMass());
					dataself.deleteFood(food[i]);
					//dataself.newFood();
					break;
				}
			}
			for (var i = 0; i < balls.length; i++) {
				if (balls.length != 0 && balls[i] && player.isIEatedIt(balls[i])) {
					player.eat(balls[i].getMass());
					//console.log(balls[i].name, player);
					dataself.deleteBall(balls[i]);
					//dataself.newBall();
					break;
				}
			}
		}
    };
    function distanseEkran() {
	//console.log(ekran.width / player.getRadius());
	if (ekran.width / player.getRadius() < 8)
	    var ch = 0.088;
    else if (ekran.width / player.getRadius() > 37)
        var ch = -0.088;
    else
        var ch = 0;

    if (ekran.width + ch <= field.width & ekran.width + ch >= 1 & ekran.height + ch <= field.height & ekran.height + ch >= 1) {
        ekran.width += ch;
        ekran.height += ch;
    };

    };

    this.refresh = function (bobj, fobj) {
        if (player != null) {
            this.getPlayer().move();
            collision(bobj, fobj);
            moveEkran();
	        distanseEkran();
        }
    };
}