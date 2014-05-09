function Button() {
    Button("", 0, 0);
}

function Button(text) {
    Button(text, 0, 0);
}

function Button(text, x, y) {
    this.text = text;
    this.isClicked = false;
    this.bgColor = "#00F";
    this.textColor = "#FFF";

    this.x = x;
    this.y = y;

    this.width = 280;
    this.height = 100;

    this.font = "normal 25pt Arial";

    this.draw = function (canvas) {

        this.text_x = this.x + this.width / 3.5;
        this.text_y = this.y + 60;

        canvas.fillStyle = this.bgColor;
        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.fillStyle = this.textColor;
        canvas.font = this.font;
        canvas.fillText(this.text, this.text_x, this.text_y);
    };

    this.checkBounds = function (x, y) {
        if (x >= this.x && x < this.x + this.width) {
            if (y >= this.y && y < this.y + this.height) {
                this.isClicked = true;
            }
        }
    };
}