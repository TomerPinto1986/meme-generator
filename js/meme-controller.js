'use strict';

console.log('hello controller!');
var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    console.log('The context:', gCtx);
}


function renderMeme() {
    const currMeme = getCurrMeme();
    drawImg(getImgUrlFromService(currMeme.selectedImgId));
}


function openMemeEditor(imgId) {
    document.querySelector('.main-content .gallery').style.display = 'none';
    document.querySelector('.meme-editor').style.display = 'flex';
    createMeme(imgId);
    const imgUrl = getImgUrlFromService(imgId);
    drawImg(imgUrl);
}

function drawText() {
    const lines = getLinesFromService();
    if (lines.length === 0) return;
    lines.forEach(line => {
        gCtx.fillStyle = `${line.color}`;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = `${line.align}`;
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
    });
}

function onSubmitChanges(ev) {
    ev.preventDefault();
    const elForm = ev.target;
    const txt = elForm.querySelector('#text-input').value;
    addMemeTxt(txt);
    renderMeme();
}



function drawImg(imgUrl) {
    const img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
}


function onSizeChange(delta) {
    changeSizeFont(delta);
    renderMeme();
}

function onTxtMove(delta) {
    moveTxt(delta);
    renderMeme();
}

function onChangeFocus() {
    changeFocus();
    console.log('change focus');
}


function handleStart(ev) {
    const { offsetX, offsetY } = ev;
    checkIfFocusOn(offsetX, offsetY);
}