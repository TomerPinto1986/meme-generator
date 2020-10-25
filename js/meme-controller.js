'use strict';
console.log('hello controller!');


var gCanvas;
var gCtx;
var gIsMouseDown = false;
var gIsMove = false;
var gSearchTxt = '';
var gIsMobile = false;
var gIsSaveMode = false;


function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    renderKeywords();
}

function renderKeywords() {
    const keyWords = getKeywords();
    let strHtml = '';
    for (const key in keyWords) {
        if (keyWords[key] < 10) {
            var size = keyWords[key] * 3.5;
        } else size = 30;
        strHtml += `<li onclick="filterByKeyword('${key}')" style="font-size:${size}px;">${key}</li>`;
    }
    document.querySelector('.filter-options ul').innerHTML = strHtml;
}

function filterByKeyword(txt) {
    const elKeywords = document.querySelectorAll('.filter-options li');
    elKeywords.forEach(keyword => {
        if (keyword.innerText === txt) {
            console.log(keyword.style.fontSize);
            let wordFontSize = +keyword.style.fontSize.slice(0, 2);
            console.log(wordFontSize);
            if (wordFontSize < 50) wordFontSize += 2;
            keyword.style.fontSize = wordFontSize + 'px';
        }
    });
    gSearchTxt = txt;
    renderImgs();
}

function renderImgs() {
    const imgs = getFilteredImgs(gSearchTxt);
    let strHtml = '';
    imgs.forEach((img, idx) => {
        strHtml += `<img class="squre" src="${img.url}" onclick="openMemeEditor(${idx+1})">`
    });
    document.querySelector('.gallery').innerHTML = strHtml;
}

function renderMeme() {
    const currMeme = getCurrMeme();
    drawImg(getImgUrlFromService(currMeme.selectedImgId));
}


function openMemeEditor(imgId) {
    document.querySelector('.main-content .gallery').style.display = 'none';
    document.querySelector('.main-container .filter').style.display = 'none';
    document.querySelector('.meme-editor').style.display = 'flex';
    if (document.querySelector('.canvas-container').getBoundingClientRect().width < 500) {
        console.log(gCanvas);
        gCanvas.width = 300;
        gCanvas.height = 300;
        console.log('sucsses?');
        gIsMobile = true;
    }
    createMeme(imgId);
    const imgUrl = getImgUrlFromService(imgId);
    drawImg(imgUrl);
}

function drawText() {
    const lines = getLinesFromService();
    if (lines.length === 0) {
        document.querySelector('#text-input').value = '';
        return;
    }
    lines.forEach(line => {
        gCtx.fillStyle = `${line.color}`;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = `${line.align}`;
        gCtx.fillText(line.txt, line.x, line.y);
        if (line.isStroke) gCtx.strokeText(line.txt, line.x, line.y);
    });
    const focusTxt = getTxtOnFocus();
    if (!focusTxt) return;
    document.querySelector('#text-input').value = focusTxt;
}

function onSubmitChanges() {
    if (addNewLine() === -1) return;
    document.querySelector('#text-input').value = '';
    renderMeme();
}

function onKeyUp(el) {
    addMemeTxt(el.value);
    renderMeme();
}

function onColorFontSubmit(ev) {
    ev.preventDefault();
    const color = document.querySelector('#toggle-color').value;
    const font = document.querySelector('#font-select').value;
    changeMemeFontColor(color, font);
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
    if (focusPos === -1) return;
    console.log(gIsSaveMode);
    if (!gIsSaveMode) {
        console.log(gIsSaveMode);
        drawRect(focusPos.width, focusPos.height, focusPos.startX, focusPos.startY);
        return;
    }
    gIsSaveMode = false;
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

function handleMove(ev) {
    ev.preventDefault();
    console.log(gIsMove);
    if (!gIsMove) return;
    if (ev.touches) {
        console.log('touch moveeee');
        const rect = ev.target.getBoundingClientRect();
        const x = ev.targetTouches[0].pageX - rect.left;
        const y = ev.targetTouches[0].pageY - rect.top;
        changeMemesPos(x, y);
        renderMeme();
    } else {
        console.log('got here');
        changeMemesPos(ev.offsetX, ev.offsetY);
        renderMeme();
    }
}

function checkFocus(ev) {
    if (checkCurrFocusEmpty()) renderMeme();
    gIsMouseDown = true;
    if (ev.touches) {
        const rect = ev.target.getBoundingClientRect();
        console.log('rect left: ', rect.left);
        console.log('rect top: ', rect.top);
        console.log('x touches: ', ev.targetTouches[0].pageX);
        console.log('y touches: ', ev.targetTouches[0].pageY);
        const x = ev.targetTouches[0].pageX - rect.left;
        const y = ev.targetTouches[0].pageY - rect.top;
        const idx = checkIfFocusOn(x, y);
        if (idx === -1) {
            gIsSaveMode = true;
            renderMeme();
            return;
        }
        gIsMove = gIsMouseDown;
        renderMeme();
        return;
    }
    const { offsetX, offsetY } = ev;
    const idx = checkIfFocusOn(offsetX, offsetY);
    if (idx === -1) {
        gIsSaveMode = true;
        renderMeme();
        return;
    }
    console.log(gIsMouseDown);
    gIsMove = gIsMouseDown;
    renderMeme();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
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

function onSearch(ev) {
    if (ev.key === 'Backspace') {
        gSearchTxt = gSearchTxt.substring(0, gSearchTxt.length - 1);
        renderImgs();
        return;
    } else if (ev.key === 'Enter') {
        addSearchWord(gSearchTxt);
        return;
    } else if (ev.key.length > 1) return;
    gSearchTxt = document.querySelector('.filter .search').value + ev.key;
    renderImgs();
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
    const elMemes = elGallery.querySelectorAll('img');
    console.log(elMemes);
    elMemes.forEach((meme, idx) => {
        meme.classList.add(`meme${idx}`);
        meme.onclick = function showMeme() {
            document.querySelector('.main-content .gallery').style.display = 'none';
            document.querySelector('.main-container .filter').style.display = 'none';
            document.querySelector('.main-container .memes-gallery').style.display = 'none';
            var elMemeEditor = document.querySelector('.meme-editor');
            elMemeEditor.style.display = 'flex';
            console.log(meme.src.split(',')[1]);
            createNewImage(meme.src, `meme${idx}`)
            createMeme(`meme${idx}`)
            gCtx.drawImage(meme, 0, 0, gCanvas.width, gCanvas.height);
        }

    });
}


function drawRect(width, height, x, y) {
    gCtx.beginPath()
    gCtx.rect(x, y, width, -height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}

function onDeleteLine() {
    deleteLine();
    renderMeme();
}

function onStroke() {
    strokeTxt();
    renderMeme();
}

function onDownloadMeme(elLink) {
    // gIsSaveMode = true;
    // renderMeme();
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'meme.jpg'
}


function onSaveMeme(elLink) {
    // gIsSaveMode = true;
    // renderMeme();
    const imgData = gCanvas.toDataURL('image/png');
    saveMeme(imgData)
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