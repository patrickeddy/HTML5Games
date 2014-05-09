function Scorebar(width) {
    this.score = 0;
    this.lives = 3;

    this.livesIcon = new Image();
    this.livesIcon.src = "assets/img/paw.gif";

    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = 100;
    this.font = "normal 30pt Calibri";

    this.draw = function (canvas) {
        canvas.fillStyle = "#000";
        canvas.fillRect(this.x, this.y, this.width, this.height);

        canvas.fillStyle = "#FFF";
        canvas.textBaseline = "top";
        canvas.font = "normal 35pt Calibri";
        canvas.fillText("Score: " + this.score, 5, 10);
        canvas.font = "normal 30pt Calibri";
        canvas.fillText("Lives", this.width - 130, 0);

        for (var count = 0; count < this.lives; count++) {
            canvas.drawImage(this.livesIcon, this.width - (32 * count) - 70, 45);
        }

    };

    this.addOne = function () {
        this.score++;
    };
    this.miss = function () {
        this.lives--;
    };
}