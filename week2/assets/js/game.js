const SAFE_ZONE_WIDTH = 640;
const SAFE_ZONE_HEIGHT = 960;

var game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

/*
    ============= Variables ==============
*/
// Game boolean variables
var running = false;
var isPressed = false;
// Main game sprites
var player;
var coconut;
var bg;
// For the coconut
var randPosObject;
// Game score
var score = 0;
var scoreTimer;
//Highscore
var highscoresArray = [];
// Loading bar
var loadingLabel;
var loadingBar;
var gameOverScreen;

// All of the games audio in one file
var gameaudio;
// Songs
var titlesong;
var gamesong;
// bool value to see if game is muted
var gameMuted;
// Reference to the muteButton
var muteButtonRef;

//localStorage.clear();

if (localStorage.getItem('highscores') == null) {
    var blankArray = [0];
    localStorage.setItem('highscores', JSON.stringify(blankArray));
} else {
    highscoresArray = JSON.parse(localStorage.getItem('highscores'));
}

function initWindow() {
    // Some browsers have a useragent margin. Override this.
    $("body").css("margin", "0");
    /*
        ============= Scale ==============
    */

    // Aligning the game correctly for all devices
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.stage.forcePortrait = true;
    window.checkScreenSize();
    window.resizeGame();
}

/*
     ============= Preload ==============
*/
function preload() {

    // Make window size all good
    initWindow();

    // Loading Label
    var loadingText = "Loading...";
    var loadingStyle = {
        font: "5em Arial",
        fill: "#FFF",
        align: "left"
    };
    // Adding the scoreLabel to the game
    loadingLabel = game.add.text(game.world.centerX - 100, game.world.centerY - 100, loadingText, loadingStyle);

    var loadingBarG = new Phaser.Graphics(this.game, 0, 0);
    loadingBarG.beginFill(0x0ff000, 0.5);
    loadingBarG.drawRect(0, 0, 250, 10);
    loadingBarG.endFill();
    loadingBar = this.game.add.image(game.world.centerX - 125, game.world.centerY, loadingBarG.generateTexture());
    game.load.setPreloadSprite(loadingBar, 0);

    /*
        Loading all the game assets here in order of priority
        
        ============= Sounds that need to be added quickly ==============
    */
    titlesong = game.load.audio('titlesong', 'assets/sound/titlesong.ogg');
    titlesong = game.add.audio('titlesong');

    gameMuted = localStorage.getItem("mute") === "true";
    // Check the mute status in localStorage
    if (gameMuted) {
        muteButtonRef = 'mutebutton';
    } else if (gameMuted == null || !gameMuted) {
        titlesong.play('', 0, 0.5, true, true);
        muteButtonRef = 'soundonbutton';
    }
    /*
        ====== MISC GAME SOUNDS IN 1 FILE ========
    */

    game.load.audio('gameaudio', 'assets/sound/spritesounds.ogg');
    gameaudio = game.add.audio('gameaudio');
    gameaudio.addMarker('buttonsound', 0, 1);
    gameaudio.addMarker('coconutsound', 2, 1);
    gameaudio.addMarker('gameoversound', 4, 3);

    // Finally the game song
    game.load.audio('gamesong', 'assets/sound/gamesong.ogg');
    gamesong = game.add.audio('gamesong');


    // Images are faster, so they come last
    game.load.image('startbutton', 'assets/img/start.png');
    game.load.image('highscorebutton', 'assets/img/highscore.png');
    game.load.image('highscorebg', 'assets/img/highscorebg.png');
    game.load.image('mutebutton', 'assets/img/mute.png');
    game.load.image('soundonbutton', 'assets/img/soundon.png');
    game.load.image('mainmenubutton', 'assets/img/mainmenu.png');

    game.load.image('bg', 'assets/img/bg.png');
    game.load.image('player', 'assets/img/player.png');
    game.load.image('coconut', 'assets/img/coconut.png');
    game.load.image('playagain', 'assets/img/playagain.png');
}

function create() {
    game.input.maxPointers = 1;

    /*
        ============= Sprites ==============
    */

    // Adding a background image
    bg = game.add.image(0, 0, 'bg');
    bg.width = game.stage.bounds.width;
    bg.height = game.stage.bounds.height;

    /*
        ======= Game Score =======
    */

    // Creating the score text attributes
    var scoreText = score;
    var scoreStyle = {
        font: "15em Arial",
        fill: "#FFF",
        align: "center"
    };
    // Adding the scoreLabel to the game
    this.scoreLabel = game.add.text(game.world.centerX, game.world.centerY - 100, scoreText, scoreStyle);

    // Setting the score timer
    scoreTimer = game.time.create(false);
    scoreTimer.loop(1000, function () {
        score++
    }, this);


    // Adding the player sprite
    player = game.add.sprite(game.world.centerX, game.world.height - 100, 'player');
    // Setting it's anchor to the center
    player.anchor.setTo(0.5);


    // Adding the coconut sprite
    coconut = game.add.sprite(game.world.centerX, 150, 'coconut');
    // Setting it's anchor to the center
    coconut.anchor.setTo(0.5);

    /*
        ============= Input ==============
    */

    //Enabling input on player so that the user can drag to move
    player.inputEnabled = true;

    // Boolean of isPressed is set depending on the state of the onInputDown event
    var touchDisabled = false;
    player.events.onInputDown.add(function () {
        if (!touchDisabled)
            isPressed = true;
    }, this);
    player.events.onInputUp.add(function () {
        if (!touchDisabled)
            isPressed = false;
    }, this);
    player.events.onInputOver.add(function () {
        isPressed = true;
        touchDisabled = true;
    }, this);

    /*

        ============= Physics ==============
        
    */

    // Enabling arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, game.world.width, game.world.height);

    // Player stuff
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.enableBody = true;
    player.body.collideWorldBounds = true;
    player.body.width = 80;
    player.body.height = 80;
    player.body.offsetLeft = 10;
    player.body.offsetRight = 10;

    // Coconut stuff
    game.physics.enable(coconut, Phaser.Physics.ARCADE);
    coconut.enableBody = true;
    coconut.body.collideWorldBounds = true;
    coconut.body.bounce.setTo(2, 2);
    coconut.body.width = 80;
    coconut.body.height = 80;
    coconut.body.offsetLeft = 10;
    coconut.body.offsetRight = 10;
    coconut.body.drag = 0;
    coconut.body.maxAngular = 500;
    coconut.body.angularDrag = 50;

    loadingLabel.visible = false;
    loadingBar.visible = false;
    // Initiate start menu
    startMenu();
}

/*
        ============= Start Menu ==============  
*/

function startMenu() {

    // Create overlay and add to screen
    var startMenuOverlay = new Phaser.Graphics(this.game, 0, 0);
    startMenuOverlay.beginFill(0x000000, 1);
    startMenuOverlay.drawRect(0, 0, game.world.width, game.world.height);
    startMenuOverlay.endFill();

    this.startMenuOverlay = this.game.add.image(-10, -10, startMenuOverlay.generateTexture());

    // End of Overlay

    // Add the lose text
    var text = "Dodge Coconut";
    var style = {
        font: "7em Arial",
        fill: "#FFF",
        align: "center"
    };

    this.title = game.add.text(game.world.centerX - 250, game.world.centerY - 200, text, style);

    /*========== GAME START ============*/


    // Create Start Dodging button that goes over screen
    this.startButton = game.add.button(game.world.centerX - 125, game.world.centerY - 50, 'startbutton', function () {
        $("#ad").css("display", "none");
        // Play sound
        gameaudio.play('buttonsound');
        // Stop title music
        titlesong.stop();
        // Set running to true
        running = true;
        // Set all overlay sprites invisible
        this.startMenuOverlay.visible = false;
        this.startButton.visible = false;
        this.title.visible = false;
        this.highscoreButton.visible = false;
        this.highscores.visible = false;
        this.highscoresbg.visible = false;
        this.mutebutton.visible = false;

        // Accelerate Coconut to arbitrary point so the player can't cheat
        coconutAntiCheat();

        // If the game is not set to muted, play
        if (!gameMuted)
            gamesong.play('', 0, 0.5, true, true);

    }, this);
    startButton.inputEnabled = true;

    this.highscoresbg = game.add.image(game.world.centerX - 128, game.world.centerY + 80, 'highscorebg');
    this.highscoresbg.visible = false;

    highscoresArray.sort(function (a, b) {
        return b - a
    });
    var highscoreText = "";
    for (var current = 0; current < highscoresArray.length; current++) {
        highscoreText += highscoresArray[current] + "\n";
    }
    var style = {
        font: "4em Arial",
        fill: "#FFF",
        align: "center"
    };
    this.highscores = game.add.text(game.world.centerX - 25, game.world.centerY + 150, highscoreText, style);
    this.highscores.visible = false;

    // Create button that goes over screen
    this.highscoreButton = game.add.button(game.world.centerX - 60, game.world.centerY + 85, 'highscorebutton', function () {
        // Play sound
        gameaudio.play('buttonsound');
        if (!this.highscores.visible) {
            this.highscores.visible = true;
            this.highscoresbg.visible = true;
        } else {
            this.highscores.visible = false;
            this.highscoresbg.visible = false;
        }
    }, this);
    this.highscoreButton.inputEnabled = true;
    this.mutebutton = game.add.button(game.world.width - 60, 10, muteButtonRef, function () {
        // Play sound
        titlesong.play('buttonsound');
        toggleGameMute(this.mutebutton);
    }, this);
    this.mutebutton.inputEnabled = true;
}

/*
        ============= Update ==============  
*/
function update() {
    checkScreenSize();
    if (running) {
        playerListener();

        if (score % 10 == 0) {
            coconut.body.angularAcceleration = 0;
        }

        if (coconut.x == coconut.body.width / 2 || coconut.x == game.world.bounds.width - coconut.body.width / 2 || coconut.y == coconut.body.height / 2 || coconut.y == game.world.bounds.height - coconut.body.height / 2) {
            gameaudio.play('coconutsound', 0, 0.3, false, true);

        }
        if (coconut.x == coconut.body.width / 2) {
            coconut.body.angularAcceleration += 200;
        }
        if (coconut.x == game.world.bounds.width - coconut.body.width / 2) {
            coconut.body.angularAcceleration -= 200;
        }

        // Scorelabel proper updating 
        this.scoreLabel.text = score;
        this.scoreLabel.x = game.world.centerX - this.scoreLabel.width / 2;

        // If the player and coconut collide, call hitCoconut
        game.physics.arcade.collide(player, coconut, hitCoconut, null, this);
        game.physics.arcade.overlap(player, coconut, hitCoconut, null, this);
    }
}

/*
        ============= Listeners ==============  
*/

// Is called by update(), but is attentive to the boolean isPressed
function playerListener() {

    // Help text
    var text = "Dodge the coconut!";
    var style = {
        font: "5em Arial",
        fill: "#000",
        align: "center"
    };
    // Help text for game start
    if (this.helpText == null)
        this.helpText = game.add.text(player.x - 220, player.y - 120, text, style);

    // Actually checks if the player is pressed down
    if (isPressed) {
        if (helpText.visible) helpText.visible = false;

        var input_x = game.input.x;
        var input_y = game.input.y;

        if (player.x != input_x || player.y != input_y && player.checkWorldBounds) {
            player.x = input_x;
            player.y = input_y;
        }
        if (!scoreTimer.running) {
            scoreTimer.start();
        } else if (scoreTimer.paused) {
            scoreTimer.resume();
        }
        if (score >= 5) {
            game.physics.arcade.accelerateToObject(coconut, player, 600);
        } else if (score <= 1) {
            game.physics.arcade.accelerateToXY(coconut, randPosObject.x, randPosObject.y, 600);
        }
    }
}

/*
        ============= Collision ==============  
*/
function hitCoconut(body1, body2) {
    running = false;

    gamesong.stop();
    gameaudio.play('gameoversound');

    recordHighscore();
    gameOverScreen = new gameOver();

}

/*
        ============= Record High Score ==============  
*/
function recordHighscore() {

    highscoresArray.sort(function (a, b) {
        return a - b
    });
    if (highscoresArray.length >= 3 && score != 0) {
        highscoresArray.push(score);
        highscoresArray = arrayTrim(highscoresArray, 3);
    } else if (highscoresArray[0] == 0 && score != 0) {
        highscoresArray[0] = score;
    } else if (score != 0) {
        highscoresArray.push(score);
    }
    try {
        localStorage.setItem('highscores', JSON.stringify(highscoresArray));
    } catch (e) {
        alert("Error saving highscore.\n" + e.message);
    }
}
/*
        ============= Game Over Screen ==============  
*/

function gameOver() {

    // Toggle the ad on again
    $("#ad").css("display", "inline-block");

    // Define then add the overlay
    var graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
    graphicOverlay.beginFill(0x000000, 0.7);
    graphicOverlay.drawRect(0, 0, game.world.width, game.world.height);
    graphicOverlay.endFill();

    this.overlay = game.add.image(-10, -10, graphicOverlay.generateTexture());

    var scoreText = "Score: " + score + "s";
    style = {
        font: "5em Arial",
        fill: "#FFF",
        align: "center"
    };

    // Add the final score
    this.finalScore = game.add.text(game.world.centerX - 100, game.world.centerY - 100, scoreText, style);

    // Play again button
    this.playAgainButton = game.add.button(game.world.centerX - 125, game.world.centerY, 'playagain', function () {
        this.highscores.visible = false;
        this.highscoresbg.visible = false;
        this.highscoreButton.visible = false;
        this.mainmenuButton.visible = false;
        resetGame();
    }, this);

    this.highscoresbg = game.add.image(game.world.centerX - 128, game.world.centerY + 105, 'highscorebg');
    this.highscoresbg.visible = false;

    highscoresArray.sort(function (a, b) {
        return b - a
    });
    var highscoreText = "";
    for (var current = 0; current < highscoresArray.length; current++) {
        highscoreText += highscoresArray[current] + "\n";
    }

    // Add the lose text
    var message;
    var style;

    // Adding the message based on whether the user got a new highscore
    if (score == highscoresArray[0]) {
        message = "New highscore!";
        style = {
            font: "8em Arial",
            fill: "#0F0",
            align: "center"
        };


        // Add the text to the screen
        this.t = game.add.text(game.world.centerX - 270, game.world.centerY - 220, message, style);
    } else {
        message = "Oh snap!";
        style = {
            font: "10em Arial",
            fill: "#F00",
            align: "center"
        };


        // Add the text to the screen
        this.t = game.add.text(game.world.centerX - 200, game.world.centerY - 250, message, style);
    }

    var style = {
        font: "4em Arial",
        fill: "#FFF",
        align: "center"
    };
    this.highscores = game.add.text(game.world.centerX - 25, game.world.centerY + 175, highscoreText, style);
    this.highscores.visible = false;

    // Create button that goes over screen
    this.highscoreButton = game.add.button(game.world.centerX - 60, game.world.centerY + 110, 'highscorebutton', function () {
        // Play sound
        gameaudio.play('buttonsound');
        if (!this.highscores.visible) {
            this.highscores.visible = true;
            this.highscoresbg.visible = true;
        } else {
            this.highscores.visible = false;
            this.highscoresbg.visible = false;
        }
    }, this);
    this.highscoreButton.inputEnabled = true;

    // Go back to main menu by refreshing
    this.mainmenuButton = game.add.button(10, 10, 'mainmenubutton', function () {
        location.reload();
    }, this);
    this.mainmenuButton.inputEnabled = true;

}

/*
        ============= Reset ==============  
*/
function resetGame() {
    gameaudio.play('buttonsound');
    score = 0;
    scoreTimer.pause();
    gameOverScreen.overlay.visible = false;
    gameOverScreen.t.visible = false;
    gameOverScreen.finalScore.visible = false;
    gameOverScreen.playAgainButton.visible = false;
    helpText.visible = true;

    player.x = game.world.centerX;
    player.y = game.world.height - player.height;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.acceleration.x = 0;
    player.body.acceleration.y = 0;

    coconut.x = game.world.centerX;
    coconut.y = 150;
    coconut.body.velocity.x = 0;
    coconut.body.velocity.y = 0;
    coconut.body.acceleration.x = 0;
    coconut.body.acceleration.y = 0;
    coconut.body.angularVelocity = 0;
    coconutAntiCheat();

    isPressed = false;

    if (!gameMuted)
        gamesong.play('', 0, 0.5, true, true);
    running = true;
}


function backToStart() {
    location.reload();
}

function coconutAntiCheat() {
    function randomPos() {
        this.x = Math.abs(Math.floor(Math.random() * game.world.width));
        this.y = Math.abs(Math.floor(Math.random() * game.world.height));
    }
    randPosObject = new randomPos();
}

function toggleGameMute(mutebutton) {
    if (!gameMuted) {
        gameMuted = true;
        titlesong.stop();
        mutebutton.loadTexture('mutebutton');
        try {
            localStorage.setItem("mute", "true");
        } catch (e) {
            alert("Couldn't save mute setting.\n" + e.message);
        }
    } else {
        gameMuted = false;
        if (!titlesong.isPlaying)
            titlesong.play();
        mutebutton.loadTexture('soundonbutton');
        try {
            localStorage.setItem("mute", "false");
        } catch (e) {
            alert("Couldn't save mute setting.\n" + e.message);
        }
    }
}

/*
        ============= Window Resize ==============  
*/

function resizeGame() {

    game.scale.setExactFit();
    game.scale.refresh();

}

function checkScreenSize() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;

    if (ww / wh >= 4 / 3) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    } else {
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
}

/*
        ============= Misc Functions ==============  
*/

function arrayTrim(array, trimTo) {
    if (array.length == trimTo)
        return -1;
    array.sort(function (a, b) {
        return b - a;
    });
    var trimmedArray = [];
    for (var current = 0; current < trimTo; current++) {
        trimmedArray.push(array[current]);
    }
    return trimmedArray;
}