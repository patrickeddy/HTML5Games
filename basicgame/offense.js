function Fireball(x, y, width, height, canvas) {
    // Fireball init
    this.ball_x = x + 80;
    this.ball_y = y + 40;
    this.ball_speed = 15;

    this.ball_width = 15;
    this.ball_height = 15;

    this.draw = function () {
        canvas.clearRect(this.ball_x - 45, this.ball_y, this.ball_width, this.ball_height);
        canvas.fillStyle = "#FF0000";
        canvas.fillRect(this.ball_x, this.ball_y, this.ball_width, this.ball_height);
        if (this.offscreen) {
            canvas.clearRect(this.ball_x - 45, this.ball_y, width, 15);
        }

    };

    this.update = function () {
        if (this.ball_x > width) {
            this.offscreen = true;
        }
        this.ball_x += this.ball_speed;
    };

}