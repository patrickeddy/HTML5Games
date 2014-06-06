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

var running = false;
var isPressed = false;

var player;
var coconut;
var bg;

var score = 0;
var scoreTimer;

var highscoresArray = [];
var highscoreText = "";

//localStorage.clear();

if (localStorage.getItem('highscores') == null) {
    var blankArray = [0];
    localStorage.setItem('highscores', JSON.stringify(blankArray));
} else {
    highscoresArray = JSON.parse(localStorage.getItem('highscores'));
}


/*
     ============= Preload ==============
*/
function preload() {

    // Loading all the game assets here
    game.load.image('bg', 'assets/img/bg.png');
    game.load.image('player', 'assets/img/player.png');
    game.load.image('coconut', 'assets/img/coconut.png');
    game.load.image('playagain', 'assets/img/playagain.png');
    game.load.image('startbutton', 'assets/img/start.png');
    game.load.image('highscorebutton', 'assets/img/highscore.png');
}

function create() {
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
    player.anchor.set(0.5);

    // Adding the coconut sprite
    coconut = game.add.sprite(game.world.centerX, 50, 'coconut');
    // Setting it's anchor to the center
    coconut.anchor.setTo(0.5);

    /*
        ============= Input ==============
    */

    //Enabling input on player so that the user can drag to move
    player.inputEnabled = true;

    // Boolean of isPressed is set depending on the state of the onInputDown event
    player.events.onInputDown.add(function () {
        isPressed = true;
    }, this);
    player.events.onInputUp.add(function () {
        isPressed = false;
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
    coconut.body.bounce.setTo(1.3, 1.3);
    coconut.body.width = 80;
    coconut.body.height = 80;
    coconut.body.offsetLeft = 10;
    coconut.body.offsetRight = 10;

    // Initiate start menu
    startMenu();
}

/*
        ============= Start Menu ==============  
*/

function startMenu() {

    // Create overlay and add to screen
    var startMenuOverlay = new Phaser.Graphics(this.game, 0, 0);
    startMenuOverlay.beginFill(0x000000, 0.9);
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

    // Create Start Dodging button that goes over screen
    this.startButton = game.add.button(game.world.centerX - 120, game.world.centerY - 50, 'startbutton', function () {
        // Set running to true
        running = true;
        // Set all overlay sprites invisible
        this.startMenuOverlay.visible = false;
        this.startButton.visible = false;
        this.title.visible = false;
        this.highscoreButton.visible = false;

    }, this);
    startButton.inputEnabled = true;

    highscoresArray.sort(function (a, b) {
        return b - a
    });
    for (var current = 0; current < highscoresArray.length; current++) {
        highscoreText += highscoresArray[current] + "\n";
    }
    var style = {
        font: "4em Arial",
        fill: "#FFF",
        align: "center"
    };
    this.highscores = game.add.text(game.world.centerX - 20, game.world.centerY + 150, highscoreText, style);
    this.highscores.visible = false;

    // Create button that goes over screen
    this.highscoreButton = game.add.button(game.world.centerX - 60, game.world.centerY + 80, 'highscorebutton', function () {
        if (!this.highscores.visible) {
            this.highscores.visible = true;
        } else {
            this.highscores.visible = false;
        }
    }, this);
    this.highscoreButton.inputEnabled = true;

}

/*
        ============= Window Resize ==============  
*/

function resizeGame() {

    game.scale.setExactFit();
    game.scale.refresh();

}

$(document).resize(function () {
    resizeGame();
});

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
        }
        game.physics.arcade.accelerateToObject(coconut, player, 180);
    }
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
        ============= Update ==============  
*/
function update() {
    if (running) {
        playerListener();
        checkScreenSize();

        // Scorelabel proper updating 
        this.scoreLabel.text = score;
        this.scoreLabel.x = game.world.centerX - this.scoreLabel.width / 2;

        // If the player and coconut collide, call hitCoconut
        game.physics.arcade.collide(player, coconut, hitCoconut, null, this);
    }
}

/*
        ============= Collision ==============  
*/
function hitCoconut(body1, body2) {
    running = false;

    highscoresArray.sort(function (a, b) {
        return a - b
    });
    if (highscoresArray.length >= 3) {
        var current = 1;
        while (score > highscoresArray[current]) {
            current++;
        }
        highscoresArray[current] = score;
    } else {
        if (highscoresArray[0] == 0) {
            highscoresArray[0] = score;
        } else {
            highscoresArray.push(score);
        }
    }
    localStorage.setItem('highscores', JSON.stringify(highscoresArray));

    // Define then add the overlay
    var graphicOverlay = new Phaser.Graphics(this.game, 0, 0);
    graphicOverlay.beginFill(0x000000, 0.7);
    graphicOverlay.drawRect(0, 0, game.world.width, game.world.height);
    graphicOverlay.endFill();

    this.overlay = this.game.add.image(-10, -10, graphicOverlay.generateTexture());

    // Add the lose text
    var text = "Oh snap!";
    var style = {
        font: "10em Arial",
        fill: "#F00",
        align: "center"
    };

    var t = game.add.text(game.world.centerX - 200, game.world.centerY - 250, text, style);

    text = "Score: " + score + "s";
    style = {
        font: "5em Arial",
        fill: "#FFF",
        align: "center"
    };

    // Add the final score
    game.add.text(game.world.centerX - 100, game.world.centerY - 100, text, style);

    // Play again button
    var playAgainButton = game.add.button(game.world.centerX - 125, game.world.centerY, 'playagain', resetGame, this);

}
/*
        ============= Reset ==============  
*/

function resetGame() {
    location.reload();
}