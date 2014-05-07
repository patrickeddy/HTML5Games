$(document).ready(function () {

    // ----- ALL DEEZ VARIABLES ----- 
    var GAME_WIDTH = window.outerWidth;
    var GAME_HEIGHT = window.outerHeight;

    // Misc document manipulation that needs it's own file
    manipulation();

    var running = true;
    var bgColor = "#00A"

    var scorebar = new Scorebar(GAME_WIDTH);

    // Adjusting the offset and making the window less high
    GAME_HEIGHT = window.innerHeight - scorebar.height;

    var paButton = new Button("Play again?");

    var kittens = [];
    for (var count = 1; count <= 3; count++) {
        if (GAME_WIDTH < 768) {
            kittens.push(new Kitty());
        } else if (GAME_WIDTH > 768) {
            var kitty = new Kitty();
            kitty.makeBig();
            kittens.push(kitty);
        }
    }


    // --------- Canvas ---------
    var canvas = $("#layer1").get(0).getContext("2d");
    var layer2 = $("#layer2").get(0).getContext("2d");

    function checkScaleFactor() {
        if (scaleFactor > 1) {
            canvas.canvas.width = canvas.canvas.width * scaleFactor;
            canvas.canvas.height = canvas.canvas.height * scaleFactor;
            layer2.canvas.width = layer2.canvas.width * scaleFactor;
            layer2.canvas.height = layer2.canvas.height * scaleFactor;
            scorebar.canvas.width = scorebar.canvas.width * scaleFactor;

            canvas.getContext("2d");
            layer2.getContext("2d");
            scorebar.getContext("2d");
        }
    }

    function backingScale(context) {

        if ('devicePixelRatio' in window) {

            if (window.devicePixelRatio > 1) {

                return window.devicePixelRatio;

            }

        }

        return 1;

    }

    // Call these methods intially
    var scaleFactor = backingScale(canvas);
    checkScaleFactor();



    // ------ Event Listeners -------
    $(document).on('mousedown', 'body', function (e) {

        var x = e.clientX;
        var y = e.clientY;

        for (var kitty in kittens) {

            // If the kitten has not been hit, check the bounds and then add one if inside
            if (!kittens[kitty].hit) {
                kittens[kitty].checkBounds(x, y);
                // If this kitty has been hit after check bounds, add one to the score
                if (kittens[kitty].hit) {
                    scorebar.addOne();
                }
            }
        }

        // If the play again button is clicked, reload the page
        if (!paButton.isClicked) {
            paButton.checkBounds(x, y);
            if (paButton.isClicked) {
                location.reload();
            }
        }

    });


    // ~~~~~~~ ALL DEM GAME METHODS DOWN HERR ~~~~~~~

    // Main Game Loop
    var FPS = 30;
    var mainloop = setInterval(function () {
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

        // Make sure the scale factor is up to date with dim
        scaleFactor = backingScale(canvas);
        checkScaleFactor();

        canvas.canvas.width = GAME_WIDTH;
        canvas.canvas.height = GAME_HEIGHT;
        layer2.canvas.width = GAME_WIDTH;
        layer2.canvas.height = scorebar.height;
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
            gameOver();
        }
    }

    // ------- END MAIN LOOP -------

    // KITTY UPDATE VARIABLES
    var callCount = 0;

    // INITIAL KITTY INTERVAL
    var kitty_interval = setInterval(function () {
        kittyBehavior();
    }, 10000 / 2);

    // Number of kittys on screen 
    var num_on_screen = 3;

    // The Kitty's main behavior
    function kittyBehavior() {

        for (var kitty = 0; kitty < num_on_screen; kitty++) {
            var current_kitty = kittens[kitty];

            // Checking the bounds of each kitty
            var x_pos = (Math.random() * GAME_WIDTH) + 0;
            if (x_pos + current_kitty.WIDTH > GAME_WIDTH) {
                current_kitty.x = GAME_WIDTH - current_kitty.WIDTH;
            } else {
                current_kitty.x = x_pos;
            }

            var y_pos = (Math.random() * GAME_HEIGHT) + scorebar.height;
            if (y_pos + current_kitty.HEIGHT > GAME_HEIGHT) {
                current_kitty.y = GAME_HEIGHT - current_kitty.HEIGHT;
            } else {
                current_kitty.y = y_pos;
            }

            if (callCount > 0) {
                if (!current_kitty.hit) {
                    scorebar.miss();
                }
            }

            // Reset the hit boolean because the kitty is updated
            current_kitty.hit = false;
        }

        // Set difficulty based on callCount
        setDifficulty(callCount);
        // Up the call count
        callCount++;
    }

    // Change difficulty based on the number of calls (time based hardness)
    var threshold = 10;
    var rate = 2;
    var multiplier = 2.1;

    function setDifficulty(callCount) {
        if (callCount >= threshold) {

            threshold *= 2;
            if (multiplier != 1) {
                multiplier -= 0.1;
            }
            rate = rate * multiplier;

            clearInterval(kitty_interval);
            kitty_interval = setInterval(function () {
                kittyBehavior();
            }, 10000 / rate);
        }
    }

    function gameOver() {
        // ---------- GAME OVER SCREEN ----------
        var offset = 140;
        canvas.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        canvas.font = "bold 35pt Calibri";
        canvas.fillStyle = "#F00";
        canvas.fillText("OH NOES", GAME_WIDTH / 2 - (offset), GAME_HEIGHT / 4);
        canvas.fillStyle = "#000";
        canvas.fillText("Your score: " + scorebar.score, GAME_WIDTH / 2 - (offset + 15), GAME_HEIGHT * 10 / 25);


        // Play again button
        paButton.x = GAME_WIDTH / 2 - offset;
        paButton.y = GAME_HEIGHT / 2;
        paButton.draw(canvas);
    }

    // ~~~~~~~ END THE GAME METHODS ~~~~~~~


});