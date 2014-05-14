function Kitty() {
    Kitty(0, 0);
}

function Kitty(x, y) {
    this.x = x;
    this.y = y;
    this.isSmall = true;

    // Init variables based on device width
    this.WIDTH = 100;
    this.HEIGHT = 100;
    var pic = new Image();

    this.hit = false;

    this.draw = function (canvas) {
        if (!this.hit) {
            canvas.drawImage(pic, this.x, this.y);
        }
    }

    this.checkBounds = function (x, y) {
        if (x >= this.x && x < this.x + this.WIDTH) {
            if (y >= this.y && y < this.y + this.HEIGHT) {
                this.hit = true;
            }
        }
    }
    this.checkSize = function (GAME_WIDTH, GAME_HEIGHT) {
        if (GAME_WIDTH > 768) {
            this.isSmall = false;
        } else {
            this.isSmall = true;
        }

        if (this.isSmall) {
            this.WIDTH = 100;
            this.HEIGHT = 100;
            pic.src = "assets/img/cat-sm.jpeg";
        } else {
            this.WIDTH = 250;
            this.HEIGHT = 250;
            pic.src = "assets/img/cat.jpeg";
        }
    }
}