function Game() {
    var data = new Data();
    var server = new Server({
		data: data
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
			//server.moveBall();
        }
    });
    var input = new Input({
        data: data,
		graph: graph
    });

    function init() {
        data.generateFood(1000, 0.2);
		server.startGame( {$inputGetPlayer: function () {input.getPlayer();} } );
		server.getField();
		server.moveBall();
    }

    init();
}