function Player(color, width, height) {
    this.color = color;
    this.x = 0;
    this.y = 0;

    this.image = new Image();
    this.image.src = "http://placekitten.com/100/100";

    this.playerWidth = 100;
    this.playerHeight = 100;
    this.mSpeed = 15;

    var layer1 = $("#layer1").get(0).getContext("2d");

    this.draw = function (canvas) {
        canvas.fillStyle = this.color;
        //        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.drawImage(this.image, this.x, this.y);
    };
    this.checkBounds = function (canvas_WIDTH, canvas_HEIGHT) {

        // Check for player x_bounds and set
        if (this.x + this.playerWidth >= canvas_WIDTH) {
            this.x = canvas_WIDTH - this.playerWidth;
        } else if (this.x <= 0) {
            this.x = 0;
        }

        // Check for this y_bounds and set
        if (this.y + this.playerHeight >= canvas_HEIGHT) {
            this.y = canvas_HEIGHT - this.playerHeight;
        } else if (this.y <= 0) {
            this.y = 0;
        }
    };

    this.moveLeft = function () {
        this.x -= this.mSpeed;
    };

    this.moveRight = function () {
        this.x += this.mSpeed;
    };

    this.moveDown = function () {
        this.y += this.mSpeed;
    };

    this.moveUp = function () {
        this.y -= this.mSpeed;
    };
}