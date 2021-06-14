const classList = {
  circle: ['far', 'fa-circle'],
  square: ['far', 'fa-square'],
  triangle: ['far', 'fa-triangle']
}

class Shapes {
  init(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this._putEvents();
  }

  createBtn(type) {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
    });
    btn.classList.add('tool');
    if(type === 'line') {
      btn.addEventListener('click', ()=> { window.currentTool = 'line'; });
      btn.classList.add('line');
    } else if(type === 'shapes') {
      btn.addEventListener('click', ()=> { window.currentTool = 'circle'; });
      classList.circle.forEach((clas)=> { btn.classList.add(clas) });
    }
    return btn;
  }

  drawLine() {
    const color = window.primaryColor;
    const lineWidth = window.radius;
    const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    this.ctx.strokeStyle = rgbColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointA.x, this.pointA.y);
    this.ctx.lineTo(this.pointB.x, this.pointB.y);
    this.ctx.stroke();
  }
  
  drawCircle() {
    const width = Math.sqrt((this.pointB.x - this.pointA.x) ** 2);
    const height = Math.sqrt((this.pointB.y - this.pointA.y) ** 2);
    const radius = (width > height)? width: height;
    const color = window.primaryColor;
    const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

    this.ctx.lineWidth = window.radius;
    this.ctx.strokeStyle = rgbColor;
    this.ctx.beginPath();
    this.ctx.arc(this.pointA.x, this.pointA.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  _putEvents() {
    this.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
    this.canvas.addEventListener('mouseleave', ()=> { this._mouseLeave() } );
  }

  _mouseClick(e) {
    if(
      e.buttons === 2 || 
      window.currentTool !== 'line' && 
      window.currentTool !== 'circle' &&
      window.currentTool !== 'square' &&
      window.currentTool !== 'triangle'
    ) return;

    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
  }

  _mouseMove(e) {
    if(
      window.currentTool !== 'line'     && 
      window.currentTool !== 'circle'   &&
      window.currentTool !== 'square'   &&
      window.currentTool !== 'triangle'
    ) return;
    else {
      if(this.isClicked) {
        this.pointB = {x: e.layerX, y: e.layerY};
        const currentImage = window.currentImage;
        this.ctx.putImageData(currentImage, 0, 0);
        if(window.currentTool === 'line') this.drawLine();
        else if(window.currentTool === 'circle') this.drawCircle();
      } 
    }
    this.canvas.style.cursor = 'crosshair';
  }

  _mouseUp() {
    if(
      window.currentTool !== 'line' && 
      window.currentTool !== 'circle' &&
      window.currentTool !== 'square' &&
      window.currentTool !== 'triangle'
    ) return;
    if(window.imageStack) {
      let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
      window.currentImage = imageData;
      window.imageStack.push(imageData);
    }
    this.isClicked = false;
  }

  _mouseLeave() {
    if(this.isClicked) {
      if(
        window.currentTool !== 'line' && 
        window.currentTool !== 'circle' &&
        window.currentTool !== 'square' &&
        window.currentTool !== 'triangle'
      ) return;
      if(window.imageStack) {
        let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
    }

    this.isClicked = false;
  }
}

const shapes = new Shapes();

export default shapes;