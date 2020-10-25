'use strict';
console.log('hello service!');

const MEMES_KEY = 'memes';
const KEYWORDS_KEY = 'keywords'
var gMemes = loadFromStorage(MEMES_KEY);
var gKeywords = { baby: 5, america: 10, movie: 7 };

const gImgs = [
    { id: 1, url: './img/1.jpg', keywords: ['leader', 'politics', 'america', 'determine', 'blonde', 'hair', 'suit', 'poining'] },
    { id: 2, url: './img/2.jpg', keywords: ['dogs', 'animels', 'pupies', 'cute', 'sweet'] },
    { id: 3, url: './img/3.jpg', keywords: ['pupies', 'dogs', 'animels', 'baby', 'sleep', 'sweet'] },
    { id: 4, url: './img/4.jpg', keywords: ['cats', 'sleep', 'animels', 'cute', 'sweet'] },
    { id: 5, url: './img/5.jpg', keywords: ['baby', 'win', 'determine', 'cute', 'sweet', 'blonde'] },
    { id: 6, url: './img/6.jpg', keywords: ['hair', 'tv', 'history', 'person', 'suit'] },
    { id: 7, url: './img/7.jpg', keywords: ['baby', 'surprise', 'cute'] },
    { id: 8, url: './img/8.jpg', keywords: ['hat', 'laughing ', 'blonde'] },
    { id: 9, url: './img/9.jpg', keywords: ['baby', 'laughing ', 'cute', 'sweet'] },
    { id: 10, url: './img/10.jpg', keywords: ['leader', 'politics', 'america', 'laughing'] },
    { id: 11, url: './img/11.jpg', keywords: ['sport', 'kissing', 'awkward', 'funny'] },
    { id: 12, url: './img/12.jpg', keywords: ['tv', 'poining', 'glasses'] },
    { id: 13, url: './img/13.jpg', keywords: ['movie', 'star', 'blonde', 'suit'] },
    { id: 14, url: './img/14.jpg', keywords: ['movie', 'star', 'matrix', 'glasses', 'science fiction'] },
    { id: 15, url: './img/15.jpg', keywords: ['movie', 'actor', 'hair'] },
    { id: 16, url: './img/16.jpg', keywords: ['laughing', 'movie', 'actor', 'science fiction'] },
    { id: 17, url: './img/17.jpg', keywords: ['leader', 'politics', 'russia', 'poining', 'suit'] },
    { id: 18, url: './img/18.jpg', keywords: ['movie', 'toy', 'baby'] },
]

var gCurrMeme = {};
var gNextIdx = 101;


function createNewImage(url, id) {
    gImgs.push({
        id,
        url,
        keywords: []
    });
}



function getImgUrlFromService(id) {
    const currImg = gImgs.find(img => img.id === id);
    return currImg.url;
}

function getFilteredImgs(searchTxt) {
    if (searchTxt === '') return gImgs;
    var imgs = [];
    gImgs.forEach(img => {
        var idx = img.keywords.findIndex(keyword => keyword.includes(searchTxt))
        if (idx !== -1) imgs.push(img);
    });
    return imgs;
}

function getImgs() {
    return gImgs;
}


function getLinesFromService(idx = 101) {
    const lines = [];
    gCurrMeme.lines.map(line => lines.push(line));
    return lines;
}

function addMemeTxt(txt) {
    if (!(gCurrMeme.lines[gCurrMeme.focusLineIdx])) {
        gCurrMeme.lines.unshift(createNewLine(txt));
    } else {
        gCurrMeme.lines[gCurrMeme.focusLineIdx].txt = txt;
    }
}

function addNewLine() {
    if ((!gCurrMeme.lines[gCurrMeme.focusLineIdx]) || (gCurrMeme.lines[gCurrMeme.focusLineIdx].txt === '')) return -1;
    gCurrMeme.focusLineIdx++;
    gCurrMeme.lines[gCurrMeme.focusLineIdx] = createNewLine('');
}

function getCurrMeme() {
    return gCurrMeme;
}


function createMeme(selectedImgId = 1) {
    gCurrMeme = {
        idx: gNextIdx++,
        selectedImgId,
        lines: [],
        focusLineIdx: 0,
        isSaved: false
    }

    if (gMemes) {
        if (gMemes.length === 0) return;
        gCurrMeme.idx = gMemes[gMemes.length - 1].idx + 1;
    }
}

function deleteLetter() {
    if (!gCurrMeme.lines[gCurrMeme.focusLineIdx]) return;
    console.log('not good if no focus');
    if ((gCurrMeme.lines[gCurrMeme.focusLineIdx].txt.length === 0) || !(gCurrMeme.lines[gCurrMeme.focusLineIdx].txt)) return
    gCurrMeme.lines[gCurrMeme.focusLineIdx].txt = gCurrMeme.lines[gCurrMeme.focusLineIdx].txt.slice(0, -1);
}

function addSearchWord(keyword) {
    console.log('here');
    const keywords = loadFromStorage(KEYWORDS_KEY);
    if (keywords) {
        gKeywords = keywords;
    }
    if (getFilteredImgs(keyword).length < 1) return;
    if (!gKeywords[keyword]) {
        gKeywords[keyword] = 1;
    } else gKeywords[keyword]++;
    console.log(gKeywords);
    saveToStorage(KEYWORDS_KEY, gKeywords);
}

function updateKeywords(txt, fontSize) {
    gKeywords[txt] = fontSize / 2;
    saveToStorage(KEYWORDS_KEY, gKeywords);
}

function getKeywords() {
    gKeywords = loadFromStorage(KEYWORDS_KEY) ? loadFromStorage(KEYWORDS_KEY) : gKeywords;
    return gKeywords;
}


function createNewLine(txt) {
    let deltaX = 0;
    let deltaY = 0;
    if (gIsMobile) {
        deltaX = -70;
        deltaY = -100;
    }
    let posX = 0;
    let posY = 0;
    if (gCurrMeme.lines.length === 0) {
        posX = 170 + deltaX;
        posY = 70 + deltaY * 0.2;
    } else if (gCurrMeme.lines.length === 1) {
        posX = 170 + deltaX;
        posY = 410 + deltaY * 1.2;
    } else {
        posX = 170 + deltaX;
        posY = 230 + deltaY / 2;
    }

    return {
        isStroke: false,
        txt: txt,
        size: 50,
        font: 'Impact',
        align: 'left',
        color: 'white',
        x: posX,
        y: posY
    }
}

function changeSizeFont(delta) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].size += delta;
}

function moveTxt(delta) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].y += delta;
}

function getFocusIdx() {
    return gCurrMeme.focusLineIdx || 0;
}

function getFocusPosition() {
    const idx = getFocusIdx();
    const lines = gCurrMeme.lines;
    console.log(lines);
    if (lines.length === 0) return -1;
    gCtx.font = `${lines[idx].size}px ${lines[idx].font}`;
    console.log(gCtx.font);
    const focusPosition = {
        width: gCtx.measureText(lines[idx].txt).width + 10,
        height: lines[idx].size - 0.05 * lines[idx].size,
        startX: lines[idx].x - 5,
        startY: lines[idx].y + 5
    }
    if (lines[idx].align === 'center') {
        focusPosition.startX = focusPosition.startX - (0.5 * focusPosition.width) + 5;
    } else if (lines[idx].align === 'right') focusPosition.startX = focusPosition.startX - (focusPosition.width) + 5;
    return focusPosition
}

function changeMemesPos(x, y) {
    const width = gCtx.measureText(gCurrMeme.lines[gCurrMeme.focusLineIdx].txt).width + 10;
    const height = gCurrMeme.lines[gCurrMeme.focusLineIdx].size;
    gCurrMeme.lines[gCurrMeme.focusLineIdx].x = x - width / 2;
    gCurrMeme.lines[gCurrMeme.focusLineIdx].y = y + height / 2;
}

function changeFocus() {
    if ((gCurrMeme.focusLineIdx + 1) === gCurrMeme.lines.length) gCurrMeme.focusLineIdx = 0;
    else gCurrMeme.focusLineIdx++;
}


function checkIfFocusOn(x, y) {
    const lines = getLinesFromService();
    const lineIdx = lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width;
        const txtHeight = line.size;
        // console.log('current x y: ', x, ' ', y)
        // console.log('startx: ', line.x, 'startY: ', line.y, 'endX: ', line.x + txtWidth, 'endY: ', line.y - txtHeight);
        return (x > line.x && x < line.x + txtWidth) && (y < line.y && y > line.y - txtHeight);
    });
    if (lineIdx !== -1) gCurrMeme.focusLineIdx = lineIdx;
    return lineIdx;
}

function deleteLine() {
    gCurrMeme.lines.splice(gCurrMeme.focusLineIdx, 1);
    if (gCurrMeme.lines.length !== 0) {
        if (gCurrMeme.focusLineIdx === 0) {
            gCurrMeme.focusLineIdx = 0;
        } else gCurrMeme.focusLineIdx--;
        console.log(gCurrMeme.focusLineIdx === 0);
        console.log(gCurrMeme.focusLineIdx);
    }

}


function changeTxtAlign(align) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].align = align;
}

function strokeTxt() {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].isStroke = !gCurrMeme.lines[gCurrMeme.focusLineIdx].isStroke;
}

function saveMeme(currImgData) {
    if (gCurrMeme.isSaved === true) {
        gCurrMeme.imgData = currImgData;
        const memeIdx = gMemes.findIndex(meme => meme.idx === gCurrMeme.idx);
        gMemes[memeIdx] = gCurrMeme;
        console.log(memeIdx);
        console.log(gMemes);
        saveToStorage(MEMES_KEY, gMemes);

    } else {
        console.log(gMemes);
        gCurrMeme.imgData = currImgData;
        if (!gMemes) gMemes = [];
        gMemes.push(gCurrMeme);
        saveToStorage(MEMES_KEY, gMemes);
        gCurrMeme.isSaved = true;
    }
}

function loadMemes() {
    return gMemes;
}

function getTxtOnFocus() {
    if (!gCurrMeme.lines[gCurrMeme.focusLineIdx]) return (!gCurrMeme.lines[gCurrMeme.lines.length - 1].txt);
    return gCurrMeme.lines[gCurrMeme.focusLineIdx].txt;
}

function changeMemeFontColor(color, font) {
    gCurrMeme.lines[gCurrMeme.focusLineIdx].color = color;
    gCurrMeme.lines[gCurrMeme.focusLineIdx].font = font;
}

function checkCurrFocusEmpty() {
    if (!gCurrMeme.lines[gCurrMeme.focusLineIdx]) return;
    if (gCurrMeme.lines[gCurrMeme.focusLineIdx].txt === '') {
        deleteLine();
        return true;
    } else return false;
}


function deleteMeme(idx) {
    const memeIdx = gMemes.findIndex(meme => (meme.idx === idx));
    gMemes.splice(memeIdx, 1);
    saveToStorage(MEMES_KEY, gMemes);
}