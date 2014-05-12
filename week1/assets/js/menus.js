function StartScreen(GAME_WIDTH, GAME_HEIGHT) {
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;

    this.playButton = new Button("Play!", this.width, this.height);

    this.draw = function (canvas) {
        canvas.fillRect(0, 0, this.width, this.height);

        canvas.textAlign = "center";
        canvas.fillStyle = "#FFF";
        canvas.font = "normal 35pt arial";
        canvas.fillText("Kitty Clicker", this.width / 2 - 30, this.height / 2 - 50);

        this.playButton.x = (this.width / 2) - (this.playButton.width / 2);
        this.playButton.y = this.height / 2;
        this.playButton.draw(canvas);
    };
}

function PauseMenu(GAME_WIDTH, GAME_HEIGHT) {

    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;

    this.rButton = new Button("Resume", 0, 0);


    this.draw = function (canvas) {
        this.rButton.x = (this.width * 0.40) - (this.rButton.width / 4);
        this.rButton.y = this.height / 2;

        canvas.clearRect(0, 0, this.width, this.height);
        canvas.fillStyle = "#FF000000";
        canvas.fillRect(0, 0, this.width, this.height);
        canvas.font = "normal 30pt arial";
        canvas.fillStyle = "#FFF";
        canvas.fillText("Paused.", this.width * 0.40, this.height / 3);
        this.rButton.draw(canvas);
    };
}

function GameOver(scorebar, GAME_WIDTH, GAME_HEIGHT) {

    this.paButton = new Button("Play again?");

    var offset = 140;


    this.draw = function (canvas) {
        canvas.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        canvas.font = "bold 35pt Calibri";
        canvas.fillStyle = "#F00";
        canvas.fillText("Game Over!", GAME_WIDTH / 2 - (offset), GAME_HEIGHT / 4);
        canvas.fillStyle = "#000";
        canvas.fillText("Your score: " + scorebar.score, GAME_WIDTH / 2 - (offset), (GAME_HEIGHT * 10) / 25);


        // Play again button
        this.paButton.x = GAME_WIDTH / 2 - offset;
        this.paButton.y = GAME_HEIGHT / 2;
        this.paButton.draw(canvas);
    };
}