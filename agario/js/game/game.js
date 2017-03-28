function Game() {
    var data = new Data();
    var server = new Server({
        $getBalls:   function () { return data.getBalls(); },
        $getFood:    function () { return data.getFood(); },
        $getPlayer:  function () { return data.getPlayer(); },
        $newBall:    function (name, x, y, mass, color) { data.newBall(name, x, y, mass, color ); },
        $newFood:    function (x, y, mass) { data.newFood(x, y, mass); },
        $deleteBall: function (ball) { data.deleteBall(ball); }
    });
    //var ai = new AI({ data: data });
    function interim() {
        var ekran = data.getEkran();
        var coord = { 
                    x1: ekran.left < 0 ? 0 : ekran.left, 
                    y1: ekran.top  < 0 ? 0 : ekran.top,
                    x2: ekran.left + ekran.width  > data.getField().width  ? data.getField().width  : ekran.left + ekran.width,
                    y2: ekran.top  + ekran.height > data.getField().height ? data.getField().height : ekran.top  + ekran.height
                    };
        return coord;
    }
    var graph = new Graph({
        data: data,
        $renderCallback: function () {
            data.refresh();
            //ai.moveBalls();
			
        }
    });
    var input = new Input({
        $getPlayer:     function () { return data.getPlayer(); },
        $getEkran:      function () { return data.getEkran(); },
        $getCanvas:     function () { return graph.getCanvas(); }
    });

    function init() {
        data.generateFood(3000, 0.2);
		server.startGame();
		server.getField();
		
    }

    init();
}