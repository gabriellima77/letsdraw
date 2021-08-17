const info = {
  width: null, height: null, colorsCtx: null, isClicked: false
};

const classList = ['fas', 'fa-eye-dropper'];

// More about this function here: https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

function rgbToHsv(r, g, b){
  r = r/255, g = g/255, b = b/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if(max == min){
      h = 0; // achromatic
  }else{
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h, s, v];
}

function hsvToRgb(h, s, v){
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch(i % 6){
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }

  return [r * 255, g * 255, b * 255];
}

function putEvents(colors) {
  colors.onmousedown = (e)=> {
    if(e.which === 3) return;
    if(
      e.layerX < 0 || e.layerY < 0 ||
      e.layerX > info.width || e.layerY > info.height
    ) return;

    const picker = document.querySelector('.picker');
    const side = picker.scrollHeight;
    info.isClicked = true;
    const x = e.layerX - side/2;
    const y = e.layerY - side/2;

    picker.style.left = x + 'px';
    picker.style.top = y + 'px';
    const color = getColor(x, y);
    window.primaryColor = color;
    changeValues(window.primaryColor);
    info.pickerPoint = {x, y};

    // Changing text color
    const hasTextArea = document.querySelector('.textA');
    if(hasTextArea) hasTextArea.style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  colors.onmousemove = (e)=> {
    if(!info.isClicked || e.which === 3) return;

    if(
      e.layerX < 0 || e.layerY < 0 ||
      e.layerX > info.width || e.layerY > info.height
    ) return;

    const picker = document.querySelector('.picker');
    const side = picker.scrollHeight;
    const x = e.layerX - side/2;
    const y = e.layerY - side/2;

    picker.style.left = x + 'px';
    picker.style.top = y + 'px';
    const color = getColor(x, y)
    window.primaryColor = color;
    changeValues(window.primaryColor);
    info.pickerPoint = {x, y};

    // Changing text color
    const hasTextArea = document.querySelector('.textA');
    if(hasTextArea) hasTextArea.style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  colors.onmouseup = ()=> {
    info.isClicked = false;
  }

  colors.onmouseleave = () => {
    info.isClicked = false;
  }
}

function createPicker(box) {
  const div = document.createElement('div');
  div.classList.add('picker');
  div.style.top = (info.height - 15) + 'px';
  div.style.left = 0 + 'px';

  info.pickerPoint = {
    x: 0,
    y: info.height - 1
  };

  box.appendChild(div);
}

function getColorInfoBox() {
  const color = window.primaryColor;
  const box = document.createElement('div');

  box.classList.add('color-value');
  box.textContent = `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;
  box.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  return box;
}

function changeValues(color) {
  const box = document.querySelector('.color-value');
  box.textContent = `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;
  box.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`
}

function createSlider() {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.classList.add('slider-colors');
  slider.min = 0;
  slider.max = 360;
  slider.value = 0;

  slider.style.width = info.height + 'px';

  slider.addEventListener('input', changeColor);
  return slider;
}

function showColors(h) {
  info.colorsCtx.fillStyle = 'white';
  info.colorsCtx.fillRect(0, 0, info.width, info.height);
  const img = info.colorsCtx.getImageData(0, 0, info.width, info.height);
  for(let x = 0; x < info.width; x++) {
    let s = x / info.width;
    for(let y = 0; y < info.height; y++) {
      const index = (x + y * info.width) * 4;
      let v = (info.width - y) / info.height;
      let [r, g, b] = hsvToRgb(h, s, v).map((color)=> Math.floor(color));
      img.data[index] = r; //red
      img.data[index + 1] = g; //green
      img.data[index + 2] = b; //blue
    }
  }
  info.colorsCtx.putImageData(img, 0, 0);
  window.primaryColor = {r: 0, g:0, b: 0};
}

function getColor(s, v) {
  if(s < 0) s = 0;
  if(v < 0) v = 0;
  const slider = document.querySelector('.slider-colors');
  const hsv = [
    slider.value/360,
    s/info.width,
    1 - (v/info.height)
  ];
  const rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
  return {
    r: Math.ceil(rgb[0]),
    g: Math.ceil(rgb[1]),
    b: Math.ceil(rgb[2])
  };
}

function changeColor(e) {
  const h = e.target.value / 360;
  showColors(h);
  window.primaryColor = getColor(info.pickerPoint.x, info.pickerPoint.y);
  changeValues(window.primaryColor);
}

function dropperEvent(hsv, color) {
  const sliderColors = document.querySelector('.slider-colors');
  const colorsCanvas = document.querySelector('.colors-canvas');
  const picker = document.querySelector('.picker');
  const {width, height} = colorsCanvas;
  const value = hsv[0] * 360;
  console.log({x: hsv[1] * width, y: height - (hsv[2] * height) - 7.5});
  picker.style.left = `${(hsv[1] * width) - 7.5}px`;
  picker.style.top = `${height - (hsv[2] * height) - 7.5}px`;
  sliderColors.value = value;
  showColors(hsv[0]);
  changeValues(color);
}

class Dropper{

  constructor() {
    this._putEvents();
  }

  getColor(point) {
    const {width, height} = window.canvas;
    const img = window.ctx.getImageData(0, 0, width, height);
    const index = (point.x + point.y * width) * 4;
    const color = { 
      r: img.data[index],
      g: img.data[index + 1],
      b: img.data[index + 2]
    }
    const hsv = rgbToHsv(color.r, color.g, color.b);
    dropperEvent(hsv, color);
    window.primaryColor = color;
  }

  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const body = document.querySelector('body');
      const main = document.querySelector('main');
      const header = document.querySelector('header');
      
      // Closing fileMenu
      const hasFileMenu = document.querySelector('.file-menu');
      if(hasFileMenu) body.removeChild(hasFileMenu);
  
      // Removing remaining textArea
      const hasTextArea = document.querySelector('.textA');
      if(hasTextArea) main.removeChild(hasTextArea);
  
      // Removing infoBox
      const hasInfoMenu = document.querySelector('.infoMenu');
      if(hasInfoMenu) header.removeChild(hasInfoMenu);

      // Removing another class active
      const hasActive = document.querySelector('.menuBtn.active') ||
      document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'dropper';
    });
    btn.classList.add('tool');
    classList.forEach((clas)=> {btn.classList.add(clas)});
    return btn;
  }

  _putEvents() {
    window.canvas.addEventListener('mousedown', (e)=> { this._mouseClick(e) });
    window.canvas.addEventListener('mousemove', (e)=> { this._mouseMove(e) });
    window.canvas.addEventListener('mouseup', ()=> { this._mouseUp() });
  }

  _mouseClick(e) {
    if(e.buttons === 2 || window.currentTool !== 'dropper') return;
    this.isClicked = true;
    const point = {x: e.layerX, y: e.layerY};
    this.getColor(point);
  }

  _mouseMove(e) {
    if(window.currentTool !== 'dropper') return;
    else {
      window.canvas.style.cursor = 'crosshair';
      const point = {x: e.layerX, y: e.layerY};
      if(this.isClicked) this.getColor(point);
    }
    window.canvas.style.cursor = 'crosshair';
  }

  _mouseUp(){
    this.isClicked = false;
  }
}

function createColorPicker(width, height) {
  const container = document.createElement('div');
  const box = document.createElement('div');
  const canvas = document.createElement('canvas');

  container.classList.add('colors-container');
  box.classList.add('colors-box');
  canvas.classList.add('colors-canvas');

  info.width = canvas.width = width;
  info.height = canvas.height = height;
  box.style.width = canvas.style.width = width + 'px';
  box.style.height = canvas.style.heith = height + 'px';
  info.colorsCtx = canvas.getContext('2d');

  box.appendChild(canvas);
  createPicker(box);
  putEvents(canvas);
  const slider = createSlider();
  showColors(0);
  container.appendChild(box);
  container.appendChild(slider);
  return container;
}

const getColorBtns = async ()=> {
  const response = await fetch('./colors.json');
  const { mainColors } = await response.json();
  const { dark, light } = mainColors;

  const clickEvent = (color)=> {
    const hsv = rgbToHsv(color.r, color.g, color.b);
    dropperEvent(hsv, color);
    window.primaryColor = color;

    // Changing text color
    const hasTextArea = document.querySelector('.textA');
    if(hasTextArea) hasTextArea.style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  const createBtn = (color)=> {
    const btn = document.createElement('button');
    btn.classList.add('colorBtn');

    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    btn.addEventListener('click', ()=> clickEvent({r, g, b}));
    btn.style.background = color;
    return btn;
  }

  const lightBtns = light.map((color)=> createBtn(color));
  const darkBtns = dark.map((color)=> createBtn(color));
  return [...lightBtns, ...darkBtns];
}

const getColorsGrid = ()=> {
  const colorsGrid = document.createElement('div');
  colorsGrid.classList.add('colors-grid');

  getColorBtns()
    .then((colorBtns)=> {
      colorBtns.forEach(btn => colorsGrid.appendChild(btn));
    });
  return colorsGrid;
}

const dropper = new Dropper();

export { createColorPicker, getColorInfoBox, dropper, getColorsGrid };