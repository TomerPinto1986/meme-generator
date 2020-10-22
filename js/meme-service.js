'use strict';

console.log('hello service!');

var gNextIdx = 101;
const gImgs = [
    { id: 1, url: './img/1.jpg' },
    { id: 2, url: './img/2.jpg' },
    { id: 3, url: './img/3.jpg' },
    { id: 4, url: './img/4.jpg' },
    { id: 5, url: './img/5.jpg' },
    { id: 6, url: './img/6.jpg' },
    { id: 7, url: './img/7.jpg' },
    { id: 8, url: './img/8.jpg' },
    { id: 9, url: './img/9.jpg' },
    { id: 10, url: './img/10.jpg' },
    { id: 11, url: './img/11.jpg' },
    { id: 12, url: './img/12.jpg' },
    { id: 13, url: './img/13.jpg' },
    { id: 14, url: './img/14.jpg' },
    { id: 15, url: './img/15.jpg' },
    { id: 16, url: './img/16.jpg' },
    { id: 17, url: './img/17.jpg' },
    { id: 18, url: './img/18.jpg' },
]

const gMemes = [];
var gCurrMeme = {};


function getImgUrlFromService(id) {
    const currImg = gImgs.find(img => img.id === id);
    return currImg.url;
}


function getLinesFromService(idx = 101) {
    const lines = [];
    gCurrMeme.lines.map(line => lines.push(line));
    return lines;
}

function addMemeTxt(txt) {
    gCurrMeme.lines.unshift(createNewLine(txt));
}

function getCurrMeme() {
    return gCurrMeme;
}


function createMeme(selectedImgId = 1) {
    gCurrMeme = {
        idx: gNextIdx++,
        selectedImgId,
        selectedLineIdx: 0,
        lines: [],
        focusLineIdx: 0
    }
}


function createNewLine(txt) {
    return {
        txt: txt,
        size: 50,
        font: 'Impact',
        align: 'left',
        color: 'red',
        x: 100,
        y: 50,
    }
}

function changeSizeFont(delta) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].size += delta;
}

function moveTxt(delta) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].y += delta;
}

function getFocusPosition(idx) {
    gCtx.font = `${gCurrMeme.lines[idx].size}px ${gCurrMeme.lines[idx].font}`;
    const focusPosition = {
        width: gCtx.measureText(gCurrMeme.lines[idx].txt).width + 10,
        height: gCurrMeme.lines[idx].size,
        startX: gCurrMeme.lines[idx].x - 5,
        startY: gCurrMeme.lines[idx].y + 5
    }
    return focusPosition
}


function changeFocus() {

    if ((gCurrMeme.focusLineIdx + 1) === gCurrMeme.lines.length) gCurrMeme.focusLineIdx = 0;
    else gCurrMeme.focusLineIdx++;

    return gCurrMeme.focusLineIdx;
}


function checkIfFocusOn(x, y) {
    const lines = getLinesFromService();
    const lineIdx = lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width;
        const txtHeight = line.size;
        return (x > line.x && x < line.x + txtWidth) && (y < line.y && y > line.y - txtHeight);
    });
    if (lineIdx !== -1) gCurrMeme.focusLineIdx = lineIdx;
    return lineIdx;
}