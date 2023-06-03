//p:ゲーム内座標、dp:画面上座標
let cursor = { p: new vec(0, 0), dp: new vec(90, 90), speed: config.cursorSpeed, r: 10 };

const Scene0 = class extends Scene {
    constructor() {
        super();
    }

    Loop() {
        //s:現在位置のEvent、h:縦幅、w:横幅
        let s = NowStage.stage[cursor.p.y][cursor.p.x];
        let h = NowStage.h;
        let w = NowStage.w;

        if (config.cursorMode == "key") {
            //カーソルの移動
            if (Pressed.includes("ArrowRight")) { cursor.dp.x += cursor.speed; }
            if (Pressed.includes("ArrowLeft")) { cursor.dp.x -= cursor.speed; }
            if (Pressed.includes("ArrowUp")) { cursor.dp.y -= cursor.speed; }
            if (Pressed.includes("ArrowDown")) { cursor.dp.y += cursor.speed; }
        } else if (config.cursorMode == "mouse") {
            cursor.dp = mouse;
        }

        //枠外に出ないように
        if (width - cursor.r < cursor.dp.x) { cursor.dp.x = width - cursor.r; }
        if (cursor.dp.x < cursor.r) { cursor.dp.x = cursor.r; }
        if (cursor.dp.y < cursor.r) { cursor.dp.y = cursor.r; }
        if (height - cursor.r < cursor.dp.y) { cursor.dp.y = height - cursor.r; }


        //升目の取得
        cursor.p.x = Math.floor(cursor.dp.x / width * w);
        cursor.p.y = Math.floor(cursor.dp.y / height * h);

        if (Push.includes("KeyZ") && s != 0) {
            NowEvent = s;
            scenemanager.MoveTo(scene1);
            se_click.play();
        }

        if (Push.includes("KeyX")) {
            scenemanager.MoveTo(scene2);
            se_key.play();
        }

        ctx.globalAlpha = 1;

        //ステージ描画
        NowStage.draw();

        //カーソルの描画
        Icircle(cursor.dp.x, cursor.dp.y, cursor.r, "rgba(0,0,255,0.3)");
        ctx.drawImage(Imgs.img_cursor, cursor.dp.x - 10, cursor.dp.y);

        if (config.cd) {
            //座標の表示
            Ifont(24, "black");
            Itext4(100, 0, fontsize, fontsize, ["x:" + cursor.p.x, "y:" + cursor.p.y]);
        }

    }
};

//イベント実行画面
const Scene1 = class extends Scene {
    constructor() {
        super();
    }

    Start() {
        NowEvent.Start();
    }

    Loop() {
        //終わったらステージに戻る
        if (NowEvent.end) {
            NowEvent.End();
            //続きもの
            if (NextEvent.length > 0) {
                NowEvent = NextEvent[0];
                NextEvent.shift();

                scene1.Start();
            } else {
                scenemanager.MoveTo(scene0);
            }
        } else {
            NowEvent.Loop();
        }
    }
};

//アイテム確認画面
const Scene2 = class extends Scene {
    constructor() {
        super();
        this.inum = 0;      //選択しているアイテムの番号
        this.iex = false;   //説明を表示するか
    }

    Start() {
        this.iex = false;
    }

    Loop() {
        //文字の背景
        Irect(0, Iheight, width, height / 4, "rgba(255,255,255,0.3)");

        //アイテム持ってるなら
        if (Items.length > 0) {
            //文字
            Ifont(24, "black");

            Itext(1000, 0, Iheight + fontsize * 2, "→");
            Itext(1000, fontsize * 2, Iheight + fontsize * 2, Items[this.inum].name); ctx.drawImage(Items[this.inum].icon, fontsize, Iheight + fontsize, fontsize, fontsize);
            if (this.inum > 0) { Itext(1000, fontsize * 2, Iheight + fontsize, Items[this.inum - 1].name); ctx.drawImage(Items[this.inum - 1].icon, fontsize, Iheight, fontsize, fontsize); }
            if (this.inum < Items.length - 1) { Itext(1000, fontsize * 2, Iheight + fontsize * 3, Items[this.inum + 1].name); ctx.drawImage(Items[this.inum + 1].icon, fontsize, Iheight + fontsize * 2, fontsize, fontsize); }

            //キー操作
            if (Push.includes("ArrowUp")) { this.inum--; this.iex = false; se_key.currentTime = 0; se_key.play(); }
            if (Push.includes("ArrowDown")) { this.inum++; this.iex = false; se_key.currentTime = 0; se_key.play(); }

            this.inum = (this.inum + Items.length) % Items.length;

            //説明を見る
            if (Push.includes("KeyZ")) {
                this.iex = !this.iex;
                se_click.play();
            }

            if (this.iex) {
                Itext(1000, fontsize, Iheight + fontsize * 5, Items[this.inum].ex);
            }
        }

        //枠線
        Iline("black", 2, [{ x: 0, y: Iheight }, { x: width, y: Iheight }]);

        //閉じる
        if (Push.includes("KeyX")) {
            scenemanager.MoveTo(scene0);
            se_key.play();
        }
    }
};

//タイトル画面
const Scene3 = class extends Scene {
    constructor() {
        super();
        this.f = 0;
        this.num = 0;
        this.isopt = 0;
        this.title;
        this.option = ["始める", "遊び方"];

        this.f0 = 0;
        this.f1 = 1;
        this.end = false;
    }

    End() {
        stageBgm.play();
    }

    Loop() {
        //描画
        ctx.clearRect(0, 0, width, height);

        Ifont(48, "black");
        Itext(this.frame, fontsize, fontsize, this.title);

        Ifont(24, "black");
        Itext4(this.f, fontsize * 2, 120 + fontsize, fontsize, this.option);

        Itext(this.f, fontsize, 120 + fontsize * (1 + this.num), "→");

        if (this.isopt == 1) {
            Itext4(this.f0, fontsize, 300, fontsize, ["散歩ゲー", "矢印キーで移動、Zキーでクリック", "Xキーでアイテムの確認"]);
            this.f0++;
        }

        this.f++;


        //処理
        if (this.end) {
            Irect(0, 0, width, height, "rgba(0,0,0," + (1 - this.f1 / 60) + ")");

            if (this.f1 == 0) {
                scenemanager.MoveTo(scene0);
            }

            this.f1--;
        } else {
            if (Push.includes("ArrowUp")) { this.num--; se_key.currentTime = 0; se_key.play(); }
            if (Push.includes("ArrowDown")) { this.num++; se_key.currentTime = 0; se_key.play(); }

            this.num = (this.num + this.option.length) % this.option.length;

            if (Push.includes("KeyZ") && !this.end) {
                switch (this.num) {
                    case 0:
                        this.f1 = 60; this.end = true;
                        break;
                    case 1:
                        this.isopt = 1; this.f0 = 0;
                        break;
                    case 2:
                        break;
                }

                se_click.play();
            }
        }
    }
};

const scene0 = new Scene0();
const scene1 = new Scene1();
const scene2 = new Scene2();
const scene3 = new Scene3();