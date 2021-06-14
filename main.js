import createToolbar from './src/tools.js';
import { createColorPicker } from './src/color-picker.js';

window.onload = ()=> {
  
  function init() {
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('#main-container');
    const section = document.querySelector('section');
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    container.appendChild(createToolbar());
    section.appendChild(createColorPicker(100, 100));
  }

  init();

}
