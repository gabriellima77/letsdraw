import Bucket from './bucketFill.js';
import { dropper } from './color-picker.js';
import Eraser from './eraser.js';
import Pencil from './pencil.js';
import createBtn from './menu.js';
import Text from './text.js';
// import zoom from './zoom.js';
import Shapes from './shapes.js';


window.canvas.onmousemove = ()=> {
  if(
    !window.currentTool ||
    window.currentTool.includes('pencil') 
  ) window.canvas.style.cursor = 'initial';
}

window.onkeydown = (e)=> {
  if(e.key === 'Control') window.ctrlHold = true;
  if(e.key === 'z' && window.ctrlHold) goBack();
  else return;
}

window.onkeyup = (e)=> {
  if(e.key === 'Control') window.ctrlHold = false;
}

function goBack() {
  const stackLength = window.imageStack.length;
  if(stackLength > 1){
    const lastPosition = stackLength - 1;
    const newCurrent = window.imageStack[lastPosition - 1];
    window.imageStack.pop();
    window.currentImage = newCurrent;
    window.ctx.putImageData(window.currentImage, 0, 0);
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

function putBtns(container) {
  const eraser = new Eraser();
  const pencil = new Pencil();
  const bucket = new Bucket();
  const shapes = new Shapes();
  const text = new Text();
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

  const container = document.createElement('div');
  container.id = 'tools-menu';
  
  putBtns(container);
  container.appendChild(createSlider());
  
  return container;
}