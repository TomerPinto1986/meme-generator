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
    document.querySelector('.main-container .filter').style.display = 'none';
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
        if (line.isStroke) gCtx.strokeText(line.txt, line.x, line.y);
    });

}

function onSubmitChanges(ev) {
    ev.preventDefault();
    const elForm = ev.target;
    const txt = elForm.querySelector('#text-input').value;
    const color = elForm.querySelector('#toggle-color').value;
    const font = elForm.querySelector('select').value;
    addMemeTxt(txt, color, font);
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
    const idx = changeFocus();
    const focusPos = getFocusPosition(idx);
    renderMeme();
    setTimeout(function() {
        drawRect(focusPos.width, focusPos.height, focusPos.startX, focusPos.startY);
    }, 100);
}


function checkFocus(ev) {
    const { offsetX, offsetY } = ev;
    const idx = checkIfFocusOn(offsetX, offsetY);
    const focusPos = getFocusPosition(idx);
    renderMeme();
    setTimeout(function() {
        drawRect(focusPos.width, focusPos.height, focusPos.startX, focusPos.startY);
    }, 100);

}

function onGalleryOpen() {
    document.querySelector('.meme-editor').style.display = 'none';
    document.querySelector('.main-content .gallery').style.display = 'grid';
    document.querySelector('.main-container .filter').style.display = 'flex';
    document.querySelector('.main-container .memes-gallery').style.display = 'none';

}

function onMemesOpen() {
    document.querySelector('.meme-editor').style.display = 'none';
    document.querySelector('.main-content .gallery').style.display = 'none';
    document.querySelector('.main-container .filter').style.display = 'none';
    document.querySelector('.main-container .memes-gallery').style.display = 'grid';

}

function drawRect(width, height, x, y) {
    gCtx.beginPath()
    gCtx.rect(x, y, width, -height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}

function onDeleteTxt() {
    deletetxt();
    renderMeme();
}

function onStroke() {
    strokeTxt();
    renderMeme();
}

// function onRtl() {
//     changeTxtAlign('left');
//     renderMeme();
// }

// function onCenter() {
//     changeTxtAlign('center');
//     renderMeme();
// }

// function onLtr() {
//     changeTxtAlign('right');
//     renderMeme();
// }