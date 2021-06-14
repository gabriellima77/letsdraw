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
    info.isClicked = true;
    const height = picker.clientHeight;
    const width = picker.clientWidth;
    picker.style.left = (e.layerX - width / 2) + 'px';
    picker.style.top = (e.layerY - height / 2) + 'px';
    window.primaryColor = getColor(e.layerX, e.layerY);
    console.log(window.primaryColor);
    changeValues(window.primaryColor);
    info.pickerPoint = {
      x: e.layerX,
      y: e.layerY
    };
  }

  colors.onmousemove = (e)=> {
    if(!info.isClicked || e.which === 3) return;

    if(
      e.layerX < 0 || e.layerY < 0 ||
      e.layerX > info.width || e.layerY > info.height
    ) return;

    const picker = document.querySelector('.picker');
    const height = picker.clientHeight;
    const width = picker.clientWidth;
    picker.style.left = Math.floor(e.layerX - width / 2) + 'px';
    picker.style.top = Math.floor(e.layerY - height / 2) + 'px';
    window.primaryColor = getColor(e.layerX, e.layerY);
    console.log(window.primaryColor)
    changeValues(window.primaryColor);
    info.pickerPoint = {
      x: e.layerX,
      y: e.layerY
    };
  }

  colors.onmouseup = ()=> {
    info.isClicked = false;
  }

  colors.onmouseleave = (e) => {
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

function createVBox(color) {
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
  slider.style.left = -(info.height/3) + 'px';

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

  picker.style.left = `${hsv[1] * width}px`;
  picker.style.top = `${height - (hsv[2] * height) - 7.5}px`;
  sliderColors.value = value;
  showColors(hsv[0]);
  changeValues(color);
}

class Dropper{

  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx
    this._putEvents();
  }

  getColor(point) {
    const {width, height} = this.canvas;
    const img = this.ctx.getImageData(0, 0, width, height);
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
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'dropper';
    });
    btn.classList.add('tool');
    classList.forEach((clas)=> {btn.classList.add(clas)});
    return btn;
  }

  _putEvents() {
    this.canvas.addEventListener('mousedown', (e)=> { this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=> { this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=> { this._mouseUp() });
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
      this.canvas.style.cursor = 'crosshair';
      const point = {x: e.layerX, y: e.layerY};
      if(this.isClicked) this.getColor(point);
    }
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
  const color = window.primaryColor;
  const infoBox = createVBox(color);
  container.appendChild(infoBox);
  return container;
}

const dropper = new Dropper();

export { createColorPicker,  dropper };