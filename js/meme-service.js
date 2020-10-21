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
    console.log(gCurrMeme.lines);
    console.log(gCurrMeme.focusLineIdx);
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

function changeFocus() {
    gCurrMeme.focusLineIdx = gCurrMeme.focusLineIdx + 1 === gCurrMeme.lines.length ? 0 : gCurrMeme.focusLineIdx++;
}


function checkIfFocusOn(x, y) {
    const lines = getLinesFromService();
    const lineIdx = lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width;
        const txtHeight = line.size;
        return (x > line.x && x < line.x + txtWidth) && (y < line.y && y > line.y - txtHeight);
    });
    if (lineIdx !== -1) gCurrMeme.focusLineIdx = lineIdx;
    console.log(gCurrMeme.lines);
}