function Graph(options) {
    var options = (options instanceof Object) ? options : {};
    var data = options.data;
    var $renderCallback = options.$renderCallback;


    const show_fields = 0;


    var canvas = null;
    var context = null;
    var vcanvas = null;
    var vcontext = null;
    var self = this;


    this.convertCoord = function(coord, flag) {
        var rescoord = {};
		if (flag == 'out') {
			rescoord.x = Math.round((coord.x) * canvas.width / data.getEkran().width);
			rescoord.y = Math.round((coord.y) * canvas.height / data.getEkran().height);
		} else if (flag == 'in') {
			rescoord.x = Math.round( coord.x * data.getEkran().width / data.getField().width + data.getEkran().left );
			rescoord.y = Math.round( coord.y * data.getEkran().height / data.getField().height + data.getEkran().top );
		}
        return rescoord;
    }


    function inBlock(rad) {
       return rad * Math.abs(canvas.width / data.getEkran().width);
    };
    function inRadian(grad) {
        return (Math.PI / 180) * grad;
    };

    function outputList() {
        var arr = [];
        var player = data.getPlayer();
		vcontext.font = '13px Arial';
		vcontext.textAlign = "right";
		vcontext.lineWidth = '1';
		vcontext.fillStyle = 'rgb(254, 127, 74)';
		var k;
    	for (var i = 0; i < arr.length; i++) {
    		k = arr[i].mass * 100;
    		k = Math.round(k);
    		k /= 100;
            vcontext.fillText(arr[i].name + " (" + k +") " + (i + 1), canvas.width - 10, (2 + 16) * (i + 1));
    	}
        if (player != null) {
        vcontext.fillText('...', canvas.width - 10, (2 + 16) * (i + 1));
            k = player.getMass() * 100;
            k = Math.round(k);
            k /= 100;
        vcontext.fillText(player.name + " (" + k +")", canvas.width - 10, (2 + 16) * (arr.length + 2));
        }
    }

    function outputName(obj, x, y) {
    	if (obj instanceof Object) { 
			vcontext.font = '16px Arial';
			vcontext.textAlign = "center";
			vcontext.lineWidth = '2';
			vcontext.strokeStyle = 'rgb(47, 18, 46)';
			vcontext.fillStyle = '#ab274f';
			vcontext.strokeText(obj.name, x, y);
		}
    };

    function drawCircle(x, y, rad, color1, color2) {
        vcontext.beginPath();
        vcontext.fillStyle = color1;
        vcontext.arc(x, y, inBlock(rad), 0, 2 * Math.PI, false);
        vcontext.fill();
        vcontext.lineWidth = 2;
        vcontext.strokeStyle = color2;
        vcontext.stroke();
    }

    function drawFood(x, y, rad, color1, color2, n, offsetAlpha) {
        vcontext.fillStyle = color1;
        vcontext.fillStroke = color2;
        vcontext.beginPath();
        //console.log(x, y, rad, n, offsetAlpha);

        var alpha = inRadian(360 / n);
        var currAlpha = offsetAlpha;
        var xs;
        var ys;
        vcontext.moveTo(x + inBlock( rad * Math.cos(currAlpha) ), y + inBlock( rad * Math.sin(currAlpha) ));
        for (var i = 0; i < n; i++) {
            currAlpha += alpha;
            xs = x + inBlock(rad * Math.cos( currAlpha ));
            ys = y + inBlock(rad * Math.sin( currAlpha ));
            vcontext.lineTo(xs, ys);
        }
        vcontext.lineTo(x + inBlock( rad * Math.cos(currAlpha) ), y + inBlock( rad * Math.sin(currAlpha) ));
        vcontext.fill();
        vcontext.lineWidth = 1.8;
        vcontext.stroke();
    }

    function drawDachedCircle(x, y, rad, color) {
        var size = 8;

        for (var i = 0; i < 360; i += size + 2) {
            vcontext.beginPath();
            vcontext.lineWidth = 2;
            vcontext.strokeStyle = color;
            vcontext.arc(x, y, inBlock(rad), inRadian(i), inRadian(i + size - 1), false);
            vcontext.stroke();

        };

        //context.closePath();
    }

    function draw(obj, color1, color2, writeNames = 'false', flag = false) {
        if (obj.length) {
            var ekran = data.getEkran();
            for (var i = 0; i < obj.length; i++) {
	        if (obj[i] != null) {
                var coord = obj[i].getCoord();
                var xs = Math.round((coord.x - ekran.left) * canvas.width / ekran.width);
                var ys = Math.round((coord.y - ekran.top) * canvas.height / ekran.height);
                if (flag) {
                    drawCircle(xs, ys, obj[i].getRadius(), color1, color2);
					//console.log(coord, {x: xs, y: ys});
                }
                else {
                    drawFood(xs, ys, obj[i].getRadius(), color1, color2, obj[i].n, obj[i].offsetAlpha);
                }
                if (show_fields && flag) {
                    drawDachedCircle(xs, ys, obj[i].getRadius() + data.inRadius(obj[i].getInt()), 'brown')
                    drawDachedCircle(xs, ys, obj[i].getRadius() + 1, 'blue')
                };
		        if (writeNames) {outputName(obj[i], xs, ys);};
                };

	    };
        };
    };

    function clearField() {
        vcontext.fillStyle = 'rgb(255, 219, 197)';
        vcontext.fillRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
	    // 1. clear field
        clearField();	
        // 2. print food
        draw(data.getFood(), 'rgb(255, 87, 60)', 'rgb(255, 232, 220)', false, false);
        // 3. print balls
        draw(data.getBalls(), 'rgb(126, 0, 50)', 'rgb(255, 232, 220)', true, true);
        // 4. print player ball
        var player = data.getPlayer();
        if (player != null) draw([player], player.color, 'rgb(255, 232, 220)', true, true);
        // 5. print names
        //...
        // print winner's list
        outputList();

	context.drawImage(vcanvas, 0, 0);

    }
    this.render = render;

    this.getCanvas = function () {
        return canvas;
    };

    function init() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'myCanv');
        canvas.setAttribute('width', '800');
        canvas.setAttribute('height', '600');
        context = canvas.getContext('2d');
        document.querySelector('body').appendChild(canvas);
	vcanvas = document.createElement('canvas');
        vcanvas.setAttribute('width', '800');
        vcanvas.setAttribute('height', '600');
	vcontext = vcanvas.getContext('2d');
	

	vcontext.textAlign = "center";
	vcontext.textBaseline = "middle";


    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback){
                  window.setTimeout(callback, 100);
              };
    })();

    (function animloop(){
        $renderCallback();
        render();
        requestAnimFrame(animloop);
    })();
}

    init();
};