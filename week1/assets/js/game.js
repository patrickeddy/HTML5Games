$(document).ready(function() {

    // ----- ALL DEEZ VARIABLES ----- 
    var GAME_WIDTH = window.innerWidth;
    var GAME_HEIGHT = window.innerHeight;

    // Misc document manipulation that needs it's own file
    manipulation();

    var running = false;
    var paused = false;
    var bgColor = "#00A"

    var scorebar = new Scorebar(GAME_WIDTH);
    var startScreen;
    var pauseMenu;
    var gameOver;

    var menuLoop;

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
    var canvas = $("#game").get(0).getContext("2d");
    var layer2 = $("#scorebar").get(0).getContext("2d");
    var overlay = $("#overlay").get(0).getContext("2d");


    // ------ Event Listeners -------
    window.addEventListener("click", function(e) {

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
        if (!gameOver.paButton.isClicked) {
            gameOver.paButton.checkBounds(x, y);
            if (gameOver.paButton.isClicked) {
                location.reload();
            }
        }

        if (!pauseMenu.rButton.isClicked) {
            pauseMenu.rButton.checkBounds(x, y);
            if (pauseMenu.rButton.isClicked) {
                resume();
                clearInterval(menuLoop);
                menuLoop = null;
                pauseMenu.rButton.isClicked = false;
            }
        }

        if (!startScreen.playButton.isClicked) {
            startScreen.playButton.checkBounds(x, y);
            if (startScreen.playButton.isClicked) {
                resume();
                clearInterval(menuLoop);
                menuLoop = null;
                startScreen.playButton.isClicked = false;
            }
        }

    }, false);

    $(document).mouseout(function() {
        if (!paused && running) {
            pause();
        }
    });


    // ~~~~~~~ ALL DEM GAME METHODS DOWN HERR ~~~~~~~

    // Main Game Loop
    var FPS = 30;
    var mainloop;
    init();

    // Main init
    function init() {
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = window.innerHeight;
        canvas.canvas.width = GAME_WIDTH;
        canvas.canvas.height = GAME_HEIGHT;

        startScreen = new StartScreen(GAME_WIDTH, GAME_HEIGHT);
        pauseMenu = new PauseMenu(GAME_WIDTH, GAME_HEIGHT);
        gameOver = new GameOver(scorebar, GAME_WIDTH, GAME_HEIGHT);
        menuLoop();

    }

    function menuLoop() {
        if (!running) {
            menuLoop = setInterval(function() {
                updateWindowDim(window.innerWidth, window.innerHeight);
                startScreen.width = window.innerWidth;
                startScreen.height = window.innerHeight;
                startScreen.draw(canvas);
            }, 1000 / 15);
        }
    }

    // The game loop
    function gameLoop() {
        if (running) {

            update();
            draw();

        }
    }

    // Handle the pause
    function pause() {
        running = false;
        clearInterval(mainloop);
        mainloop = null;

        paused = true;
        if (paused) {
            menuLoop = setInterval(function() {
                updateWindowDim(window.innerWidth, window.innerHeight);
                pauseMenu.width = window.innerWidth;
                pauseMenu.height = window.innerHeight;
                pauseMenu.draw(overlay);
            }, 1000 / 15);
        }
    }

    function resume() {
        paused = false;
        running = true;
        mainloop = setInterval(function() {
            gameLoop();
        }, 1000 / FPS);
    }

    // --------- MAIN LOOP --------
    function update() {

        // Changing canvas size based on window size
        if (window.innerWidth < 320 && window.innerHeight < 480) {
            updateWindowDim(320, 480);
        } else if (window.innerWidth < 320) {
            updateWindowDim(320, window.innerHeight);
        } else if (window.innerHeight < 480) {
            updateWindowDim(window.innerWidth, 480);
        } else {
            updateWindowDim(window.innerWidth, window.innerHeight);
        }

        // Always update scorebar to height
        layer2.canvas.height = scorebar.height;

        // Check for running based on lives
        if (scorebar.lives < 0) {
            running = false;
        }
    }

    // Own method to elements dependent on changing size
    function updateWindowDim(width, height) {
        GAME_WIDTH = width;
        GAME_HEIGHT = height;
        canvas.canvas.width = GAME_WIDTH;
        canvas.canvas.height = GAME_HEIGHT;
        layer2.canvas.width = GAME_WIDTH;
        overlay.canvas.width = GAME_WIDTH;
        overlay.canvas.height = GAME_HEIGHT;
        scorebar.width = GAME_WIDTH;
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
            gameOver.draw(canvas);
        }
    }

    // ------- END MAIN LOOP -------

    // KITTY UPDATE VARIABLES
    var callCount = 0;

    // INITIAL KITTY INTERVAL
    var kitty_interval = setInterval(function() {
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

            if (callCount > 0 && running) {
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
    var multiplier = 2.0;

    function setDifficulty(callCount) {
        if (callCount >= threshold) {

            threshold *= 2;
            if (multiplier != 1.0) {
                multiplier -= 0.5;
            }
            rate = rate * multiplier;

            clearInterval(kitty_interval);
            kitty_interval = setInterval(function() {
                kittyBehavior();
            }, 10000 / rate);
        }
    }

    // ~~~~~~~ END THE GAME METHODS ~~~~~~~


});