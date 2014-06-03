const SAFE_ZONE_WIDTH = 768;
const SAFE_ZONE_HEIGHT = 1280;

var game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var player;
var bg;


$(document).hasResized(function () {
    resizeGame();
});


function preload() {
    game.load.image('bg', 'assets/img/bg.png');
    game.load.image('player', 'assets/img/player.png');
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
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.stage.forcePortrait = true;
    window.resizeGame();

    // Adding a background image

    bg = game.add.image(0, 0, 'bg');
    player = game.add.sprite(game.world.centerX, game.world.height - 100, 'player');
    player.anchor.set(0.5);

    this.isPressed = false;
    bg.inputEnabled = true;
    bg.events.onInputDown.add(function () {
        this.isPressed = true;
    }, this);
    bg.events.onInputUp.add(function () {
        this.isPressed = false;
    }, this);
}

function playerListener() {
    if (this.isPressed) {
        player.x = game.input.x;
        player.y = game.input.y;
    }
}

function update() {
    playerListener();
}