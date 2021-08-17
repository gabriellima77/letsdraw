const classList = ['fas', 'fa-pencil-alt', 'pencil1'];

class Sprite {

  constructor(color, radio) {
    this.color = color;
    this.width = 2 * (+radio+1);
    this.height = 2 * (+radio+1);
    this.top = 0;
    this.left = 0;
    this.center = {x: +radio + 1, y: +radio + 1};
    this.radio = +radio;
    this.image = this.createImage(+radio);
  }

  createImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = this.width;
    canvas.height = this.height;
    const img = ctx.getImageData(0, 0, this.width, this.height);
    return this.circle(this.radio, img);
  }

  copyContent(startPoint, width, img) {
    for(let x = this.left; x < this.width; x++) {
      for(let y = this.top; y < this.height; y++) {
        const sprIndex = (x + this.width * y) * 4;
        const index = ((x + startPoint.x) + width * (y + startPoint.y)) * 4;
        const alpha = this.image.data[sprIndex + 3];

        if(
          alpha === 0 ||
          startPoint.x + x >= width ||
          startPoint.x + x < 0
        ) continue;

        const colorA = {
          r: img.data[index],
          g: img.data[index + 1],
          b: img.data[index + 2]
        }

        let colorB = {
          r: this.image.data[sprIndex],
          g: this.image.data[sprIndex + 1],
          b: this.image.data[sprIndex + 2]
        }

        if(this._isEqual(colorA, colorB)) continue;
        img.data[index] = colorB.r;
        img.data[index + 1] = colorB.g;
        img.data[index + 2] = colorB.b;
      }
    }
  }

  drawCircle(center, point, color, img) {
    this._putpixel(center.x + point.x, center.y + point.y, color, img);
    this._putpixel(center.x - point.x, center.y + point.y, color, img);
    this._putpixel(center.x + point.x, center.y - point.y, color, img);
    this._putpixel(center.x - point.x, center.y - point.y, color, img);
    this._putpixel(center.x + point.y, center.y + point.x, color, img);
    this._putpixel(center.x - point.y, center.y + point.x, color, img);
    this._putpixel(center.x + point.y, center.y - point.x, color, img);
    this._putpixel(center.x - point.y, center.y - point.x, color, img);
  }

  circle(radio) {
    const img = this.ctx.getImageData(0, 0, this.width, this.height);
    let x = 0;
    let y = radio;
    let d = 3 - 2 * radio;
    this.drawCircle(this.center, {x, y}, this.color, img);
    while(y >= x) {
      x++;
      if(d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      this.drawCircle(this.center, {x, y}, this.color, img);
    }
    return img;
  }

  putColor(index, img) {
    if(
      img.data[index] === this.color.r &&
      img.data[index + 1] === this.color.g &&
      img.data[index + 2] === this.color.b &&
      img.data[index + 3] !== 0
    ) return;
    img.data[index] = this.color.r;
    img.data[index + 1] = this.color.g;
    img.data[index + 2] = this.color.b;
    img.data[index + 3] = 255;
  }

  get getCoord() {
    return {
      x: this.left,
      y: this.top
    }
  }

  set setColor(color) {
    this.color = color;
    if(this.image) this._fill(color);
    else return;
  }

  _isEqual(colorA, colorB) {
    return (
      colorA.r === colorB.r &&
      colorA.g === colorB.g &&
      colorA.b === colorB.b
    )
  }

  _fill(color) {
    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        const index = (x + this.width * y) * 4;
        const alpha = this.image.data[index + 3];
        if(alpha === 0) continue;
        this.image.data[index] = color.r;
        this.image.data[index + 1] = color.g;
        this.image.data[index + 2] = color.b;
      }
    }
  }

  _getColor(index, img) {
    return {
      r: img.data[index],
      g: img.data[index + 1],
      b: img.data[index + 2]
    }
  }

  _putpixel(x, y, color, img) {
    if(this.center.x > x) {
      for(let i = x; i < this.center.x; i++) {
        const index = (i + this.width * y) * 4;
        img.data[index] = color.r;
        img.data[index + 1] = color.g;
        img.data[index + 2] = color.b;
        img.data[index + 3] = 255;
      }
    } else {
      for(let i = this.center.x; i < x; i++) {
        const index = (i + this.width * y) * 4;
        img.data[index] = color.r;
        img.data[index + 1] = color.g;
        img.data[index + 2] = color.b;
        img.data[index + 3] = 255;
      }
    }
  }

}

export default class Pencil {
  constructor(){
    this._putEvents();
  }

  moreEvent(e) {
    if(e.target.classList.contains('pencil1')) {
      const btn = document.querySelector('.pencil2');
      btn.classList.toggle('show');
    } else {
      const btn = document.querySelector('.pencil2');
      btn.classList.remove('active');
      window.currentTool = null;
    }
    
  }

  btnClickEvent = (e, tool)=> {
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

    e.target.classList.add('active');
    window.currentTool = tool;
  }

  createBtns(){
    const btn = document.createElement('button');
    const brushBtn = document.createElement('button');

    btn.addEventListener('click', (e)=> this.btnClickEvent(e, 'pencil1'));
    brushBtn.addEventListener('click', (e)=> this.btnClickEvent(e, 'pencil2'));

    btn.addEventListener('contextmenu', (e)=>{ e.preventDefault() });
    brushBtn.addEventListener('contextmenu', (e)=>{ e.preventDefault() });
    btn.classList.add('tool');
    brushBtn.classList.add('tool');
    brushBtn.classList.add('pencil2');
    classList.forEach((clas) => { btn.classList.add(clas) });
    return [btn, brushBtn];
  }

  draw() {
    const {width, height} = window.canvas;
    const color = window.primaryColor;
    const img = window.ctx.getImageData(0, 0, width, height);
    let dx = Math.abs(this.pointB.x - this.pointA.x);
    let sx = (this.pointA.x < this.pointB.x)?1:-1;
    let dy = -Math.abs(this.pointB.y - this.pointA.y);
    let sy = (this.pointA.y < this.pointB.y)?1:-1;
    let err = dx + dy;
    while(true) {

      const currentPoint = {
        x: this.pointA.x - window.radius,
        y: this.pointA.y - window.radius
      };

      if(window.currentTool === 'pencil2') {
        for(let i = 0; i < window.radius; i++) {
          const index = (this.pointA.x + width * (this.pointA.y + i)) * 4;
          this.putColor(index, color, img);
        }
      } else {
        this.sprite.copyContent(currentPoint, width, img);
      }

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
    window.ctx.putImageData(img, 0, 0);
  }

  putColor(index, color, img) {
    if(
      img.data[index] === color.r &&
      img.data[index + 1] === color.g &&
      img.data[index + 2] === color.b
    ) return;
    img.data[index] = color.r;
    img.data[index + 1] = color.g;
    img.data[index + 2] = color.b;
  }

  _isEqual(colorA, colorB) {
    return (
      colorA.r === colorB.r &&
      colorA.g === colorB.g &&
      colorA.b === colorB.b
    )
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
      window.currentTool !== 'pencil1' && 
      window.currentTool !== 'pencil2'
    ) return;
    
    const {width, height} = window.canvas;
    const color = window.primaryColor;
    if(!this.sprite || this.sprite.radio !== window.radius) {
      this.sprite = new Sprite(color, window.radius);
    } else if(!this._isEqual(this.sprite.color, color)) {
      this.sprite.setColor = color;
    }

    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
    window.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    if(window.currentTool === 'pencil1') {
      const img = window.ctx.getImageData(0, 0, width, height);
      const position = {
        x: this.pointA.x - window.radius,
        y: this.pointA.y - window.radius,
      }
      this.sprite.copyContent(position, width, img);
      window.ctx.putImageData(img, 0, 0);
    }
  }

  _mouseMove(e) {
    if(window.currentTool !== 'pencil1' && window.currentTool !== 'pencil2') return;
    else {
      if(this.isClicked) {
        this.pointB = {x: e.layerX, y: e.layerY};
        this.draw();
      }
    }
    this.pointA = {x: e.layerX, y: e.layerY};
  }

  _mouseUp() {
    if(window.currentTool !== 'pencil1' && window.currentTool !== 'pencil2') return;
    if(window.imageStack) {
      const {width, height} = window.canvas;
      let imageData = window.ctx.getImageData(0, 0, width, height);
      window.currentImage = imageData;
      window.imageStack.push(imageData);
    }
    this.isClicked = false;
  }

  _mouseLeave() {
    if(this.isClicked) {
      if(window.currentTool !== 'pencil1' && window.currentTool !== 'pencil2') return;
      if(window.imageStack) {
        const {width, height} = window.canvas;
        let imageData = window.ctx.getImageData(0, 0, width, height);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
    }

    this.isClicked = false;
  }

}
