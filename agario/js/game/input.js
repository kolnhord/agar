function Input(options) {

    var options = (options instanceof Object) ? options : {};
    var a_data = options.data;
	var a_graph = options.graph;
	
	this.getPlayer = function () {
		player = a_data.getPlayer();
	}
	
    function init() {
        var ekran = a_data.getEkran();
        var canvas = a_graph.getCanvas();

        canvas.onmousemove = function (event) {
            var player = a_data.getPlayer();
			if (player) {
				var xs = event.offsetX * ekran.width / canvas.width + ekran.left - player.getCoord().x;
				var ys = event.offsetY * ekran.height / canvas.height + ekran.top - player.getCoord().y;
				player.setDirection(xs, ys);
			}
        };

    }

    init();
};