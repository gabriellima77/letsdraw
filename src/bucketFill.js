const classList = ['fas' , 'fa-fill-drip'];

function getColor(point, width, img) {
  const index = (point.x + point.y * width) * 4;
  const color = { 
    r: img.data[index],
    g: img.data[index + 1],
    b: img.data[index + 2]
  }
  return color;
}

function setColor(x, y, width, color, img) {
  const index = (x + y * width) * 4;
  img.data[index] = color.r;
  img.data[index + 1] = color.g;
  img.data[index + 2] = color.b;
}

function compareColors(colorA, colorB) {
  return (colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b);
}

function isEqual(x, y, width, startColor, img) {
  const index = (x + y * width) * 4;
  const color = {
    r: img.data[index],
    g: img.data[index + 1],
    b: img.data[index + 2]
  }
  return (color.r === startColor.r && color.g === startColor.g && color.b === startColor.b);
}

export default class Bucket {
  constructor() {
    this._putEvents();
  }

  createBtn(){
    const btn = document.createElement('button');
    btn.title = 'bucket';
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
      window.currentTool = 'bucket';
    });
    btn.classList.add('tool');
    classList.forEach((clas)=> {btn.classList.add(clas)});
    return btn;
  }

  // Flood fill Algorithm 4-way method
  floodFill(point) {
    const {width, height} = window.canvas;
    const img = window.ctx.getImageData(0, 0, width, height);
    const startColor = getColor(point, width, img);
    const newColor = window.primaryColor;
    if(compareColors(startColor, newColor)) return;
  
    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];
    const stack = [point];
    while(stack.length > 0) {
      const {x, y} = stack.pop();
      setColor(x, y, width,newColor, img);
      for(let i = 0; i < 8; i++){
        let nx = x + dx[i];
        let ny = y + dy[i];
        if(nx >= 0 && nx < width && ny >= 0 && ny < height && isEqual(nx, ny, width, startColor, img)) {
          stack.push({x: nx, y: ny});
        }
      }
    }
    window.ctx.putImageData(img, 0, 0);
  }

  _putEvents(){
    window.canvas.addEventListener('mousedown', (e)=> { this._mouseClick(e) });
    window.canvas.addEventListener('mousemove', (e)=> { this._mouseMove(e) });
  }

  _mouseClick(e) {
    if(e.buttons === 2 || window.currentTool !== 'bucket') return;
    const point = {x: e.layerX, y: e.layerY};
    this.floodFill(point);
    const {width, height} = window.canvas;
    const imageData = window.ctx.getImageData(0, 0, width, height);
    window.currentImage = imageData;
    window.imageStack.push(imageData);
  }

  _mouseMove() {
    if(window.currentTool !== 'bucket') return;
    else {
      window.canvas.style.cursor = 'crosshair';
    }
  }

}
