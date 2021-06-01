import createToolbar from './src/tools.js';
import createColorPicker from './src/color-picker.js';

window.onload = ()=> {

  function toolEvent() {
    const toolName = this.classList[1];
    currentTool = toolName;
  }

  function getColor() {
    const color = this.style.background;
    if(info.colorType === 'first') {
      const colorDiv = document.querySelector('.firstColor').querySelector('.color');
      info.primaryColor = color;
      colorDiv.style.background = color;
    } else {
      const colorDiv = document.querySelector('.secondColor').querySelector('.color');
      colorDiv.style.background = color;
      info.secundaryColor = color;
    }
  }

  function changeMainColor() {
    const btns = [...document.querySelectorAll('button')];
    const hasActive = btns.find((btn) => btn.classList.contains('active'));
    if(hasActive) hasActive.classList.remove('active');
    this.classList.add('active');
    info.colorType = this.querySelector('p').textContent;
  }

  function init() {
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('#main-container');
    const section = document.querySelector('section');
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    container.appendChild(createToolbar());
    section.appendChild(createColorPicker(150, 150));
  }

  init();


}
