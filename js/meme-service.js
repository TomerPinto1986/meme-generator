'use strict';

console.log('hello service!');

var gNextIdx = 101;
const gImgs = [
    { id: 1, url: 'img/1.jpg' },
    { id: 2, url: 'img/2.jpg' },
    { id: 3, url: 'img/3.jpg' },
    { id: 4, url: 'img/4.jpg' },
    { id: 5, url: 'img/5.jpg' },
    { id: 6, url: 'img/6.jpg' },
]
const gMeme = createMeme();


function getImgUrlFromService(id) {
    const currImg = gImgs.find(img => img.id === id);
    return currImg.url;
}


function getLinesFromService(idx = 101) {
    const lines = [];
    gMeme.lines.map(line => lines.unshift(line));
    return lines;
}





function createMeme(selectedImgId = 1) {
    return {
        idx: gNextIdx++,
        selectedImgId,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Start The Fun',
            size: 40,
            font: 'Impact',
            align: 'left',
            color: 'red',
        }]
    }
}