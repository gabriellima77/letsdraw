
import createToolbar from './src/tools.js';
import { createColorPicker, getColorInfoBox, getColorsGrid } from './src/color-picker.js';

function init() {
  const canvas = document.getElementById('canvas');
  const container = document.querySelector('#main-container');
  const sideBar = document.querySelector('.sideBar');
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  container.appendChild(createToolbar());
  sideBar.appendChild(createColorPicker(125, 125));
  sideBar.appendChild(getColorInfoBox());
  sideBar.appendChild(getColorsGrid());
}

window.onload = ()=> init();
