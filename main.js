import createToolbar from './src/tools.js';
import { createColorPicker, getColorInfoBox, getColorsGrid } from './src/color-picker.js';

function init() {
  let isResizing = false;
  const canvas = document.getElementById('canvas');
  const container = document.querySelector('#main-container');
  const sideBar = document.querySelector('.sideBar');
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  container.appendChild(createToolbar());
  sideBar.appendChild(createColorPicker(125, 125));
  sideBar.appendChild(getColorInfoBox());
  sideBar.appendChild(getColorsGrid());

  window.addEventListener('resize', (e)=> {
    e.stopPropagation();
    isResizing = true;
    const url = canvas.toDataURL();
    const img = new Image();
    img.src = url;
    const width = canvas.width = canvas.scrollWidth;
    const height = canvas.height = canvas.scrollHeight;
    const ctx = canvas.getContext('2d');
    window.canvasW = width;
    window.canvasH = height;
    console.log(width, height);
    img.onload = ()=> ctx.drawImage(img, 0, 0, width, height);
  })
}

window.onload = ()=> init();
