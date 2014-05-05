function Scorebar(width) {
    this.score = 0;
    this.lives = 3;

    this.livesIcon = new Image();
    this.livesIcon.src = "assets/img/banana.gif";

    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = 40;
    this.font = "normal 25pt Calibri";

    this.draw = function(canvas) {
        canvas.fillStyle = "#000";
        canvas.fillRect(this.x, this.y, this.width, this.height);

        canvas.fillStyle = "#FFF";
        canvas.textBaseline = "top";
        canvas.font = this.font;
        canvas.fillText("Score: " + this.score, this.x, this.y);

        canvas.fillText("Lives:", this.width - 250, 0);

        for (var count = 0; count < this.lives; count++) {
            canvas.drawImage(this.livesIcon, this.width - (32 * count) - 80, 2);
        }

    }

    this.addOne = function() {
        this.score++;
    }
    this.miss = function() {
        this.lives--;
    }
}