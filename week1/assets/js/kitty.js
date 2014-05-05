function Kitty() {
    Kitty(0, 0);
}


function Kitty(x, y) {
    Kitty(x, y);
}

function Kitty(x, y) {
    this.x = x;
    this.y = y;
    this.WIDTH = 250;
    this.HEIGHT = 250;
    this.image = new Image();
    this.image.src = "assets/img/cat.jpeg";
    this.hit = false;

    this.draw = function (canvas) {
        if (!this.hit) {
            canvas.drawImage(this.image, this.x, this.y);
        }
    }

    this.checkBounds = function (x, y) {
        if (x >= this.x && x < this.x + this.WIDTH) {
            if (y >= this.y && y < this.y + this.HEIGHT) {
                this.hit = true;
            }
        }
    }

}