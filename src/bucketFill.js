const classList = ['fas' , 'fa-fill-drip'];

function getColor(point, width,img) {
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

class Bucket {
  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this._putEvents();
  }

  createBtn(){
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
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
    const {width, height} = this.canvas;
    const img = this.ctx.getImageData(0, 0, width, height);
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
    this.ctx.putImageData(img, 0, 0);
  }

  _putEvents(){
    this.canvas.addEventListener('mousedown', (e)=> { this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=> { this._mouseMove(e) });
  }

  _mouseClick(e) {
    if(e.buttons === 2 || window.currentTool !== 'bucket') return;
    const point = {x: e.layerX, y: e.layerY};
    this.floodFill(point);
    let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
    window.currentImage = imageData;
    window.imageStack.push(imageData);
  }

  _mouseMove() {
    if(window.currentTool !== 'bucket') return;
    else {
      this.canvas.style.cursor = 'crosshair';
    }
  }

}

const bucket = new Bucket();

export default bucket;