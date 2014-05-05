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

    this.width = 300;
    this.height = 50;

    this.font = "normal 20pt Arial";

    this.draw = function(canvas) {
        canvas.fillStyle = this.bgColor;
        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.fillStyle = this.textColor;
        canvas.fillText(this.text, this.x, this.y + 40);
    }

    this.checkBounds = function(x, y) {
        if (x >= this.x && x < this.x + this.width) {
            if (y >= this.y && y < this.y + this.height) {
                this.isClicked = true;
            }
        }
    }
}