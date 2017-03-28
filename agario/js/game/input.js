function Input(options) {

    var options       = (options instanceof Object) ? options : {};
    var $getPlayer    = options.$getPlayer;
    var $getEkran     = options.$getEkran;
    var $getCanvas    = options.$getCanvas;

    function init() {
        var ekran = $getEkran();
        var canvas = $getCanvas();

        canvas.onmousemove = function (event) {
            var player = $getPlayer();
            var xs = event.offsetX * ekran.width / canvas.width + ekran.left;
            var ys = event.offsetY * ekran.height / canvas.height + ekran.top;
            player.setDirection(xs, ys);
        };

    }

    init();
};