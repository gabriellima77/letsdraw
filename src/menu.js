const doc = {
  bars: ['fas', 'fa-bars'],
  new: ['far', 'fa-file'],
  download: ['fas', 'fa-download']
};

const resetCanvas = (cover)=> {
  const body = document.querySelector('body');

  window.currentTool = null;
  window.secundaryColor = {r: 255, g: 255, b: 255};
  window.imageStack = [window.imageStack[0]];
  window.currentImage = window.imageStack[0];
  window.ctx.putImageData(window.currentImage, 0, 0);
  body.removeChild(cover);
}

const newImageEvent = ()=> {
  const body = document.querySelector('body');

  const cover = document.createElement('div');
  const modal = document.createElement('div');
  const bar = document.createElement('div');
  const h3 = document.createElement('h3');
  const text = document.createElement('p');
  const btnsBox = document.createElement('div'); 
  const cancel = document.createElement('button');
  const confirm = document.createElement('button');

  cancel.addEventListener('click', ()=> body.removeChild(cover));
  confirm.addEventListener('click', ()=> resetCanvas(cover));

  cover.classList.add('cover');
  modal.classList.add('modal');
  bar.classList.add('bar');
  btnsBox.classList.add('btnsBox');
  cancel.classList.add('cancel');
  confirm.classList.add('confirm');

  h3.textContent = 'New Image';
  text.textContent = 'Are you sure about it? Everything will be lost.';
  cancel.textContent = 'Cancel';
  confirm.textContent = 'Confirm';
  
  cover.appendChild(modal);
  btnsBox.appendChild(cancel);
  btnsBox.appendChild(confirm);
  modal.appendChild(bar);
  modal.appendChild(h3);
  modal.appendChild(text);
  modal.appendChild(btnsBox);
  body.appendChild(cover);
}

function saveEvent() {
  const canvas = document.querySelector('#canvas');
  const imgURI = canvas.toDataURL('img/png');
  const a = document.createElement('a');
  a.href = imgURI;
  a.download = 'image';
  a.click();
}

function createFileMenu() {
  const box = document.createElement('div');
  const newBtn = document.createElement('button');
  const saveBtn = document.createElement('button');

  newBtn.classList.add('newFile');
  doc.new.forEach((clas)=> { newBtn.classList.add(clas) });

  saveBtn.classList.add('saveFile');
  doc.download.forEach((clas)=> { saveBtn.classList.add(clas) });
  box.classList.add('file-menu');

  saveBtn.addEventListener('click', saveEvent);
  newBtn.addEventListener('click', newImageEvent);

  box.appendChild(newBtn);
  box.appendChild(saveBtn);

  return box;
}

function fileEvent() {
  const body = document.querySelector('body');
  let box = document.querySelector('.file-menu');
  
  if(!box) {
    box = createFileMenu();
    body.appendChild(box);
  } else {
    box.classList.toggle('disabled');
  }
}

export default function createBtn() {
  const btn = document.createElement('button');
  btn.addEventListener('click', ()=> {
    const main = document.querySelector('main');
    const header = document.querySelector('header');

    // Removing remaining textArea
    const hasTextArea = document.querySelector('.textA');
    if(hasTextArea) main.removeChild(hasTextArea);

    // Removing infoBox
    const hasInfoMenu = document.querySelector('.infoMenu');
    if(hasInfoMenu) header.removeChild(hasInfoMenu);

    // Removing another class active
    const hasActive = document.querySelector('.tool.active');
    if(hasActive) hasActive.classList.remove('active');
    btn.classList.add('active');
    fileEvent();
    window.currentTool = null;
  });
  btn.classList.add('menuBtn');
  doc.bars.forEach((clas)=> { btn.classList.add(clas) });
  return btn;
}