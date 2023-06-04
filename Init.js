const cvs = document.getElementById("canvas0");
const ctx = cvs.getContext("2d", { willReadFrequently: true });

const width = cvs.width;    //=720
const height = cvs.height;  //=720

const Iheight = height * 3 / 4; //=540

const drawheight = 480;

let Pressed = [];
let Push = [];
let mouse = new vec(0, 0);

//キー入力
document.addEventListener('keydown', keydownEvent, false);
document.addEventListener('keyup', keyupEvent, false);
cvs.addEventListener('mousemove', getMousePosition, false);
cvs.addEventListener("mousedown", getMouseClick, false);

function keydownEvent(e) {
    if (!Pressed.includes(e.code)) {
        Pressed.push(e.code);
        if (Pressed.includes(e.code)) { Push.push(e.code); }
        //console.log(Push);
    }
}
function keyupEvent(e) {
    Pressed = Pressed.filter((element) => { return element != e.code; });
}

function getMousePosition(e) {
    mouse = new vec(e.clientX - cvs.getBoundingClientRect().left, e.clientY - cvs.getBoundingClientRect().top);
}

function getMouseClick(e) {
    Push.push("KeyZ");
}

let fontsize = 24;

function button(id) {
    console.log("pressed_" + id);
    switch (id) {
        case "cursorMode":
            if (config.cursorMode == "key") {
                config.cursorMode = "mouse";
                document.getElementById("cursorMode").value = "cursorMode:mouse";
            } else {
                config.cursorMode = "key";
                document.getElementById("cursorMode").value = "cursorMode:key";
            }
            break;
        case "muteBgm":
            config.muteBgm = !config.muteBgm;
            document.getElementById("muteBgm").value = "muteBgm:" + config.muteBgm;
            break;
        case "NextBgm":
            if (!stageBgm.paused) { stageBgm.currentTime = 100000; }
            break;

    }

    se_key.play();

}
