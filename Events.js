const bg_pro = new Image(); bg_pro.src = "images/pro.png";

const bg_op = new Image(); bg_op.src = "images/夢中.png";
const bg0 = new Image(); bg0.src = "images/bg0.png";
const bg1 = new Image(); bg1.src = "images/bg1.png";
const bg2_0 = new Image(); bg2_0.src = "images/bg2_0.png";
const bg2_1 = new Image(); bg2_1.src = "images/bg2_1.png";
const bg2_2 = new Image(); bg2_2.src = "images/bg2_2.png";

const bg3 = new Image(); bg3.src = "images/bg3.png";

const bg_ethanol_0 = new Image(); bg_ethanol_0.src = "images/bg_ethanol_0.png";
const bg_ethanol_1 = new Image(); bg_ethanol_1.src = "images/bg_ethanol_1.png";
const bg_ethanol_2 = new Image(); bg_ethanol_2.src = "images/bg_ethanol_2.png";

const bg_love_0 = new Image(); bg_love_0.src = "images/bg_love_0.png";
const bg_love_1 = new Image(); bg_love_1.src = "images/bg_love_1.png";
const bg_love_2 = new Image(); bg_love_2.src = "images/bg_love_2.png";
const bg_love_3 = new Image(); bg_love_3.src = "images/bg_love_3.png";

const cursorImg = new Image(); cursorImg.src = "images/cursor.png";
const img_arrow = new Image(); img_arrow.src = "images/Arrow.png";

const icn_burn = new Image(); icn_burn.src = "images/icn_burn.png";
const icn_beaker = new Image(); icn_beaker.src = "images/icn_beaker.png";

const se_click = new Audio("sounds/click.wav");
const se_key = new Audio("sounds/KeyBoard.wav");
const se_ats = new Audio("sounds/click.wav");

const bgm_op = new Audio("sounds/Shingoki.wav");
const bgm_stage = new Audio("sounds/Kachohugetsu.wav");

let stageBgmList = [bgm_stage, bgm_op];



let Items = [];

let NowStage;
let NowEvent;

let NextEvent = [];

let Evs = {};
let Sts = {};


Evs.cv_op = new Conversation([new ImgTxt([bg_op], ["天使:言葉の力、名前の力", "天使:所謂言霊ってやつを信じているので", "天使:私は今ここにいるのです"]), new ImgTxt([bg0], [""])]); Evs.cv_op.End = () => { NowStage = Sts.stage0; };
Evs.cv_beaker0 = new Conversation([new ImgTxt(null, ["冷たくて、透明で、美しい", "ビーカーを手に入れた"])]); Evs.cv_beaker0.End = () => { Items.push(new Item("ビーカー", "きれい", icn_beaker)); NowStage = Sts.stage1; };

Sts.stage_op = new Stage(4, 4, [bg0]); Sts.stage_op.register(0, 2, 2, 2, Evs.cv_op);
Sts.stage0 = new Stage(4, 4, [bg0]); Sts.stage0.register(0, 2, 2, 2, Evs.cv_beaker0);


//ステージの生成
Sts.stage1 = new Stage(4, 4, [bg1]);
Sts.stage2 = new Stage(4, 4, [bg2_0, bg2_1, bg2_2]);
Sts.stage3 = new Stage(4, 4, [bg3]);
Sts.stage4 = new Stage(4, 4, [bg_pro]);
Sts.stage5 = new Stage(4, 4, [bg_love_0, bg_love_1, bg_love_2]);
Sts.stage6 = new Stage(4, 4, [bg_pro]);

//ステージ間の移動イベントの生成および設定
MakeMap([
    ["stage4", "stage5", "stage6"],
    ["stage1", "stage2", "stage3"]
]);

//会話イベントの生成および設定
Evs.cv_burner = new Conversation([new ImgTxt(null, ["ブス"])]); Evs.cv_burner.End = () => { se_ats.play(); ItemPush(new Item("やけど", "あつい", icn_burn)) }; Sts.stage2.assign(2, 1, Evs.cv_burner);
Evs.cv_ethanol1 = new Conversation([new ImgTxt([bg_ethanol_0, bg_ethanol_1, bg_ethanol_2], ["", "おい、やけどしてるじゃないか", "まったく..."]), new ImgTxt([bg3], [""])]);
Evs.cv_ethanol = new Conversation([new ImgTxt(null, ["やめときなよ、僕にかかわるのは", "何一ついいことなんてない"])]);
Evs.cv_ethanol.End = () => {
    if (FindItem("やけど")) {
        NextEvent.push(Evs.cv_ethanol1);
    }
};
Sts.stage3.register(2, 1, 2, 3, Evs.cv_ethanol);
Evs.cv_beaker1 = new Conversation([new ImgTxt(null, ["濡れてる"])]); Sts.stage1.register(0, 3, 2, 1, Evs.cv_beaker1);

Evs.cv_love = new Conversation([new ImgTxt([bg_love_0, bg_love_3], ["???:ねぇ！", "???:これ何が入ってると思う？", "天使:しらない", "???:愛だよ"])]);
Sts.stage5.register(1, 1, 2, 2, Evs.cv_love);



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
    constructor(_name, _ex, _icon = cursorImg) {
        this.name = _name;
        this.ex = _ex;
        this.icon = _icon;
    }
}

//持っていないなら手に入れる
function ItemPush(item) {
    //持っていないか？
    if (!FindItem(item)) { Items.push(item); }

}

//アイテムを持っているか調べる
function FindItem(name) {
    return Items.find((e) => { return e.name == name; });
}
