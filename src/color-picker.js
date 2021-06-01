let info = {
  width: null, height: null, colorsCtx: null, isClicked: false
};


// More about this function here: https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

function hsvToRgb(h, s, v){
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

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
    const picker = document.querySelector('.picker');
    info.isClicked = true;
    const height = picker.clientHeight;
    const width = picker.clientWidth;
    picker.style.left = (e.layerX - width / 2) + 'px';
    picker.style.top = (e.layerY - height / 2) + 'px';
    window.primaryColor = getColor(e.layerX, e.layerY, info.width, info.height);
  }

  colors.onmousemove = (e)=> {
    if(!info.isClicked) return;
    const picker = document.querySelector('.picker');
    const height = picker.clientHeight;
    const width = picker.clientWidth;
    picker.style.left = (e.layerX - width / 2) + 'px';
    picker.style.top = (e.layerY - height / 2) + 'px';
    window.primaryColor = getColor(e.layerX, e.layerY, info.width, info.height);
  }

  colors.onmouseup = (e)=> {
    info.isClicked = false;
  }

  colors.onmouseleave = (e) => {
    info.isClicked = false;
  }
}

function createPicker(box) {
  const div = document.createElement('div');
  div.classList.add('picker');
  div.style.top = 50 + 'px';
  div.style.left = 50 + 'px';
  box.appendChild(div);
}

function createSlider(box) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.classList.add('slider-colors');
  slider.min = 0;
  slider.max = 360;

  slider.addEventListener('input', changeColor);
  box.appendChild(slider);
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
}

function getColor(x, y, width, height) {
  let img = info.colorsCtx.getImageData(0, 0, width, height);
  const index = (x + y * width) * 4;
  return {
    r: img.data[index],
    g: img.data[index + 1],
    b: img.data[index + 2]
  };
}

function changeColor(e) {
  const h = e.target.value / 360;
  showColors(h);
}

export default function createColorPicker(width, height) {
  const box = document.createElement('div');
  box.classList.add('colors-box');
  const canvas = document.createElement('canvas');
  canvas.classList.add('colors-canvas');
  box.appendChild(canvas);
  info.width = canvas.width = width;
  info.height = canvas.height = height;
  box.style.width = canvas.style.width = width + 'px';
  box.style.height = canvas.style.heith = height + 'px';
  info.colorsCtx = canvas.getContext('2d');
  createPicker(box);
  putEvents(canvas);
  createSlider(box);
  showColors(0);
  return box;
}