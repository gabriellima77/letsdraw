import draw from './draw.js';
import floodFill from './bucketFill.js';
import getColor from './dropper.js';
import drawLine from './line.js';
import fileEvent from './menu.js';

const TOOLS = {
  doc: {
    bars: 'fas fa-bars',
    new: 'far fa-file',
    download: 'fas fa-download'
  },
  pencil: 'fas fa-pencil-alt',
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

window.primaryColor = {r: 0, g: 0, b: 0};
window.secundaryColor = {r: 255, g: 255, b: 255};

const info = {
  endLine: true, imageStack: [], colorType: 'first', radio: 5,
  mouse: [0, 0], currentTool: null, clicked: false
};

const canvas = document.getElementById('canvas');

canvas.onmousedown = (e)=> {
  if(e.buttons === 2) return;
  info.clicked = true;
  info.pointA = [e.layerX, e.layerY];
  if(info.currentTool === 'pencil' || info.currentTool === 'eraser') {
    const tool = info.currentTool;
    const color = (tool === 'pencil')? window.primaryColor: window.secundaryColor;
    info.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    info.ctx.beginPath();
    info.ctx.arc(info.pointA[0], info.pointA[1], info.radio/2, 0, Math.PI * 2);
    info.ctx.fill();
  }
  if(info.currentTool === 'bucket' || info.currentTool === 'dropper') {
    const height = info.height;
    const width = info.width;
    const [x, y] = info.pointA;
    const img = info.ctx.getImageData(0, 0, width, height);
    const startColor = getColor(x, y, width, img);
    const newColor = window.primaryColor;
    if(info.currentTool === 'bucket') {
      floodFill(x, y, width, height, startColor, newColor, img);
      info.ctx.putImageData(img, 0, 0);
    } else {
      window.primaryColor = startColor;
    }
  } else if(info.currentTool === 'line') info.startPoint = [e.layerX, e.layerY];

}

canvas.onmouseout = ()=> {
  info.clicked = false;
  if(info.currentTool === 'eraser') draw('remove');
  if(info.currentTool === 'line') {
    let imageData = info.ctx.getImageData(0, 0, info.width, info.height);
    info.currentImage = imageData;
    info.imageStack.push(imageData);
  }
}

canvas.onmousemove = (e)=> {
  if(info.clicked) {
    info.pointB = [e.layerX, e.layerY];
    if(info.currentTool === 'pencil' || info.currentTool === 'eraser') {
      const currentInfo = {
        tool: info.currentTool, pointA: info.pointA,
        pointB: info.pointB, weight: info.radio,
        ctx: info.ctx
      };
      currentInfo.color = (info.currentTool === 'pencil')? window.primaryColor: window.secundaryColor;
      draw(currentInfo);
    } else if(info.currentTool === 'line') {
      const {startPoint, pointB, radio, ctx} = info;
      const color = window.primaryColor;
      const currentImage = info.currentImage;
      info.ctx.putImageData(currentImage, 0, 0);
      drawLine(startPoint, pointB, color, radio, ctx);
    }
  }
  if(info.currentTool === 'eraser') {
    const currentInfo = {
      tool: info.currentTool, pointA: info.pointA,
      pointB: info.pointB, weight: info.radio,
      ctx: info.ctx, position: [e.clientX, e.clientY]
    };
    currentInfo.color = window.secundaryColor;
    draw(currentInfo);
  } else if(info.currentTool === 'line') {
    canvas.style.cursor = 'crosshair';
  } else {
    canvas.style.cursor = 'initial';
  }
  info.pointA = [e.layerX, e.layerY];
}

canvas.onmouseup = ()=> {
  if(info.clicked) {
    if(info.currentTool === 'line') delete info.startPoint;
    info.clicked = false;
    info.pointA = [0, 0];
    let imageData = info.ctx.getImageData(0, 0, info.width, info.height);
    info.currentImage = imageData;
    info.imageStack.push(imageData);
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
  doc() {
    const fileMenuData = {new: TOOLS.doc.new, save: TOOLS.doc.download, ctx: info.ctx};
    fileEvent(fileMenuData);
  },

  pencil() {
    info.currentTool = 'pencil';
  },

  eraser() {
    info.currentTool = 'eraser';
  },

  bucket() {
    info.currentTool = 'bucket';
    console.log('bucket');
  },

  text() {
    info.currentTool = 'text';
    console.log('text');
  },

  dropper() {
    info.currentTool = 'dropper';
    console.log('dropper');
  },

  mag() {
    info.currentTool = 'mag';
    console.log('mag');
  },

  line() {
    info.currentTool = 'line';
    console.log('line');
  },

  shapes() {
    info.currentTool = 'pencil';
    console.log('shapes');
  }
}

function goBack() {
  const stackLength = info.imageStack.length;
  if(stackLength > 1){
    const lastPosition = stackLength - 1;
    const newCurrent = info.imageStack[lastPosition - 1];
    info.imageStack.pop();
    info.currentImage = newCurrent;
    info.ctx.putImageData(info.currentImage, 0, 0);
  }
}

function createSlider() {
  const form = document.createElement('form');
  const label = document.createElement('label');
  const input = document.createElement('input');
  const p = document.createElement('p');

  input.addEventListener('input', (e)=> {
    p.textContent = e.target.value;
    info.radio = e.target.value;
  });

  form.classList.add('slider-form');
  label.setAttribute('for', 'weight');
  input.id = 'weight';
  input.type = 'range';
  input.value = info.radio;
  input.min = 0;
  input.max = 50;
  p.classList.add('weight-value');
  p.textContent = info.radio;
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
  ctx.lineWidth = info.radio;
  const imageData = ctx.getImageData(0, 0, width, height);
  info.ctx = ctx;
  info.width = width;
  info.height = height;
  info.currentImage = imageData;
  info.imageStack.push(imageData);
}

export default function createToolbar() {
  setInformation();
  const container = document.createElement('div');
  container.id = 'tools-menu';
  for(let key in TOOLS) {
    const currentKey = key;
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      functions[currentKey]();
      info.currentTool = currentKey;
    })
    if(key === 'doc') {
      btn.classList = `tool ${TOOLS[key].bars} bars`;
    } else if(key === 'shapes') {
      btn.classList = `tool ${TOOLS[key].circle} circle`;
    } else btn.classList = `tool ${TOOLS[key]} ${key}`;
    container.appendChild(btn);
  }
  container.appendChild(createSlider());
  return container;
}