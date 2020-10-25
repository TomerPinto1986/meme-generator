'use strict';
console.log('hello controller!');


var gElCanvas;
var gCtx;
var gIsMouseDown = false;
var gIsMove = false;
var gSearchTxt = '';
var gIsMobile = false;
var gIsSaveMode = false;


function onInit() {
    gElCanvas = document.querySelector('.canvas-container canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImgs();
    renderKeywords();
}

function renderKeywords() {
    const keyWords = getKeywords();
    let strHtml = '';
    for (const key in keyWords) {
        if (keyWords[key] < 10) {
            var size = keyWords[key] * 2;
        } else size = 30;
        strHtml += `<li onclick="filterByKeyword('${key}')" style="font-size:${size}px;">${key}</li>`;
    }
    document.querySelector('.filter-options ul').innerHTML = strHtml;
}

function filterByKeyword(txt) {
    const elKeywords = document.querySelectorAll('.filter-options li');
    elKeywords.forEach(keyword => {
        if (keyword.innerText === txt) {
            let wordFontSize = +keyword.style.fontSize.split('p')[0];
            console.log(wordFontSize);
            if (wordFontSize < 50) wordFontSize += 2;
            keyword.style.fontSize = wordFontSize + 'px';
            updateKeywords(txt, wordFontSize);
        }
    });

    gSearchTxt = txt;
    renderImgs();
}

function renderImgs() {
    const imgs = getFilteredImgs(gSearchTxt);
    let strHtml = '';
    imgs.forEach(img => {
        strHtml += `<img class="squre" src="${img.url}" onclick="openMemeEditor(${img.id})">`
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
        console.log(gElCanvas);
        gElCanvas.width = 300;
        gElCanvas.height = 300;
        console.log('sucsses?');
        gIsMobile = true;
    }
    createMeme(imgId);
    const imgUrl = getImgUrlFromService(imgId);
    drawImg(imgUrl);
    putFocusOninput();
}

function drawText() {
    const lines = getLinesFromService();
    if (lines.length === 0) {
        document.querySelector('.control .txt-input').value = '';
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
    document.querySelector('.control .txt-input').value = focusTxt;
}

function onSubmitChanges() {
    if (addNewLine() === -1) return;
    document.querySelector('.control .txt-input').value = '';
    renderMeme();
    putFocusOninput();
}

function putFocusOninput() {
    document.querySelector('.control input').focus();
}

function onKeyUp(el) {
    addMemeTxt(el.value);
    renderMeme();
}

function onColorFontSubmit(ev) {
    ev.preventDefault();
    const color = document.querySelector('.control .color').value;
    const font = document.querySelector('.control .color-palete').value;
    changeMemeFontColor(color, font);
    renderMeme();
}



function drawImg(imgUrl) {
    const img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText();
        putFocus();
    }
}

function putFocus() {
    const focusPos = getFocusPosition();
    if (focusPos === -1) return;
    if (!gIsSaveMode) {
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
    putFocusOninput();

}

function handleMove(ev) {
    ev.preventDefault();
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
    if (!memes) return;
    elGallery.innerHTML = '';
    memes.forEach(meme => {
        var image = new Image();
        image.src = meme.imgData;
        elGallery.appendChild(image);

    });
    const elMemes = elGallery.querySelectorAll('img');
    elMemes.forEach((elMeme, idx) => {
        elMeme.classList.add(`meme${idx}`);
        elMeme.onclick = function showMeme() {
            document.querySelector('.main-content .gallery').style.display = 'none';
            document.querySelector('.main-container .filter').style.display = 'none';
            document.querySelector('.main-container .memes-gallery').style.display = 'none';
            document.querySelector('.meme-editor').style.display = 'flex';
            document.querySelector('.download-save a:last-child').style.display = 'block';
            gCurrMeme = loadMemes()[idx];
            drawImg(gCurrMeme.imgData);
            putFocusOninput();
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
    putFocusOninput();
}

function onStroke() {
    strokeTxt();
    renderMeme();
}

function onDownloadMeme(elLink) {

    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'meme.jpg'
}


function onSaveMeme() {
    const imgData = gElCanvas.toDataURL('image/png');
    saveMeme(imgData)
    openGallery()
}

function onDeleteMeme() {
    deleteMeme(gCurrMeme.idx);
    openGallery()

}

function openGallery() {
    document.querySelector('.main-content .gallery').style.display = 'grid';
    document.querySelector('.main-container .filter').style.display = 'flex';
    document.querySelector('.meme-editor').style.display = 'none';
    document.querySelector('.main-content .memes-gallery').style.display = 'none';
    renderKeywords();
    renderImgs();
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