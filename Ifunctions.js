//文字送り{frame, x, y, text}
function Itext(frame, x, y, text) {
    let t = "";

    if (typeof text != "string") {
        t = "文章が定義されていない";
    } else {
        if (text.length > frame) {
            for (let i = 0; i < frame; i++) {
                t = t + text.charAt(i);
            }
        } else {
            t = text;
        }
    }

    ctx.beginPath();
    ctx.fillText(t, x, y);
}

//待機可能改行テキスト
function Itext4(frame, x, y, _fontsize, textArr) {
    let t = 0;
    let I = 0;

    for (let i = 0; i < textArr.length; i++) {
        let obj = textArr[i];

        if (typeof obj == "string") {
            Itext(frame - t, x, y + _fontsize * I, obj);
            t += obj.length;
            I++;
        } else if (typeof obj == "number") {
            t += obj;
        }
    }
}

function Itext5(frame, x, y, _fontsize, text) {
    let textArr = text.split("\n");
    Itext4(frame, x, y, _fontsize, textArr);
}

function Icircle(x, y, r, c, id = "fill", size = 2) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);

    switch (id) {
        case "fill":
            ctx.fillStyle = c;
            ctx.fill();
            break;
        case "stroke":
            ctx.strokeStyle = c;
            ctx.lineWidth = size;
            ctx.stroke();
            break;
    }
}

//座標、幅、高さ、色、ID,太さ
function Irect(x, y, width, height, c, id = "fill", size = 2) {
    ctx.beginPath();

    switch (id) {
        case "fill":
            ctx.fillStyle = c;
            ctx.fillRect(x, y, width, height);
            break;
        case "stroke":
            ctx.strokeStyle = c;
            ctx.lineWidth = size;
            ctx.strokeRect(x, y, width, height);
            break;
    }
}


//通る座標、色、太さ
function Iline(colore, size, arr) {
    ctx.strokeStyle = colore;
    ctx.lineWidth = size;

    ctx.beginPath();
    ctx.moveTo(arr[0].x, arr[0].y);
    for (let i = 1; i < arr.length; i++) {
        ctx.lineTo(arr[i].x, arr[i].y);
    }
    ctx.stroke();
}

function Ifont(size, colore) {
    ctx.fillStyle = colore;
    fontsize = size;
    ctx.font = fontsize + "px " + config.font;
}
