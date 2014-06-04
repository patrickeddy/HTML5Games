const SAFE_ZONE_WIDTH = 640;
const SAFE_ZONE_HEIGHT = 960;

var game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var running = true;
var isPressed = false;

var player;
var coconut;
var bg;
var score = 0;
var scoreTimer;


$(document).hasResized(function () {
    resizeGame();
});


function preload() {
    game.load.image('bg', 'assets/img/bg.png');
    game.load.image('player', 'assets/img/player.png');
    game.load.image('coconut', 'assets/img/coconut.png');
    game.load.image('playagain', 'assets/img/playagain.png');
}

function resizeGame() {

    game.scale.setExactFit();
    game.scale.refresh();

}

function create() {
    // Some browsers have a useragent margin. Override this.
    $("body").css("margin", "0");


    // Aligning the game correctly for all devices
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.stage.forcePortrait = true;
    window.checkScreenSize();
    window.resizeGame();

    // Adding a background image
    bg = game.add.image(0, 0, 'bg');
    bg.width = game.stage.bounds.width;
    bg.height = game.stage.bounds.height;

    // Adding the player
    player = game.add.sprite(game.world.centerX, game.world.height - 100, 'player');
    player.anchor.set(0.5);

    coconut = game.add.sprite(game.world.centerX, 50, 'coconut');
    coconut.anchor.set(0.5);

    player.inputEnabled = true;
    player.events.onInputDown.add(function () {
        isPressed = true;
    }, this);
    player.events.onInputUp.add(function () {
        isPressed = false;
    }, this);


    // Enabling arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, game.world.width, game.world.height);

    // Player stuff
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.enableBody = true;
    player.body.collideWorldBounds = true;

    // Coconut stuff
    game.physics.enable(coconut, Phaser.Physics.ARCADE);
    coconut.enableBody = true;
    coconut.body.collideWorldBounds = true;
    coconut.body.bounce.setTo(1.1, 1.1);

    var scoreText = "Score: " + score + "s";
    var scoreStyle = {
        font: "5em Arial",
        fill: "#FFF",
        align: "left"
    };
    this.scoreLabel = game.add.text(10, 10, scoreText, scoreStyle);
    scoreTimer = game.time.create(false);
    scoreTimer.loop(1000, function () {
        score++
    }, this);
}

function playerListener() {
    var speed = 50;

    if (isPressed) {

        var input_x = game.input.x;
        var input_y = game.input.y;

        if (player.x != input_x || player.y != input_y) {
            player.x = input_x;
            player.y = input_y;
        }
        if (!scoreTimer.running) {
            scoreTimer.start();
        }
        game.physics.arcade.accelerateToObject(coconut, player, 120);
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

function update() {
    if (running) {
        playerListener();
        checkScreenSize();
        this.scoreLabel.text = "Score: " + score + "s";
        game.physics.arcade.collide(player, coconut, hitCoconut, null, this);
    }
}

function hitCoconut(body1, body2) {
    running = false;

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

    text = "Score: " + score;
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

function render() {
    game.debug.body(coconut);
    game.debug.body(player);
}

function resetGame() {
    location.reload();
}