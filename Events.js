let Imgs = {};

RegisterImg("bg_pro");

RegisterImg("bg_op")

RegisterImg("bg_0");
RegisterImg("bg_1");
SerialImg("bg_2", 2);
RegisterImg("bg_3");

SerialImg("bg_ethanol", 2);

SerialImg("bg_love", 3);

SerialImg("bg_NaOH", 2)

RegisterImg("img_cursor");
RegisterImg("img_arrow");

RegisterImg("icn_scald");

RegisterImg("icn_beaker");

const se_click = new Audio("sounds/click.wav");
const se_key = new Audio("sounds/KeyBoard.wav");
const se_ats = new Audio("sounds/click.wav");

const bgm_op = new Audio("sounds/Shingoki.wav");
const bgm_stage = new Audio("sounds/Kachohugetsu.wav");

let stageBgmList = [bgm_stage, bgm_op];

//0からnumまで登録
function SerialImg(name, num) {
    for (let i = 0; i <= num; i++) {
        RegisterImg(name + "_" + i);
    }
}

function RegisterImg(name) {
    Imgs[name] = new Image();
    Imgs[name].src = "images/" + name + ".png";
}


let Items = [];

let NowStage;
let NowEvent;

let NextEvent = [];

let Evs = {};
let Sts = {};


Evs.cv_op = new Conversation([new ImgTxt([Imgs.bg_op], ["天使:言葉の力、名前の力", "天使:所謂言霊ってやつを信じているので", "天使:私は今ここにいるのです"]), new ImgTxt([Imgs.bg_0], [""])]); Evs.cv_op.End = () => { NowStage = Sts.stage0; };
Evs.cv_beaker0 = new Conversation([new ImgTxt(null, ["冷たくて、透明で、美しい", "ビーカーを手に入れた"])]); Evs.cv_beaker0.End = () => { Items.push(new Item("ビーカー", "きれい", Imgs.icn_beaker)); NowStage = Sts.stage1; };

Sts.stage_op = new Stage(4, 4, [Imgs.bg_0, 8]); Sts.stage_op.register(0, 2, 2, 2, Evs.cv_op);
Sts.stage0 = new Stage(4, 4, [Imgs.bg_0, 8]); Sts.stage0.register(0, 2, 2, 2, Evs.cv_beaker0);


//ステージの生成
Sts.stage1 = new Stage(4, 4, [Imgs.bg_1, 8]);
Sts.stage2 = new Stage(4, 4, [Imgs.bg_2_0, 8, Imgs.bg_2_1, 8, Imgs.bg_2_2, 8]);
Sts.stage3 = new Stage(4, 4, [Imgs.bg_3, 8]);
Sts.stage4 = new Stage(4, 4, [Imgs.bg_NaOH_0, 237, Imgs.bg_NaOH_1, 1, Imgs.bg_NaOH_2, 1, Imgs.bg_NaOH_1, 1]);
Sts.stage5 = new Stage(4, 4, [Imgs.bg_love_0, 8, Imgs.bg_love_1, 8, Imgs.bg_love_2, 8]);
Sts.stage6 = new Stage(4, 4, [Imgs.bg_pro, 8]);

//ステージ間の移動イベントの生成および設定
MakeMap([
    ["stage4", "stage5", "stage6"],
    ["stage1", "stage2", "stage3"]
]);

//会話イベントの生成および設定
Evs.cv_burner = new Conversation([new ImgTxt(null, ["ブス"])]); Evs.cv_burner.End = () => { se_ats.play(); ItemPush(new Item("やけど", "あつい", Imgs.icn_scald)); };
Sts.stage2.assign(2, 1, Evs.cv_burner);

Evs.cv_ethanol1 = new Conversation([new ImgTxt([Imgs.bg_ethanol_0, 8, Imgs.bg_ethanol_1, 8, Imgs.bg_ethanol_2, 8], ["", "おい、やけどしてるじゃないか", "まったく..."]), new ImgTxt([Imgs.bg_3], [""])]);
Evs.cv_ethanol = new Conversation([new ImgTxt(null, ["やめときなよ、僕にかかわるのは", "何一ついいことなんてない"])]); Evs.cv_ethanol.End = () => { if (FindItem("やけど")) { NextEvent.push(Evs.cv_ethanol1); } };
Sts.stage3.register(2, 1, 2, 3, Evs.cv_ethanol);

Evs.cv_beaker1 = new Conversation([new ImgTxt(null, ["濡れてる"])]);
Sts.stage1.register(0, 3, 2, 1, Evs.cv_beaker1);

Evs.cv_love = new Conversation([new ImgTxt([Imgs.bg_love_0, 12, Imgs.bg_love_3, 12], ["???:ねぇ！", "???:これ何が入ってると思う？", "天使:しらない", "???:愛だよ"])]);
Sts.stage5.register(1, 1, 2, 2, Evs.cv_love);

//分岐テスト
Evs.cv_NaOH_0 = new Conversation([new ImgTxt(null, ["???:ところでさ", "???:ひとの考えを無理やり変えようと\nするのって最低だと思わない？"])]); Evs.cv_NaOH_0.End = () => { Evs.cv_NaOH.property = 3; };
Evs.cv_NaOH_1 = new Conversation([new ImgTxt(null, ["???:やぁ", "???:cursorが遅いときは\nF12を押してコンソールに", "config.cursorSpeed=48;", "とか入力するといいよ"])]); Evs.cv_NaOH_1.End = () => { Evs.cv_NaOH.property = 2; };
Evs.cv_NaOH_2 = new Conversation([new ImgTxt(null, ["???:もう一回聞きたい?", "???:Evs.cv_NaOH.property=0;\nってしてみてよ"])]);
Evs.cv_NaOH_3 = new Conversation([new ImgTxt(null, ["???:私はもうこの世界に興味ないんだ"])]);
//分岐元
Evs.cv_NaOH = new OneShot(); Evs.cv_NaOH.property = 1; Evs.cv_NaOH.End = () => {
    switch (Evs.cv_NaOH.property) {
        case 0: NextEvent.push(Evs.cv_NaOH_1, Evs.cv_NaOH_0); break;
        case 1: NextEvent.push(Evs.cv_NaOH_1); break;
        case 2: NextEvent.push(Evs.cv_NaOH_2); break;
        case 3: NextEvent.push(Evs.cv_NaOH_3); break;
    }
};
Sts.stage4.register(0, 1, 2, 2, Evs.cv_NaOH);

/**--------------------------------------------------------------------------------------------------------- */
function MakeMap(map) {
    //横方向
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length - 1; i++) {
            let from = map[j][i];
            let to = map[j][i + 1];

            if (from != 0 && to != 0) {
                Evs["mv_" + from + to] = new Movement(Sts[from], Sts[to], "right");
                Evs["mv_" + to + from] = new Movement(Sts[to], Sts[from], "left");
            }
        }

    }

    //縦方向
    for (let j = 0; j < map.length - 1; j++) {
        for (let i = 0; i < map[0].length; i++) {
            let from = map[j][i];
            let to = map[j + 1][i];

            if (from != 0 && to != 0) {
                Evs["mv_" + from + to] = new Movement(Sts[from], Sts[to], "down");
                Evs["mv_" + to + from] = new Movement(Sts[to], Sts[from], "up");
            }
        }
    }
}

const Item = class {
    constructor(_name, _ex, _icon = Imgs.img_cursor) {
        this.name = _name;
        this.ex = _ex;
        this.icon = _icon;
    }
}

//持っていないなら手に入れる
function ItemPush(item) {
    //持っていないか？
    if (!FindItem(item.name)) { Items.push(item); }

}

//アイテムを持っているか調べる
function FindItem(name) {
    return Items.find((e) => { return e.name == name; });
}