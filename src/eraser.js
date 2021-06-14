const classList = ['fas','fa-eraser'];

class Eraser {

  init(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;
    this._putEvents();
  }

  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'eraser';
    });
    btn.addEventListener('contextmenu', (e)=>{ e.preventDefault() });
    btn.classList.add('tool');
    classList.forEach((clas)=> { btn.classList.add(clas) });
    return btn;
  }

  draw() {
    let dx = Math.abs(this.pointB.x - this.pointA.x);
    let sx = (this.pointA.x < this.pointB.x)?1:-1;
    let dy = -Math.abs(this.pointB.y - this.pointA.y);
    let sy = (this.pointA.y < this.pointB.y)?1:-1;
    let err = dx + dy;
    while(true) {

      this.ctx.fillStyle = 'rgb(255, 255, 255)';
      this.ctx.beginPath();
      this.ctx.arc(this.pointA.x, this.pointA.y, window.radius, 0,2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
      
      if(this.pointA.x === this.pointB.x && this.pointA.y === this.pointB.y) break;
      let e2 = 2 * err;
      if(e2 >= dy) {
        err += dy;
        this.pointA.x += sx;
      }
      if(e2 <= dx) {
        err += dx;
        this.pointA.y += sy;
      }
    }
  }

  eraserRange() {
    const body = document.querySelector('body');
    const hasSpan = body.querySelector('.eraserRange');
    if(!hasSpan){
      const span = document.createElement('span');
      span.classList.add('eraserRange');
  
      span.style.background = 'rgb(255, 255, 255)';
  
      span.addEventListener('contextmenu', (e)=> e.preventDefault());
  
      span.style.width = `${ window.radius * 2 }px`;
      span.style.height = `${ window.radius * 2 }px`;
      span.style.top = this.mousePosition.y - window.radius + 'px';
      span.style.left = this.mousePosition.x - window.radius + 'px';
      body.appendChild(span);
    } else {
      hasSpan.style.background = 'rgb(255, 255, 255)';
      hasSpan.style.width = `${ window.radius * 2 }px`;
      hasSpan.style.height = `${ window.radius * 2 }px`;
      hasSpan.style.top = this.mousePosition.y - window.radius  + 'px';
      hasSpan.style.left = this.mousePosition.x - window.radius  + 'px';
    }
  }

  removeEraserRange() {
    const span = document.querySelector('.eraserRange');
    const body = document.querySelector('body');
    if(span) body.removeChild(span);
  }

  _putEvents() {
    this.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
    this.canvas.addEventListener('mouseleave', ()=> { this._mouseLeave() } );
  }

  _mouseClick(e) {
    if(e.buttons === 2 || window.currentTool !== 'eraser') return;
    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.beginPath();
    this.ctx.arc(this.pointA.x, this.pointA.y, window.radius, 0,2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  _mouseMove(e) {
    if(window.currentTool !== 'eraser') return;
    else {
      this.canvas.style.cursor = 'none';
      this.pointB = {x: e.layerX, y: e.layerY};
      this.mousePosition = {x: e.clientX, y: e.clientY};
      if(this.isClicked) this.draw();
    }
    this.pointA = {x: e.layerX, y: e.layerY};
    this.eraserRange()
  }

  _mouseUp() {
    if(window.currentTool !== 'eraser') return;
    if(window.imageStack) {
      let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
      window.currentImage = imageData;
      window.imageStack.push(imageData);
    }
    this.isClicked = false;
  }

  _mouseLeave() {
    if(this.isClicked) {
      if(window.currentTool !== 'eraser') return;
      if(window.imageStack) {
        let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
    }
    this.isClicked = false;
    this.removeEraserRange();
  }

}

const eraser = new Eraser();

export default eraser;