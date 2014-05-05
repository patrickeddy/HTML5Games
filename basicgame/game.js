$(document).ready(function () {

    window.addEventListener('keydown', function (e) {
        keydown[e.keyCode] = true;
    }, true);
    //    window.addEventListener('mousemove', mouseMoveListener, false);
    window.addEventListener('click', mouseClickListener, false);


    // INIT VARS
    var canvas_WIDTH = 640;
    var canvas_HEIGHT = 480;

    var textX = 0;
    var textY = 0;

    // Game objects
    var player = new Player("#00A", 32, 32);
    player.x = canvas_WIDTH / 2;
    player.y = canvas_HEIGHT / 2;

    var textObject = new TextObject();
    textObject.text = "You";
    var fireballs = [];

    // Setting up canvas
    var canvas = $("#layer1").get(0).getContext("2d");
    var layer2 = $("#layer2").get(0).getContext("2d");

    // Some FPS stuff
    var FPS = 30;
    setInterval(function () {
        update();
        draw();
    }, 1000 / FPS);


    // Update and draw methods!
    function update() {
        textObject.x = player.x + 5;

        if (player.y >= 35) {
            textObject.y = player.y - 10;
        } else {
            textObject.y = player.height + 35;
        }

        // Check for fireballs and update them if they exist
        for (var x in fireballs) {
            if (fireballs[x] !== null) {
                if (fireballs[x].offscreen) {
                    fireballs[x] = null;
                } else {
                    fireballs[x].update();
                }
            }
        }
        // Check for key events ALWAYS
        keyDownListener();
    }

    function draw() {
        canvas.clearRect(0, 0, canvas_WIDTH, canvas_HEIGHT);

        // Background
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, canvas_WIDTH, canvas_HEIGHT);

        player.draw(canvas);
        textObject.draw(canvas);

        for (var x in fireballs) {
            if (fireballs[x] != null) {
                fireballs[x].draw();
            }
        }
    }

    function keyDownListener() {

        if (keydown["32"]) {
            var newBall = new Fireball(player.x, player.y, canvas_WIDTH, canvas_HEIGHT, layer2);
            fireballs.push(newBall);
        }

        if (keydown["39"]) {
            player.moveRight();
        }

        if (keydown["37"]) {
            player.moveLeft();
        }

        if (keydown["38"]) {
            player.moveUp();
        }

        if (keydown["40"]) {
            player.moveDown();
        }

        player.checkBounds(canvas_WIDTH, canvas_HEIGHT);
    }

    function mouseMoveListener(e) {
        var mouse_x = e.pageX;
        var mouse_y = e.pageY;
    }

    function mouseClickListener(e) {
        var mouse_x = e.pageX - 20;
        var mouse_y = e.pageY - 20;

        var text = new TextObject();
        text.text = "eggs";
        text.x = mouse_x;
        text.y = mouse_y;
        text.draw(layer2);
    }
});