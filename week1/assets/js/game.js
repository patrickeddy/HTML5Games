$(document).on('pageinit', function() {

    // ----- ALL DEEZ VARIABLES ----- 
    var GAME_WIDTH = window.innerWidth;
    var GAME_HEIGHT = window.innerHeight;

    var running = true;

    var bgColor = "#00A"

    var scorebar = new Scorebar(GAME_WIDTH);
    var paButton = new Button("Play again?");

    var kittens = [];
    for (var count = 1; count < 10; count++) {
        kittens.push(new Kitty());
    }
    var canvas = $("#layer1").get(0).getContext("2d");
    var layer2 = $("#layer2").get(0).getContext("2d");

    // ------ Event Listeners -------
    $(document).on('vmousedown', 'body', function(e) {
        for (var kitty in kittens) {

            // If the kitten has not been hit, check the bounds and then add one if inside
            if (!kittens[kitty].hit) {
                kittens[kitty].checkBounds(e.clientX, e.clientY);
                if (kittens[kitty].hit) {
                    scorebar.addOne();
                }
            }
        }

        if (!paButton.isClicked) {
            paButton.checkBounds(e.clientX, e.clientY);
            if (paButton.isClicked) {
                location.reload();
            }
        }

    });

    window.addEventListener('resize', null, false);

    // ----- Mobile JQuery shinanegins ------
    $.mobile.orientationChangeEnabled = false;


    // ~~~~~~~ ALL DEM GAME METHODS DOWN HERR ~~~~~~~

    // Main Game Loop
    var FPS = 30;
    setInterval(function() {
        if (running) {

            update();
            draw();

        }
    }, 1000 / FPS);

    // --------- MAIN LOOP --------
    function update() {
        // Changing canvas size based on window size
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = window.innerHeight;
        canvas.canvas.width = GAME_WIDTH;
        canvas.canvas.height = GAME_HEIGHT;
        layer2.canvas.width = GAME_WIDTH;
        layer2.canvas.width = GAME_HEIGHT;
        scorebar.width = GAME_WIDTH;

        // Check for running based on lives
        if (scorebar.lives < 0) {
            running = false;
        }
    }

    function draw() {
        if (running) {

            canvas.fillStyle = bgColor;
            canvas.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            scorebar.draw(layer2);

            for (var kitty in kittens) {
                kittens[kitty].draw(canvas);
            }

        } else {
            // ---------- GAME OVER SCREEN ----------
            canvas.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            canvas.font = "bold 40pt Calibri";
            canvas.fillStyle = "#000";
            canvas.fillText("Your score: " + scorebar.score, GAME_WIDTH * 10 / 45, GAME_HEIGHT * 10 / 25);
            canvas.fillStyle = "#F00";
            canvas.fillText("YOU LOSE", GAME_WIDTH / 4, GAME_HEIGHT / 4);
            paButton.x = GAME_WIDTH / 4;
            paButton.y = GAME_HEIGHT / 2;
            paButton.draw(canvas);
        }
    }

    // ------- END MAIN LOOP -------

    // KITTY UPDATE VARIABLES
    var changeSpeed = 2;
    var callCount = 0;

    // INITIAL KITTY INTERVAL
    setInterval(function() {
        kittyBehavior();
    }, 10000 / changeSpeed);


    // The Kitty's main behavior
    function kittyBehavior() {
        var num_on_screen = 3;

        for (var kitty = 0; kitty < num_on_screen; kitty++) {
            var current_kitty = kittens[kitty];

            // Checking the bounds of each kitty
            var x_pos = (Math.random() * GAME_WIDTH) + 0;
            if (x_pos + current_kitty.WIDTH > GAME_WIDTH) {
                current_kitty.x = GAME_WIDTH - current_kitty.WIDTH;
            } else {
                current_kitty.x = x_pos;
            }

            var y_pos = (Math.random() * GAME_HEIGHT) + 0;
            if (y_pos + current_kitty.HEIGHT > GAME_HEIGHT) {
                current_kitty.y = GAME_HEIGHT - current_kitty.HEIGHT;
            } else {
                current_kitty.y = y_pos;
            }

            if (!current_kitty.hit) {
                scorebar.miss();
            }

            // Set difficulty based on callCount
            setDifficulty(callCount);


            // Reset the hit boolean because the kitty is updated
            current_kitty.hit = false;

            // Up the call count
            ++callCount;
        }
    }

    // Change difficulty based on the number of calls (time based hardness)
    function setDifficulty(callCount) {
        switch (callCount) {

        }
    }

    // ~~~~~~~ END THE GAME METHODS ~~~~~~~


});