'use strict';

console.log('hello controller!');
var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    console.log('The context:', gCtx);
    openMemeEditor();
}


function openMemeEditor(imgId = 1) {
    const imgUrl = getImgUrlFromService(imgId);
    drawImg(imgUrl);
}

function drawText() {
    const lines = getLinesFromService();
    console.log(lines);
    gCtx.fillStyle = `${lines[0].color}`
    gCtx.font = `${lines[0].size}px ${lines[0].font}`
    gCtx.textAlign = `${lines[0].align}`
    gCtx.fillText(lines[0].txt, 100, 50)
    gCtx.strokeText(lines[0].txt, 100, 50)
}



function drawImg(imgUrl) {
    const img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
}