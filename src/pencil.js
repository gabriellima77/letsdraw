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

class Pencil {
  init(ctx, canvas, width, height){
    this.ctx = ctx;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
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

  createBtn(){
    const btn = document.createElement('button');
    const hiddenBtn = document.createElement('button');

    btn.addEventListener('click', (e)=> {
      if(btn !== e.target) return;
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      const isShowing = document.querySelector('.pencil2.show');
      if(isShowing) isShowing.classList.remove('show');
      btn.classList.add('active');
      window.currentTool = 'pencil1';
      // this.tool = 'pencil1';
    });

    btn.addEventListener('mousedown', (e)=> {
      if(e.buttons === 1 || btn !== e.target) return;
      this.moreEvent(e);
    });

    btn.addEventListener('contextmenu', (e)=>{ e.preventDefault() });
    btn.classList.add('tool');
    classList.forEach((clas) => { btn.classList.add(clas) });
    btn.classList.add('more')

    hiddenBtn.classList.add('tool');
    hiddenBtn.classList.add('pencil2');
    hiddenBtn.addEventListener('click', ()=>{
      window.currentTool = 'pencil2';
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      hiddenBtn.classList.add('active');
      // this.tool = 'pencil2';
      if(hiddenBtn.classList.contains('show')) hiddenBtn.classList.remove('show');
    });

    hiddenBtn.addEventListener('mousedown', (e)=> {
      if(e.buttons === 1 || hiddenBtn !== e.target) return;
      this.moreEvent(e);
    });
    btn.appendChild(hiddenBtn);
    return btn;
  }

  draw() {
    const color = window.primaryColor;
    const img = this.ctx.getImageData(0, 0, this.width, this.height);
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
          const index = (this.pointA.x + this.width * (this.pointA.y + i)) * 4;
          this.putColor(index, color, img);
        }
      } else {
        this.sprite.copyContent(currentPoint, this.width, img);
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
    this.ctx.putImageData(img, 0, 0);
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
    this.canvas.addEventListener('mousedown', (e)=>{ this._mouseClick(e) });
    this.canvas.addEventListener('mousemove', (e)=>{ this._mouseMove(e) });
    this.canvas.addEventListener('mouseup', ()=>{ this._mouseUp() });
    this.canvas.addEventListener('mouseleave', ()=> { this._mouseLeave() } );
  }

  _mouseClick(e) {
    if(
      e.buttons === 2 || 
      window.currentTool !== 'pencil1' && 
      window.currentTool !== 'pencil2'
    ) return;

    const color = window.primaryColor;
    if(!this.sprite || this.sprite.radio !== window.radius) {
      this.sprite = new Sprite(color, window.radius);
    } else if(!this._isEqual(this.sprite.color, color)) {
      this.sprite.setColor = color;
    }

    this.isClicked = true;
    this.pointA = {x: e.layerX, y: e.layerY};
    this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    if(window.currentTool === 'pencil1') {
      const img = this.ctx.getImageData(0, 0, this.width, this.height);
      const position = {
        x: this.pointA.x - window.radius,
        y: this.pointA.y - window.radius,
      }
      this.sprite.copyContent(position, this.width, img);
      this.ctx.putImageData(img, 0, 0);
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
      let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
      window.currentImage = imageData;
      window.imageStack.push(imageData);
    }
    this.isClicked = false;
  }

  _mouseLeave() {
    if(this.isClicked) {
      if(window.currentTool !== 'pencil1' && window.currentTool !== 'pencil2') return;
      if(window.imageStack) {
        let imageData = this.ctx.getImageData(0, 0, window.canvasW, window.canvasH);
        window.currentImage = imageData;
        window.imageStack.push(imageData);
      }
    }

    this.isClicked = false;
  }

}

const pencil = new Pencil();

export default pencil;