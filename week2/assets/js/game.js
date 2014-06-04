const SAFE_ZONE_WIDTH = 768;
const SAFE_ZONE_HEIGHT = 1280;

var game = new Phaser.Game(SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var running = true;

var player;
var coconut;
var bg;
var isPressed = false;


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
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.stage.forcePortrait = true;
    window.resizeGame();

    // Adding a background image
    bg = game.add.image(0, 0, 'bg');

    // Adding the player
    player = game.add.sprite(game.world.centerX, game.world.height - 100, 'player');
    player.anchor.set(0.5);

    coconut = game.add.sprite(game.world.centerX, 50, 'coconut');
    coconut.anchor.set(0.5);

    bg.inputEnabled = true;
    bg.events.onInputDown.add(function () {
        isPressed = true;
    }, this);
    bg.events.onInputUp.add(function () {
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
}

function playerListener() {
    var speed = 50;

    if (isPressed) {

        var input_x = game.input.x;
        var input_y = game.input.y;

        if (player.x != input_x || player.y != input_y) {
            game.physics.arcade.moveToXY(player, input_x, input_y, 500);
            //            if (player.x < input_x - diam && player.y < input_y - diam) {
            //                player.x += speed;
            //                player.y += speed;
            //            }
            //            if (player.x > input_x + diam && player.y > input_y + diam) {
            //                player.x -= speed;
            //                player.y -= speed;
            //            }
            //            if (player.x > input_x + diam && player.y < input_y - diam) {
            //                player.x -= speed;
            //                player.y += speed;
            //            }
            //            if (player.x < input_x - diam && player.y > input_y + diam) {
            //                player.x += speed;
            //                player.y -= speed;
            //            }
        }

        game.physics.arcade.accelerateToObject(coconut, player);
    }
}

function update() {
    if (running) {
        playerListener();
        game.physics.arcade.collide(player, coconut, hitCoconut, null, this);
    }
}

function hitCoconut(body1, body2) {
    running = false;

    var text = "You lose";
    var style = {
        font: "10em Arial",
        fill: "#F00",
        align: "center"
    };

    var t = game.add.text(game.world.centerX - 180, 0, text, style);
    var playAgainButton = game.add.button(game.world.centerX - 125, game.world.centerY + 100, 'playagain', resetGame, this);



}

function render() {
    game.debug.body(coconut);
    game.debug.body(player);
}

function resetGame() {
    location.reload();
}