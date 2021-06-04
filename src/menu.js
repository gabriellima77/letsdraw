function saveEvent() {
  const canvas = document.querySelector('#canvas');
  const imgURI = canvas.toDataURL('img/png');
  const a = document.createElement('a');
  a.href = imgURI;
  a.download = 'image';
  a.click();
}

function createFileMenu(data) {
  const box = document.createElement('div');
  const newBtn = document.createElement('button');
  const saveBtn = document.createElement('button');

  newBtn.classList = `newFile ${data.new}`;
  saveBtn.classList = `saveFile ${data.save}`
  box.classList.add('file-menu');

  saveBtn.addEventListener('click', saveEvent);

  box.appendChild(newBtn);
  box.appendChild(saveBtn);

  return box;
}

export default function fileEvent(data) {
  const body = document.querySelector('body');
  const hasBox = document.querySelector('.file-menu');
  let box;
  
  if(!hasBox) {
    box = createFileMenu(data);
    body.appendChild(box);
  } else {
    if(hasBox.classList.contains('disabled')) {
      hasBox.classList.remove('disabled');
    } else hasBox.classList.add('disabled');
  }
}