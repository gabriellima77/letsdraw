export default class Text {

  constructor() {
    this._putEvents();
  }

  createTextArea(maxWidth, maxHeight) {
    console.log(`The max Width:  ${maxWidth}\nThe max Height: ${maxHeight}`);
    const textArea = document.createElement('textarea');
    textArea.classList.add('textA');

    textArea.style.width = 32 + 'px';
    textArea.style.height = 16 + 'px';
    textArea.style.fontSize = 16 + 'px';
    textArea.style.maxWidth = maxWidth + 'px';
    textArea.style.maxHeight = maxHeight + 'px';
    textArea.autofocus = true;

    this.value = '';
    textArea.onChange = (e)=> {
      this.value = e.target.value;
      textArea.value = this.value;
    }
    return textArea;
  }

  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'text';
    });
    btn.classList.add('tool');
    btn.classList.add('text');
    return btn;
  }

  _putEvents() {
    window.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    window.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    window.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
  }

  _mouseClick(e) {
    const {width, height} = window.canvas;
    if(e.buttons === 2 || window.currentTool !== 'text') return;
    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
    this.mousePositionA = {x: e.clientX, y: e.clientY};
    const section = document.querySelector('main section');
    let hasTextArea = document.querySelector('.textA');
    if(!hasTextArea) {
      const maxWidth = width - this.pointA.x;
      const maxHeight = height - this.pointA.y;
      hasTextArea = this.createTextArea(maxWidth, maxHeight);
      this.textArea = hasTextArea;
      hasTextArea.style.top = this.mousePositionA.y + 'px';
      hasTextArea.style.left = this.mousePositionA.x + 'px';
      section.appendChild(hasTextArea);
    }
  }

  _mouseMove(e) {
    if(window.currentTool !== 'text') return;
    window.canvas.style.cursor = 'text';
  }

  _mouseUp() {
    this.isClicked = false;
  }

}
