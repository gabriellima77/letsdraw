const classList = {
  circle: ['far', 'fa-circle'],
  square: ['far', 'fa-square'],
};

export default class Shapes {
  constructor() {
    this._putEvents();
  }

  shapeBtnEvent = (e, tool)=> {
    const hasUsing = document.querySelector('.shapeBtn.using');
    if(hasUsing) hasUsing.classList.remove('using');
    e.target.classList.add('using');
    window.currentTool = tool;
  }

  putInfoMenu() {
    const header = document.querySelector('header');
    const div = document.createElement('div');
    const para = document.createElement('p');
    const circleBtn = document.createElement('button');
    const squareBtn = document.createElement('button');
    const triangleBtn = document.createElement('button');

    circleBtn.title = 'circle';
    squareBtn.title = 'square';
    triangleBtn = 'triangle';

    const hasInfoMenu = document.querySelector('.infoMenu');
    if(hasInfoMenu) header.removeChild(hasInfoMenu);

    para.textContent = 'shapes';

    div.classList.add('infoMenu');
    para.classList.add('shapesText');
    circleBtn.classList.add('shapeBtn');
    circleBtn.classList.add('using');
    classList.circle.forEach((clas)=> circleBtn.classList.add(clas));
    squareBtn.classList.add('shapeBtn');
    classList.square.forEach((clas)=> squareBtn.classList.add(clas));
    triangleBtn.classList.add('shapeBtn');
    triangleBtn.classList.add('triangle');

    circleBtn.addEventListener('click', (e)=> this.shapeBtnEvent(e, 'circle'));
    squareBtn.addEventListener('click', (e)=> this.shapeBtnEvent(e, 'square'));
    triangleBtn.addEventListener('click', (e)=> this.shapeBtnEvent(e, 'triangle'));
    
    div.appendChild(para);
    div.appendChild(circleBtn);
    div.appendChild(squareBtn);
    div.appendChild(triangleBtn);
    header.appendChild(div);
  }

  btnClickEvent = (e, isShapes)=> {
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
    e.target.classList.add('active');
    if(isShapes) this.putInfoMenu();
  }

  createBtn() {
    const circleBtn = document.createElement('button');
    circleBtn.title = 'shapes';
    const lineBtn = document.createElement('button');
    lineBtn.title = 'line';
    circleBtn.addEventListener('click', (e)=> this.btnClickEvent(e, true));
    lineBtn.addEventListener('click', this.btnClickEvent);

    lineBtn.classList.add('tool');
    lineBtn.classList.add('line');
    lineBtn.addEventListener('click', ()=> { window.currentTool = 'line'; });

    circleBtn.addEventListener('click', ()=> { window.currentTool = 'circle'; });
    circleBtn.classList.add('tool');
    classList.circle.forEach((clas)=> { circleBtn.classList.add(clas) });
    return [lineBtn, circleBtn];
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

  drawTriangle() {
    const triangleHeight = this.pointB.y - this.pointA.y;
    const {r, g, b} = window.primaryColor;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;

    window.ctx.strokeStyle = rgbColor;
    window.ctx.lineWidth = window.radius;
    window.ctx.lineJoin = 'round';
    window.ctx.beginPath();
    window.ctx.moveTo(this.pointA.x, this.pointA.y);
    const triangleWidth = this.pointA.x - this.pointB.x;
    window.ctx.lineTo(this.pointB.x, this.pointB.y);
    const pointC = {x: this.pointA.x + triangleWidth, y:this.pointA.y + triangleHeight};
    window.ctx.lineTo(pointC.x, pointC.y);
    window.ctx.lineTo(this.pointA.x, this.pointA.y);
    window.ctx.closePath();
    window.ctx.stroke();
    window.ctx.lineJoin = 'miter';
  }
  
  drawSquare() {
    const {r, g, b} = window.primaryColor;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const squareWidth = this.pointB.x - this.pointA.x;
    const squareHeight = this.pointB.y - this.pointA.y;
    window.ctx.lineWidth = window.radius;
    
    window.ctx.strokeStyle = rgbColor;
    window.ctx.beginPath();
    window.ctx.rect(this.pointA.x, this.pointA.y, squareWidth, squareHeight);
    window.ctx.stroke();
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
      switch(window.currentTool) {
        case 'line':
          this.drawLine();
          break;
        case 'circle':
          this.drawCircle();
          break;
        case 'triangle':
          this.drawTriangle();
          break;
        case 'square':
          this.drawSquare();
          break;
        default:
          break;
      }
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
