import bucket from './bucketFill.js';
import { dropper } from './color-picker.js';
import drawLine from './line.js';
import eraser from './eraser.js';
import pencil from './pencil.js';
import createBtn from './menu.js';

const TOOLS = {
  doc: {
    bars: 'fas fa-bars',
    new: 'far fa-file',
    download: 'fas fa-download'
  },
  pencil: {
    original: 'fas fa-pencil-alt pencil-1',
    other: 'pencil-2'
  },
  eraser: 'fas fa-eraser',
  bucket: 'fas fa-fill-drip',
  text: '',
  dropper: 'fas fa-eye-dropper',
  mag: 'fas fa-search',
  line: '',
  shapes: { 
    circle: 'far fa-circle',
    square: 'far fa-square',
    triangle: 'far fa-triangle'
  }
}


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

canvas.onmousedown = (e)=> {
  if(e.buttons === 2) return;
  info.clicked = true;
  info.pointA = [e.layerX, e.layerY];
  if(window.currentTool === 'line') info.startPoint = [e.layerX, e.layerY];
}

canvas.onmouseout = ()=> {
  info.clicked = false;
  if(window.currentTool === 'line') {
    let imageData = info.ctx.getImageData(0, 0, window.canvasW, window.canvaH);
    window.currentImage = imageData;
    window.imageStack.push(imageData);
  }
}

canvas.onmousemove = (e)=> {
  if(info.clicked) {
    info.pointB = [e.layerX, e.layerY];

    if(window.currentTool === 'line') {
      const {startPoint, pointB, ctx} = info;
      const radius = window.radius;
      const color = window.primaryColor;
      const currentImage = window.currentImage;
      info.ctx.putImageData(currentImage, 0, 0);
      drawLine(startPoint, pointB, color, radius, ctx);
    }
  }

  if(window.currentTool === 'line') {
    canvas.style.cursor = 'crosshair';
  } else {
    canvas.style.cursor = 'initial';
  }
  info.pointA = [e.layerX, e.layerY];
}

canvas.onmouseup = ()=> {
  if(info.clicked && window.currentTool === 'line') {
    delete info.startPoint;
    info.clicked = false;
    info.pointA = [0, 0];
    let imageData = info.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
    window.currentImage = imageData;
    window.imageStack.push(imageData);
  }
}

window.onkeydown = (e)=> {
  if(e.key === 'Control') info.ctrlHold = true;
  if(e.key === 'z' && info.ctrlHold) goBack();
  else return;
}

window.onkeyup = (e)=> {
  if(e.key === 'Control') info.ctrlHold = false;
}

const functions = {
  text() {
    window.currentTool = 'text';
    console.log('text');
  },

  mag() {
    window.currentTool = 'mag';
    console.log('mag');
  },

  line() {
    window.currentTool = 'line';
    console.log('line');
  },

  shapes() {
    window.currentTool = 'pencil';
    console.log('shapes');
  }
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
  const width = canvas.width = canvas.scrollWidth;
  const height = canvas.height = canvas.scrollHeight;
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

export default function createToolbar() {
  setInformation();
  eraser.init(canvas, info.ctx);
  pencil.init(info.ctx, canvas, window.canvasW, window.canvasH);
  dropper.init(canvas, info.ctx);
  bucket.init(canvas, info.ctx);
  const container = document.createElement('div');
  container.id = 'tools-menu';
  for(let key in TOOLS) {
    if(key === 'eraser') {
      const btn = eraser.createBtn();
      container.appendChild(btn);
      continue;
    } else if(key === 'pencil') {
      const btn = pencil.createBtn();
      container.appendChild(btn);
      continue;
    } else if(key === 'dropper') {
      const btn = dropper.createBtn();
      container.appendChild(btn);
      continue;
    } else if(key === 'bucket') {
      const btn = bucket.createBtn();
      container.appendChild(btn);
      continue;
    }
    const currentKey = key;
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      functions[currentKey]();
      window.currentTool = currentKey;
    });
    if(key === 'doc') {
      const btn = createBtn();
      container.appendChild(btn);
      continue;
    } else if(key === 'shapes') {
      btn.classList = `tool ${TOOLS[key].circle} circle`;
    } else btn.classList = `tool ${TOOLS[key]} ${key}`;
    container.appendChild(btn);
  }
  container.appendChild(createSlider());
  return container;
}