/**--init-- */
let ImgData = {};

//画像の登録
RegisterImg("bg_pro");

RegisterImg("bg_op");

RegisterImg("bg_0");
RegisterImg("bg_1");
SerialImg("bg_2", 2);
RegisterImg("bg_3");

SerialImg("bg_ethanol", 2);

SerialImg("bg_citricAcid", 3);

SerialImg("bg_NaOH", 2);

RegisterImg("bg_haizara");

RegisterImg("bg_dark");

RegisterImg("img_cursor");
RegisterImg("img_arrow");
RegisterImg("bikkuri");

RegisterImg("icn_scald");

RegisterImg("icn_beaker");
RegisterImg("icn_cursor");
RegisterImg("icn_tabacco");

//音声の登録
const se_click = new Audio("sounds/click.wav");
const se_key = new Audio("sounds/KeyBoard.wav");
const se_ats = new Audio("sounds/click.wav");

const bgm_op = new Audio("sounds/Shingoki.wav");
const bgm_stage = new Audio("sounds/Kachohugetsu.wav");

const bgm_boss_0 = new Audio("sounds/Weariness.wav");

let stageBgmList = [bgm_stage, bgm_op];

//0からnumまで登録
function SerialImg(name, num) {
    for (let i = 0; i <= num; i++) {
        RegisterImg(name + "_" + i);
    }
}

//画像の登録
function RegisterImg(name) {
    ImgData[name] = new Image();
    ImgData[name].src = "images/" + name + ".png";
}


let Items = [];

let NowStageName;
let NowEventName;

let NextEventName = [];

let EventData = {};
let StageData = {};

//アイテムの情報
let ItemData = {
    Beaker: { name: "ビーカー", ex: "きれい", icon: "icn_beaker" },
    Scald: { name: "やけど", ex: "あつい", icon: "icn_scald" },
    Tabacco: { name: "タバコ", ex: "彼のはいいにおいだったのに", icon: "icn_tabacco" }
};

/**--0章-- */

EventData.cv_op = new Conversation([new ImgTxt(["bg_op", 8], ["天使:...", "天使:あなたは言葉に言葉以上の意味があると\n思う？", "天使:...", "天使:歩き続けなきゃ", "何もしていないと、\n死んでるのと同じだから", "Cursorが天使を導きます"]), new ImgTxt(["bg_0", 8], [""])]);
EventData.cv_op.End = () => { NowStageName = "stage0"; };

EventData.cv_beaker_0 = new Conversation([new ImgTxt(null, ["天使:(冷たくて、透明で、美しい)", "ビーカーを手に入れた"])]);
EventData.cv_beaker_0.End = () => { ItemPush("Beaker"); NowStageName = "stage1"; };

StageData.stage_op = new Stage(4, 4, ["bg_0", 8]); StageData.stage_op.register(0, 2, 2, 2, "cv_op");
StageData.stage0 = new Stage(4, 4, ["bg_0", 8]); StageData.stage0.register(0, 2, 2, 2, "cv_beaker_0");

//ステージの生成
StageData.stage1 = new Stage(4, 4, ["bg_1", 8]);
StageData.stage2 = new Stage(4, 4, ["bg_2_0", 8, "bg_2_1", 8, "bg_2_2", 8]);
StageData.stage3 = new Stage(4, 4, ["bg_3", 8]);
StageData.stage4 = new Stage(4, 4, ["bg_NaOH_0", 69, "bg_NaOH_1", 1, "bg_NaOH_2", 1, "bg_NaOH_1", 1]);
StageData.stage5 = new Stage(4, 4, ["bg_citricAcid_0", 8, "bg_citricAcid_1", 8, "bg_citricAcid_2", 8]);
StageData.stage6 = new Stage(4, 4, ["bg_pro", 8]);
StageData.stage7 = new Stage(4, 4, ["bg_haizara", 8]);

//ステージ間の移動イベントの生成および設定
MakeMovementEvent([
    ["stage4", "stage5", "stage6", "stage7"],
    ["stage1", "stage2", "stage3", 0]
]);

//会話イベントの生成および設定
EventData.cv_burner = new Conversation([new ImgTxt(null, ["ブス"])]); EventData.cv_burner.End = () => { se_ats.play(); ItemPush("Scald"); };
StageData.stage2.assign(2, 1, "cv_burner");

EventData.cv_ethanol2 = new Conversation([new ImgTxt(["bg_dark", 8], ["???:え", "天使:おそろい"])]); EventData.cv_ethanol2.End = () => { NextEventName.push(null); scenemanager.MoveTo(scene4); };
EventData.cv_ethanol1 = new Conversation([new ImgTxt(["bg_ethanol_0", 8, "bg_ethanol_1", 8, "bg_ethanol_2", 8], ["", "???:おい、やけどしてるじゃないか", "???:まったく..."]), new ImgTxt(["bg_3"], [""])]); EventData.cv_ethanol1.End = () => { if (Items.includes("Tabacco")) { NextEventName.push("cv_ethanol2"); } };
EventData.cv_ethanol = new Conversation([new ImgTxt(null, ["???:やめときなよ、僕にかかわるのは", "???:何一ついいことなんてない"])]); EventData.cv_ethanol.End = () => { if (Items.includes("Scald")) { NextEventName.push("cv_ethanol1"); } };
StageData.stage3.register(2, 1, 2, 3, "cv_ethanol");

EventData.cv_beaker1 = new Conversation([new ImgTxt(null, ["濡れてる"])]);
StageData.stage1.register(0, 3, 2, 1, "cv_beaker1");


//選択肢テスト
EventData.cv_citricAcid_1 = new Select(["「知ってる」と言う", "「知らない」と言う"]);
EventData.cv_citricAcid_1.End = () => {
    switch (EventData.cv_citricAcid_1.num) {
        case 0: NextEventName.push("cv_citricAcid_2"); break;
        case 1: NextEventName.push("cv_citricAcid_3"); break;
    }
};
EventData.cv_citricAcid_2 = new Conversation([new ImgTxt(["bg_citricAcid_0", 12, "bg_citricAcid_3", 12], ["天使:知ってる", "???:そう、なら忘れないでね"])]);
EventData.cv_citricAcid_3 = new Conversation([new ImgTxt(["bg_citricAcid_0", 12, "bg_citricAcid_3", 12], ["天使:知らない", "???:恋だよ"])]);

EventData.cv_citricAcid_0 = new Conversation([new ImgTxt(["bg_citricAcid_0", 12, "bg_citricAcid_3", 12], ["???:ねぇ！", "???:これ何が入ってるか知ってる？"])]);
EventData.cv_citricAcid_0.End = () => { NextEventName.push("cv_citricAcid_1") };
StageData.stage5.register(1, 1, 2, 2, "cv_citricAcid_0");

//分岐テスト
EventData.cv_NaOH_0 = new Conversation([new ImgTxt(null, ["???:ところでさ", "???:ひとの考えを無理やり変えようと\nするのって最低だと思わない？"])]); EventData.cv_NaOH_0.End = () => { EventData.cv_NaOH.property = 3; };
EventData.cv_NaOH_1 = new Conversation([new ImgTxt(null, ["???:やぁ", "???:Cursorが遅いときは\nF12を押してコンソールに", "config.cursorSpeed=48;", "とか入力するといいよ"])]); EventData.cv_NaOH_1.End = () => { EventData.cv_NaOH.property = 2; };
EventData.cv_NaOH_2 = new Conversation([new ImgTxt(null, ["???:もう一回聞きたい?", "???:EventData.cv_NaOH.property=0;\nってしてみてよ"])]);
EventData.cv_NaOH_3 = new Conversation([new ImgTxt(null, ["???:私はもうこの世界に興味ないんだ"])]);
//分岐元
EventData.cv_NaOH = new OneShot(); EventData.cv_NaOH.property = 1; EventData.cv_NaOH.End = () => {
    switch (EventData.cv_NaOH.property) {
        case 0: NextEventName.push("cv_NaOH_1", "cv_NaOH_0"); break;
        case 1: NextEventName.push("cv_NaOH_1"); break;
        case 2: NextEventName.push("cv_NaOH_2"); break;
        case 3: NextEventName.push("cv_NaOH_3"); break;
    }
};
StageData.stage4.register(0, 1, 1, 2, "cv_NaOH");

EventData.cv_nicotine_0 = new Conversation([new ImgTxt(null, ["人形:僕のことは気にしないで", "人形:君よりは元気だから"])]);
EventData.cv_nicotine_1 = new Conversation([new ImgTxt(null, ["天使:(ちぐはぐな人形だ)"])]);

EventData.cv_nicotine = new OneShot(); EventData.cv_nicotine.End = () => {
    if (Math.random() < 1 / 6) { NextEventName.push("cv_nicotine_0"); }
    else { NextEventName.push("cv_nicotine_1"); }
};
StageData.stage7.register(0, 2, 2, 2, "cv_nicotine");


EventData.cv_tabacco_0 = new Conversation([new ImgTxt(null, ["天使:(まだあったかい)", "タバコを手に入れた"])]); EventData.cv_tabacco_0.End = () => { ItemPush("Tabacco") };
EventData.cv_tabacco_1 = new Conversation([new ImgTxt(null, ["天使:(彼は今どうしているんだろう)"])]);
EventData.cv_tabacco = new OneShot(); EventData.cv_tabacco.End = () => { if (Items.includes("Tabacco")) { NextEventName.push("cv_tabacco_1"); } else { NextEventName.push("cv_tabacco_0"); } };
StageData.stage7.register(2, 2, 2, 2, "cv_tabacco");





/**--------------------------------------------------------------------------------------------------------- */
//地図から移動イベントを作る
function MakeMovementEvent(map) {
    //右方向
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length - 1; i++) {
            //原点のステージの名前
            let from = map[j][i];
            //行先のステージの名前
            let to = map[j][i + 1];

            if (from != 0 && to != 0) {
                EventData["mv_" + from + to] = new Movement(from, to, "right");
                StageData[from].register(3, 1, 1, 2, "mv_" + from + to);
                EventData["mv_" + to + from] = new Movement(to, from, "left");
                StageData[to].register(0, 1, 1, 2, "mv_" + to + from);
            }
        }

    }

    //下方向
    for (let j = 0; j < map.length - 1; j++) {
        for (let i = 0; i < map[0].length; i++) {
            //原点のステージの名前
            let from = map[j][i];
            //行先のステージの名前
            let to = map[j + 1][i];

            if (from != 0 && to != 0) {
                EventData["mv_" + from + to] = new Movement(from, to, "down");
                StageData[from].register(1, 3, 2, 1, "mv_" + from + to);
                EventData["mv_" + to + from] = new Movement(to, from, "up");
                StageData[to].register(1, 0, 2, 1, "mv_" + to + from);
            }
        }
    }
}

//持っていないなら手に入れる
function ItemPush(name) {
    //持っていないか？
    if (!Items.includes(name)) { Items.push(name); }
}