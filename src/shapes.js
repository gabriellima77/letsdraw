const classList = {
  circle: ['far', 'fa-circle'],
  square: ['far', 'fa-square'],
  triangle: ['far', 'fa-triangle']
}

export default class Shapes {
  constructor() {
    this._putEvents();
  }

  createBtn(type) {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const main = document.querySelector('main');
      const header = document.querySelector('header');
  
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
    const {r, g, b} = window.primaryColor;
    const lineWidth = window.radius;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    window.ctx.strokeStyle = rgbColor;
    window.ctx.lineWidth = lineWidth;
    window.ctx.beginPath();
    window.ctx.moveTo(this.pointA.x, this.pointA.y);
    window.ctx.lineTo(this.pointB.x, this.pointB.y);
    window.ctx.stroke();
  }
  
  drawCircle() {
    const width = Math.sqrt((this.pointB.x - this.pointA.x) ** 2);
    const height = Math.sqrt((this.pointB.y - this.pointA.y) ** 2);
    const radius = (width > height)? width: height;
    const {r, g, b} = window.primaryColor;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;

    window.ctx.lineWidth = window.radius;
    window.ctx.strokeStyle = rgbColor;
    window.ctx.beginPath();
    window.ctx.arc(this.pointA.x, this.pointA.y, radius, 0, Math.PI * 2);
    window.ctx.stroke();
    window.ctx.closePath();
  }

  _putEvents() {
    window.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    window.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    window.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
    window.canvas.addEventListener('mouseleave', ()=> { this._mouseLeave() } );
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
    if(this.isClicked) {
      this.pointB = {x: e.layerX, y: e.layerY};
      const currentImage = window.currentImage;
      window.ctx.putImageData(currentImage, 0, 0);
      if(window.currentTool === 'line') this.drawLine();
      else if(window.currentTool === 'circle') this.drawCircle(); 
    }
    window.canvas.style.cursor = 'crosshair';
  }

  _mouseUp() {
    if(
      window.currentTool !== 'line' && 
      window.currentTool !== 'circle' &&
      window.currentTool !== 'square' &&
      window.currentTool !== 'triangle'
    ) return;
    if(window.imageStack) {
      const {width, height} = window.canvas;
      const imageData = window.ctx.getImageData(0, 0, width, height);
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
        const {width, height} = window.canvas;
        const imageData = window.ctx.getImageData(0, 0, width, height);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
    }

    this.isClicked = false;
  }
}
