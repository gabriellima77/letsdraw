import bucket from './bucketFill.js';
import { dropper } from './color-picker.js';
import eraser from './eraser.js';
import pencil from './pencil.js';
import createBtn from './menu.js';
import text from './text.js';
// import zoom from './zoom.js';
import shapes from './shapes.js';

window.currentTool = null;
window.primaryColor = {r: 0, g: 0, b: 0};
window.secundaryColor = {r: 255, g: 255, b: 255};
window.radius = 5;
window.imageStack = [];

const info = {
  endLine: true, colorType: 'first',
  mouse: [0, 0], clicked: false
};

const canvas = document.getElementById('canvas');

canvas.onmousemove = ()=> {
  canvas.style.cursor = 'initial';
}

window.onkeydown = (e)=> {
  if(e.key === 'Control') info.ctrlHold = true;
  if(e.key === 'z' && info.ctrlHold) goBack();
  else return;
}

window.onkeyup = (e)=> {
  if(e.key === 'Control') info.ctrlHold = false;
}

function goBack() {
  const stackLength = window.imageStack.length;
  if(stackLength > 1){
    const lastPosition = stackLength - 1;
    const newCurrent = window.imageStack[lastPosition - 1];
    window.imageStack.pop();
    window.currentImage = newCurrent;
    info.ctx.putImageData(window.currentImage, 0, 0);
  }
}

function createSlider() {
  const form = document.createElement('form');
  const label = document.createElement('label');
  const input = document.createElement('input');
  const p = document.createElement('p');

  input.addEventListener('input', (e)=> {
    p.textContent = e.target.value;
    window.radius = +e.target.value;
  });

  form.classList.add('slider-form');
  label.setAttribute('for', 'weight');
  input.id = 'weight';
  input.type = 'range';
  input.value = window.radius;
  input.min = 1;
  input.max = 50;
  p.classList.add('weight-value');
  p.textContent = window.radius;
  label.textContent = 'line weight';
  
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(p);
  return form;
}

function setInformation() {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = window.radius;
  const imageData = ctx.getImageData(0, 0, width, height);
  info.ctx = ctx;
  window.canvasW = width;
  window.canvasH = height;
  window.currentImage = imageData;
  window.imageStack.push(imageData);
}

function putBtns(container) {
  eraser.init(canvas, info.ctx);
  pencil.init(info.ctx, canvas, window.canvasW, window.canvasH);
  dropper.init(canvas, info.ctx);
  bucket.init(canvas, info.ctx);
  shapes.init(canvas, info.ctx);
  text.init(canvas, info.ctx);
  const btns = [
    createBtn(),
    pencil.createBtn(),
    eraser.createBtn(),
    bucket.createBtn(),
    dropper.createBtn(),
    text.createBtn(),
    // zoom.createBtn(),
    shapes.createBtn('line'),
    shapes.createBtn('shapes')
  ];

  btns.forEach((btn)=> { container.appendChild(btn) });
}

export default function createToolbar() {
  setInformation();

  const container = document.createElement('div');
  container.id = 'tools-menu';
  
  putBtns(container);
  container.appendChild(createSlider());
  
  return container;
}