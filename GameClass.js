//矩形のステージ
const Stage = class {
    constructor(_w, _h, imageArr) {
        let a = [];

        //aにw個の0を入れる
        for (let i = 0; i < _w; i++) {
            a.push(0);
        }

        let _stage = []

        //stageにh個のaの中身を入れる
        for (let i = 0; i < _h; i++) {
            _stage.push([...a]);
        }

        this.stage = _stage;
        this.h = _h;
        this.w = _w;
        this.bg = imageArr;
        this.frame = 0;
        this.animeFrame = 24;

    }

    //代入
    assign(x, y, n) {
        if (0 <= x && x <= this.w && 0 <= y && y <= this.h) {
            this.stage[y][x] = n;
        } else {
            console.log("そんな場所はない");
        }
    }

    //矩形範囲に代入
    register(x, y, w, h, n) {
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                this.assign(x + i, y + j, n);
            }
        }
    }

    //描画
    draw() {
        ctx.drawImage(this.bg[Math.floor(this.frame / this.animeFrame * this.bg.length)], 0, 0, width, height);
        this.frame = (this.frame + 1) % this.animeFrame;

        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                let s = this.stage[i][j];

                if (s != 0) {
                    if (config.cd) { Irect(width / this.w * j, height / this.h * i, width / this.w, height / this.h, "rgba(255,0,0,0.1)"); }
                    if (s.name == "Movement") {
                        switch (s.dir) {
                            case "right":
                                ctx.drawImage(Imgs.img_arrow, 0, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                                break;
                            case "left":
                                ctx.drawImage(Imgs.img_arrow, 128, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                                break;
                            case "up":
                                ctx.drawImage(Imgs.img_arrow, 256, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                                break;
                            case "down":
                                ctx.drawImage(Imgs.img_arrow, 384, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                                break;
                        }

                    }
                }

            }
        }
    }
};

const Event = class {
    constructor() {
        this.end = false;
        this.name = "vanilla";
    }

    Start() {

    }

    End() {

    }

    Loop() {

    }
};

//会話イベント
const Conversation = class extends Event {
    constructor(_imgTxtArr) {
        super();
        this.imgTxtArr = _imgTxtArr;
        this.name = "Conversation";
    }

    Start() {
        this.end = false;
        this.num = 0;
        this.imgTxtArr.forEach((e) => { e.reset(); });
    }

    Loop() {
        let s = this.imgTxtArr[this.num];

        //描く
        s.draw();

        if (Push.includes("KeyZ")) {
            s.Z();
            //文章が終わったら次の背景
            if (s.num == s.txtArr.length) {
                this.num++;
                if (this.num == this.imgTxtArr.length) {
                    this.end = true;
                }
            }
        }
    }
};

//移動イベント、fromからgotoへdir方向に
const Movement = class extends Event {
    constructor(_from, _goto, _dir) {
        super();
        this.goto = _goto;
        this.dir = _dir;
        this.name = "Movement";

        //from側のステージにこれ自身を設定
        switch (this.dir) {
            case "right":
                _from.register(3, 1, 1, 2, this);
                break;

            case "left":
                _from.register(0, 1, 1, 2, this);
                break;
            case "up":
                _from.register(1, 0, 2, 1, this);
                break;
            case "down":
                _from.register(1, 3, 2, 1, this);
                break;
        }
    }

    Start() {
        this.end = false;
        this.frame = 0;
    }

    Loop() {
        let moveFrame = config.moveFrame;

        ctx.clearRect(0, 0, width, height);

        let bg0 = NowStage.bg[0];
        let bg1 = this.goto.bg[0];

        switch (this.dir) {
            case "right":
                ctx.drawImage(bg0, -width * this.frame / moveFrame, 0, width, height);
                ctx.drawImage(bg1, width - width * this.frame / moveFrame, 0, width, height);
                break;

            case "left":
                ctx.drawImage(bg0, width * this.frame / moveFrame, 0, width, height);
                ctx.drawImage(bg1, -width + width * this.frame / moveFrame, 0, width, height);
                break;

            case "up":
                ctx.drawImage(bg0, 0, height * this.frame / moveFrame, width, height);
                ctx.drawImage(bg1, 0, -height + height * this.frame / moveFrame, width, height);
                break;
            case "down":
                ctx.drawImage(bg0, 0, -height * this.frame / moveFrame, width, height);
                ctx.drawImage(bg1, 0, height - height * this.frame / moveFrame, width, height);
                break;
        }

        this.frame++;

        if (this.frame > moveFrame) {
            this.end = true;
        }
    }

    End() {
        NowStage = this.goto;
    }
};

const OneShot = class extends Event {
    constructor() {
        super();
        this.name = "OneShot";
    }

    Start() {
        this.end = true;
    }

    End() {

    }
}

//画像と文章のリストの合わせ、不透明度も持つ
const ImgTxt = class {
    constructor(_imgArr, _txtArr) {
        this.imgArr = _imgArr;
        this.txtArr = _txtArr;
        this.reset();
    }

    reset() {
        this.alpha = 0;
        this.num = 0;
        this.frame = 0;
        this.imgFrame = 0;
    }

    Z() {
        //表示しきっていないなら    
        if (this.frame * config.textSpeed < this.txtArr[this.num].length) {
            this.frame = Math.floor(this.txtArr[this.num].length / config.textSpeed);
        } else {
            this.num++;
            this.frame = 0;
        }
    }

    draw() {
        ctx.globalAlpha = this.alpha;

        if (this.imgArr != null) {
            //画像表示
            ctx.drawImage(this.imgArr[Math.floor(this.imgFrame / 24 * this.imgArr.length)], 0, 0, width, height);

            this.imgFrame = (this.imgFrame + 1) % 24;
        }

        if (this.txtArr[this.num] != "") {
            //文字の背景
            Irect(0, Iheight, width, height - Iheight, "rgba(255,255,255,0.9)");
            //文字
            Ifont(24, "black");
            Itext(this.frame * config.textSpeed, 0, Iheight + fontsize, this.txtArr[this.num]);
        }

        this.alpha += 1 / 24;

        this.frame++;
    }
};

const Scene = class {
    constructor() {

    }

    Start() {

    }

    End() {

    }

    Loop() {

    }
};

const SceneManager = class {
    constructor(s) {
        this.NowScene = s;
    }

    MoveTo(s) {
        this.NowScene.End();
        this.NowScene = s;
        this.NowScene.Start();
    }

};