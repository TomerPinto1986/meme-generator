'use strict';

console.log('hello controller!');
var gCanvas;
var gCtx;
var gIsMouseDown = false;
var gIsMove = false;

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
    const focusTxt = getTxtOnFocus();
    document.querySelector('#text-input').value = focusTxt;
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
        putFocus();
    }
}

function putFocus() {
    const focusPos = getFocusPosition();
    drawRect(focusPos.width, focusPos.height, focusPos.startX, focusPos.startY);
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
    renderMeme();

}


function checkFocus(ev) {
    gIsMouseDown = true;
    console.log('mousedown?: ', gIsMouseDown);
    const { offsetX, offsetY } = ev;
    const idx = checkIfFocusOn(offsetX, offsetY);
    if (idx === -1) return;
    gIsMove = gIsMouseDown;
    renderMeme();
}

function handleMove(ev) {
    if (!gIsMove) return;
    changeMemesPos(ev.offsetX, ev.offsetY);
    renderMeme();
}

function handleMouseUp() {
    gIsMouseDown = false;
    gIsMove = false;
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
    const elGallery = document.querySelector('.main-container .memes-gallery');
    elGallery.style.display = 'grid';
    const memes = loadMemes();
    elGallery.innerHTML = '';
    memes.forEach(meme => {
        var image = new Image();
        image.src = meme;
        elGallery.appendChild(image);
    });
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

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'meme.jpg'
}


function onSaveMeme(elLink) {
    const imgData = gCanvas.toDataURL('image/png');
    saveMeme(imgData)
}



function onKeyDown(ev) {
    console.log(ev.key);
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