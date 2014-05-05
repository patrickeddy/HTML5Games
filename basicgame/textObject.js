function TextObject() {
    this.text = "A TextObject";
    this.color = "#FFF";
    this.font = "normal 25pt Calibri";
    this.x = 0;
    this.y = 0;
    this.draw = function (canvas) {
        canvas.fillStyle = this.color;
        canvas.font = this.font;
        canvas.fillText(this.text, this.x, this.y);

    };
}