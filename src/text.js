class Text {

  init(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.zoomIntensity = 0.1;
    this.scale = 1;
    this.orgnx = 0;
    this.orgny = 0;
    this.visibleWidth = window.canvasW;
    this.visibleHeight = window.canvasH;
    this._putEvents();
  }

  createTextArea() {
    const textArea = document.createElement('textarea');
    textArea.classList.add('textA');
    textArea.style.width = 16 + 'px';
    textArea.style.height = 16 + 'px';
    textArea.style.fontSize = 16 + 'px';
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
    this.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
  }

  _mouseClick(e) {
    if(e.buttons === 2 || window.currentTool !== 'text') return;
    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
    this.mousePositionA = {x: e.clientX, y: e.clientY};
    const section = document.querySelector('main section');
    let hasTextArea = document.querySelector('.textA');
    if(!hasTextArea) {
      hasTextArea = this.createTextArea();
      this.textArea = hasTextArea;
      hasTextArea.style.top = this.mousePositionA.y + 'px';
      hasTextArea.style.left = this.mousePositionA.x + 'px';
      section.appendChild(hasTextArea);
    }
  }

  _mouseMove(e) {
    if(window.currentTool !== 'text') return;
    this.canvas.style.cursor = 'text';
  }

  _mouseUp() {
    console.log(1);
    this.isClicked = false;
  }

}

const text = new Text();

export default text;