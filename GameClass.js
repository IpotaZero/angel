//矩形のステージ
const Stage = class {
    constructor(_w, _h, _imageNameArr) {
        let a = [];

        //aにw個の0を入れる
        for (let i = 0; i < _w; i++) {
            a.push(0);
        }

        let _stage = [];

        //stageにh個のaの中身を入れる
        for (let i = 0; i < _h; i++) {
            _stage.push([...a]);
        }

        this.stage = _stage;
        this.h = _h;
        this.w = _w;
        this.animeFrame = 0;
        this.animeNum = 0;

        //画像の名前と表示フレームを交互に詰め込んだ配列
        this.imageNameArr = _imageNameArr;
    }

    //代入
    assign(x, y, n) {
        if (0 <= x && x <= this.w - 1 && 0 <= y && y <= this.h - 1) {
            this.stage[y][x] = n;
        } else {
            //定義域エラー
            console.log("Error:eventAssignment");
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
        //背景の描画
        ctx.drawImage(ImgData[this.imageNameArr[this.animeNum]], 0, 0, width, height);
        this.animeFrame++;
        if (this.imageNameArr[this.animeNum + 1] == this.animeFrame) { this.animeNum = (this.animeNum + 2) % this.imageNameArr.length; this.animeFrame = 0; }

        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                //ここのイベントの名前
                let eventName = this.stage[i][j];

                //イベントが空でないなら
                if (eventName != 0) {
                    //当たり判定の描画
                    if (config.cd) { Irect(width / this.w * j, height / this.h * i, width / this.w, height / this.h, "rgba(255,0,0,0.1)"); }
                    this.drawMovementArrow(EventData[eventName], i, j);  //移動イベントの矢印描画
                }

            }
        }
    }

    drawMovementArrow(event, i, j) {
        if (event.name == "Movement") {
            switch (event.dir) {
                case "right":
                    ctx.drawImage(ImgData.img_arrow, 0, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                    break;
                case "left":
                    ctx.drawImage(ImgData.img_arrow, 128, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                    break;
                case "up":
                    ctx.drawImage(ImgData.img_arrow, 256, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                    break;
                case "down":
                    ctx.drawImage(ImgData.img_arrow, 384, 0, 128, 128, width / this.w * j, height / this.h * i, 128, 128);
                    break;
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

const Select = class extends Event {
    constructor(_option) {
        super();
        this.name = "Select";
        this.option = _option;
    }

    Start() {
        this.end = false;
        this.frame = 0;
        this.num = 0;
    }

    Loop() {
        Irect(0, Iheight, width, height - Iheight, "rgba(255,255,255," + this.frame / 24 + ")");
        Ifont(24, "black");
        Itext4(this.frame, fontsize, Iheight + fontsize, fontsize, this.option);

        ctx.drawImage(ImgData.icn_cursor, 12, Iheight + fontsize * this.num);

        if (Push.includes("ArrowUp")) { this.num--; se_key.currentTime = 0; se_key.play(); }
        if (Push.includes("ArrowDown")) { this.num++; se_key.currentTime = 0; se_key.play(); }

        this.num = (this.num + this.option.length) % this.option.length;

        if (Push.includes("KeyZ")) {
            this.end = true;
            se_click.play();
        }

        this.frame++;
    }
};

//移動イベント、fromからgotoへdir方向に
const Movement = class extends Event {
    constructor(_from, _goto, _dir) {
        super();
        this.goto = _goto;
        this.from = _from;
        this.dir = _dir;
        this.name = "Movement";
    }

    Start() {
        this.end = false;
        this.frame = 0;
    }

    Loop() {
        let moveFrame = config.moveFrame;

        ctx.clearRect(0, 0, width, height);

        let bg0 = StageData[this.from].imageNameArr[0];
        let bg1 = StageData[this.goto].imageNameArr[0];

        switch (this.dir) {
            case "right":
                ctx.drawImage(ImgData[bg0], -width * this.frame / moveFrame, 0, width, height);
                ctx.drawImage(ImgData[bg1], width - width * this.frame / moveFrame, 0, width, height);
                break;

            case "left":
                ctx.drawImage(ImgData[bg0], width * this.frame / moveFrame, 0, width, height);
                ctx.drawImage(ImgData[bg1], -width + width * this.frame / moveFrame, 0, width, height);
                break;

            case "up":
                ctx.drawImage(ImgData[bg0], 0, height * this.frame / moveFrame, width, height);
                ctx.drawImage(ImgData[bg1], 0, -height + height * this.frame / moveFrame, width, height);
                break;
            case "down":
                ctx.drawImage(ImgData[bg0], 0, -height * this.frame / moveFrame, width, height);
                ctx.drawImage(ImgData[bg1], 0, height - height * this.frame / moveFrame, width, height);
                break;
        }

        this.frame++;

        if (this.frame > moveFrame) {
            this.end = true;
        }
    }

    End() {
        NowStageName = this.goto;
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
};

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
        this.animeNum = 0;
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
            ctx.drawImage(ImgData[this.imgArr[this.animeNum]], 0, 0, width, height);
            this.imgFrame++;
            if (this.imgFrame == this.imgArr[this.animeNum + 1]) { this.animeNum = (this.animeNum + 2) % this.imgArr.length; this.imgFrame = 0; }
        }

        if (this.txtArr[this.num] != "") {
            //文字の背景
            Irect(0, Iheight, width, height - Iheight, "rgba(255,255,255,0.9)");
            //文字
            Ifont(24, "black");
            Itext5(this.frame * config.textSpeed, 0, Iheight + fontsize, fontsize, this.txtArr[this.num]);
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