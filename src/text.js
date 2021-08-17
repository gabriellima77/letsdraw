export default class Text {

  constructor() {
    this.font = 16;
    this._putEvents();
  }

  putInfoMenu() {
    const main = document.querySelector('main');

    const header = document.querySelector('header');
    const para = document.createElement('p');
    const div = document.createElement('div');
    const input = document.createElement('input');
    const confirmBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    const hasInfoMenu = document.querySelector('.infoMenu');
    if(hasInfoMenu) header.removeChild(hasInfoMenu);

    para.textContent = 'text';

    input.type = 'number';
    div.classList.add('infoMenu');
    para.classList.add('shapesText');
    input.classList.add('fontSize-input');
    confirmBtn.classList.add('confirmBtn');
    cancelBtn.classList.add('cancelBtn');

    confirmBtn.addEventListener('click', ()=> {
      const {width, height} = window.canvas;
      const {r, g, b} = window.primaryColor;
      const rgbColor = `rgb(${r}, ${g}, ${b})`;
      window.ctx.font = this.font + 'px sans-serif';
      window.ctx.fillStyle = rgbColor;
      window.ctx.fillText(this.value, this.pointA.x, this.pointA.y + this.font);
      if(window.imageStack) {
        const imageData = window.ctx.getImageData(0, 0, width, height);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
      header.removeChild(div);
      if(main.contains(this.textArea)) main.removeChild(this.textArea);
    });

    cancelBtn.addEventListener('click', ()=> main.removeChild(this.textArea));

    input.value = this.font;
    input.min = 7;
    input.max = 100;
    input.addEventListener('change', (e)=> {
      this.font = +e.target.value;
      this.textArea.style.fontSize = this.font + 'px';
    });

    cancelBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
    confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    
    div.appendChild(para);
    div.appendChild(input);
    div.appendChild(cancelBtn);
    div.appendChild(confirmBtn);
    header.appendChild(div);
  }

  createTextArea(maxWidth, maxHeight) {
    const {r, g, b} = window.primaryColor;
    this.textArea = document.createElement('textarea');
    this.textArea.classList.add('textA');

    this.textArea.style.width = 32 + 'px';
    this.textArea.style.height = 18 + 'px';
    this.textArea.style.fontSize = 16 + 'px';
    this.textArea.style.maxWidth = maxWidth + 'px';
    this.textArea.style.maxHeight = maxHeight + 'px';
    this.textArea.style.color = `rgb(${r}, ${g}, ${b})`;
    this.textArea.style.fontSize = this.font + 'px';
    this.value = '';
    this.textArea.onkeyup = (e)=> {
      this.textArea.style.width = 32 + this.value.length * (this.font - 5) + 'px';
      this.textArea.style.height = this.textArea.scrollHeight + "px";
      this.value = e.target.value;
      this.textArea.value = this.value;
    }
    return this.textArea;
  }

  createBtn() {
    const btn = document.createElement('button');
    btn.title = 'text';
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
    if(e.buttons === 2 || window.currentTool !== 'text') return;
    const {width, height} = window.canvas;
    this.isClicked = true;
    const main = document.querySelector('main');
    let hasTextArea = document.querySelector('.textA');
    if(!hasTextArea) {
      this.pointA = {x: e.layerX, y: e.layerY};
      this.mousePositionA = {x: e.clientX, y: e.clientY};
      const maxWidth = width - this.pointA.x;
      const maxHeight = height - this.pointA.y;
      hasTextArea = this.createTextArea(maxWidth, maxHeight);
      hasTextArea.style.top = this.mousePositionA.y + 'px';
      hasTextArea.style.left = this.mousePositionA.x + 'px';
      this.textArea = hasTextArea;
      main.appendChild(hasTextArea);
      this.putInfoMenu();
    }
  }

  _mouseMove() {
    if(window.currentTool !== 'text') return;
    window.canvas.style.cursor = 'text';
  }

  _mouseUp() {
    this.isClicked = false;
  }

}
