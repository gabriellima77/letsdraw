const classList = ['fas', 'fa-search'];

class Zoom {

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

  zoomEvent() {
    this.height = Math.abs(this.pointB.y - this.pointA.y);
    this.width = Math.abs(this.pointB.x - this.pointA.x);
    if(this.height > 0 && this.width > 0) {
      this.img = this.ctx.getImageData(this.pointA.x, this.pointA.y, this.width, this.height);
    }
  }

  createCanvas() {
    const nCanvas = document.createElement('canvas');
    const nCtx = nCanvas.getContext('2d');
    nCanvas.width = this.width;
    nCanvas.height = this.height;

    const scaleW = window.canvasW / this.width;
    const scaleH = window.canvasH / this.height;

    nCtx.putImageData(this.img, 0, 0);
    this.ctx.scale(scaleW, scaleH);
    window.scale = {scaleW, scaleH};
    this.ctx.drawImage(nCanvas, 0, 0);
  }

  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'mag';
    });
    btn.classList.add('tool');
    classList.forEach((clas)=> { btn.classList.add(clas) });
    btn.classList.add('mag');
    return btn;
  }

  _putEvents() {
    this.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
  }

  _mouseClick(e) {
    if(window.currentTool !== 'mag') return;
    this.isClicked = true;
    this.mouseA = {x: e.clientX, y: e.clientY};
    this.pointA = {x: e.layerX, y: e.layerY};
  }

  _mouseMove(e) {
    if(window.currentTool !== 'mag') return;
    if(this.isClicked) {
      this.mouseB = {x: e.clientX, y: e.clientY};
      this.pointB = {x: e.layerX, y: e.layerY};
      this.zoomEvent();
    }

    this.canvas.style.cursor = 'crosshair';
  }

  _mouseUp() {
    if(window.currentTool !== 'mag') return;
    this.isClicked = false;
    this.ctx.save();
    this.createCanvas();
    this.ctx.restore();
  }
}

const zoom = new Zoom();

export default zoom;