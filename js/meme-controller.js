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


function renderMeme() {
    const currMeme = getCurrMeme();
    drawImg(getImgUrlFromService(currMeme.selectedImgId));
}


function openMemeEditor(imgId = 1) {
    createMeme(imgId);
    const imgUrl = getImgUrlFromService(imgId);
    drawImg(imgUrl);
}

function drawText() {
    const lines = getLinesFromService();
    console.log(lines);
    gCtx.fillStyle = `${lines[0].color}`;
    console.log(lines[0].size);
    gCtx.font = `${lines[0].size}px ${lines[0].font}`;
    gCtx.textAlign = `${lines[0].align}`;
    gCtx.fillText(lines[0].txt, 100, 50);
    gCtx.strokeText(lines[0].txt, 100, 50);
}

function onSubmitChanges(ev) {
    ev.preventDefault();
    const elForm = ev.target;
    const txt = elForm.querySelector('#text-input').value;
    changeMemeTxt(txt);
    renderMeme();
}



function drawImg(imgUrl) {
    console.log(imgUrl);
    const img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
}