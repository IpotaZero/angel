const vec = class {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.length = Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    add(v) { return new vec(this.x + v.x, this.y + v.y); }

    sub(v) { return new vec(this.x - v.x, this.y - v.y); }

    multi(m) { return new vec(this.x * m, this.y * m); }
}