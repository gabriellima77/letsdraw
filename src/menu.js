const doc = {
  bars: ['fas', 'fa-bars'],
  new: ['far', 'fa-file'],
  download: ['fas', 'fa-download']
};

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
    const hasActive = document.querySelector('.tool.active');
    if(hasActive) hasActive.classList.remove('active');
    btn.classList.add('active');
    fileEvent();
    window.currentTool = null;
  });
  btn.classList.add('tool');
  doc.bars.forEach((clas)=> { btn.classList.add(clas) });
  return btn;
}