
window.onload = ()=> {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.scrollWidth;
  const height = canvas.height = canvas.scrollHeight;
  const TOOLS = ['pencil', 'bucket', 'text', 'eraser', 'dropper', 'mag'];
  const SHAPES = ['square', 'triangle', 'circle', 'line'];
  const mouse = [0, 0];
  let click = false;
  let currentTool = 'pencil';
  let imageData;
  const info = {
    endLine: true, imageStack: [], primaryColor: 'rgb(0, 0, 0)',
    secundaryColor: 'rgb(255, 255, 255)', colorType: 'first', radio: 5
  };

  function goBack() {
    const stackLength = info.imageStack.length;
    if(stackLength > 1){
      const lastPosition = stackLength - 1;
      const newCurrent = info.imageStack[lastPosition - 1];
      info.imageStack.pop();
      info.currentImage = newCurrent;
      ctx.putImageData(info.currentImage, 0, 0);
    }
  }

  function bucketEvent(startPosition) {
    const startColor = getStartColor(startPosition);
    if(startColor === info.primaryColor) return;
    const pixelStack = [startPosition];
    while(pixelStack.length > 0) {
      let currentPosition = pixelStack.pop();
      let x = currentPosition[0];
      let y = currentPosition[1];
      let pixelPos = (x + width * y) * 4;

      while(y-- >= 0 && matchStartColor(pixelPos, startColor)) {
        pixelPos -= width * 4;
      }
      y++;
      pixelPos += width * 4;

      let reachLeft = false;
      let reachRight = false;
      
      while(y++ <= height - 1 && matchStartColor(pixelPos, startColor)){
        fillPixel(pixelPos);

        if(x > 0) {
          const newPos = pixelPos - 4;
          if(matchStartColor(newPos, startColor)) {
            if(!reachLeft){
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          }
        } else if(reachLeft) {
          reachLeft = false;
        } 

        if(x < width - 1) {
          const newPos = pixelPos + 4;
          if(matchStartColor(newPos, startColor)){
            if(!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if(reachRight){
            reachRight = false;
          } 
        }
        pixelPos += width * 4;
      }
    }
    ctx.putImageData(info.currentImage, 0, 0);
    info.imageStack.push(info.currentImage);
  }

  function matchStartColor(pixelPos, startColor) {
    const r = info.currentImage.data[pixelPos];
    const g = info.currentImage.data[pixelPos + 1];
    const b = info.currentImage.data[pixelPos + 2];
    const color = `rgb(${r}, ${g}, ${b})`;
    return (color === startColor);
  }

  function fillPixel(pixelPos) {
    const newColor = info.primaryColor.match(/[0-9]+/g);
    info.currentImage.data[pixelPos] = newColor[0];
    info.currentImage.data[pixelPos + 1] = newColor[1];
    info.currentImage.data[pixelPos + 2] = newColor[2];
  }

  function getStartColor(startPosition) {
    const index = (startPosition[0] + width * startPosition[1]) * 4;
    const r = info.currentImage.data[index];
    const g = info.currentImage.data[index + 1];
    const b = info.currentImage.data[index + 2];
    color = `rgb(${r}, ${g}, ${b})`;
    return color;
  }

  function drawCircle() {
    const width = Math.sqrt((info.pointB.x - info.pointA.x) ** 2);
    const height = Math.sqrt((info.pointB.y - info.pointA.y) ** 2);
    const radio = (width > height)? width: height;
    ctx.putImageData(info.currentImage, 0, 0);
    ctx.strokeStyle = info.primaryColor;
    ctx.beginPath();
    ctx.arc(info.pointA.x, info.pointA.y, radio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }

  function drawTriangle() {
    const triangleHeight = info.pointB.y - info.pointA.y;
    ctx.putImageData(info.currentImage, 0, 0);
    ctx.strokeStyle = info.primaryColor;
    ctx.beginPath();
    ctx.moveTo(info.pointA.x, info.pointA.y);
    const triangleWidth = info.pointA.x - info.pointB.x;
    ctx.lineTo(info.pointB.x, info.pointB.y);
    const pointC = {x: info.pointA.x + triangleWidth, y:info.pointA.y + triangleHeight};
    ctx.lineTo(pointC.x, pointC.y);
    ctx.lineTo(info.pointA.x, info.pointA.y);
    ctx.stroke();
    ctx.closePath();
  }

  function drawSquare() {
    const squareWidth = info.pointB.x - info.pointA.x;
    const squareHeight = info.pointB.y - info.pointA.y;
    ctx.putImageData(info.currentImage, 0, 0);
    ctx.strokeStyle = info.primaryColor;
    ctx.beginPath();
    ctx.rect(info.pointA.x, info.pointA.y, squareWidth, squareHeight);
    ctx.stroke();
  }

  function drawLine() {
    ctx.putImageData(info.currentImage, 0, 0);
    ctx.strokeStyle = info.primaryColor;
    ctx.beginPath();
    ctx.moveTo(info.pointA.x, info.pointA.y);
    ctx.lineTo(info.pointB.x, info.pointB.y);
    ctx.stroke();
  }

  function beginLine(point) {
    const hasBegin = document.querySelector('.begin');
    if(!hasBegin){
      const body = document.querySelector('body');
      const beginSpan = document.createElement('span');

      beginSpan.classList.add('begin');

      beginSpan.style.top = point[1] + 'px';
      beginSpan.style.left = point[0] + 'px';
      beginSpan.style.background = info.primaryColor;

      body.appendChild(beginSpan);
    }
  }

  function createLineCursor(point) {
    const hasCursor = document.querySelector('.cursorLine');
    if(!hasCursor) {
      canvas.style.cursor = 'none';
      const body = document.querySelector('body');
      const cursorSpan = document.createElement('span');
      cursorSpan.classList.add('cursorLine');
      cursorSpan.style.background = info.primaryColor;

      cursorSpan.addEventListener('contextmenu', (e)=> e.preventDefault());

      cursorSpan.style.top = point[1] + 'px';
      cursorSpan.style.left = point[0] + 'px';

      body.appendChild(cursorSpan);
    } else {
      hasCursor.style.top = point[1] + 'px';
      hasCursor.style.left = point[0] + 'px';
      hasCursor.style.background = info.primaryColor;
    }
  }

  function removeLineCursor() {
    const hasCursor = document.querySelector('.cursorLine');
    if(hasCursor){
      const body = document.querySelector('body');
      body.removeChild(hasCursor);
    }
  }

  function draw(pointA, pointB) {
    const color = (currentTool === 'pencil')? info.primaryColor: info.secundaryColor;
    const dx = pointB[0] - pointA[0];
    const dy = pointB[1] - pointA[1];
    ctx.fillStyle = color;
    if(dx === 0){
      if(pointA[1] > pointB[1]){
        for(let y = pointB[1]; y < pointA[1]; y += .1){
          ctx.beginPath();
          ctx.arc(pointB[0], y, info.radio, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      } else {
        for(let y = pointA[1]; y < pointB[1]; y += .1){
          ctx.beginPath();
          ctx.arc(pointA[0], y, info.radio, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      }
    } else {
      let m = dy / dx;
      let n = pointA[1] - (m * pointA[0]);
      for(let x = pointA[0]; x < pointB[0]; x += .1) {
        y = m * x + n;
        ctx.beginPath();
        ctx.arc(x, y, info.radio, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  function eraserRange(position) {
    const body = document.querySelector('body');
    const hasSpan = body.querySelector('.eraserRange');
    if(!hasSpan){
      const span = document.createElement('span');
      span.classList.add('eraserRange');

      span.style.background = info.secundaryColor;

      span.addEventListener('contextmenu', (e)=> e.preventDefault());
      span.addEventListener('mousedown', ()=> click = (click)? false: true);
      span.addEventListener('mouseup', ()=> click = (click)? false: true);

      span.style.width = '5px';
      span.style.height = '5px'
      span.style.top = position[1] + 'px';
      span.style.left = position[0] + 'px';
      body.appendChild(span);
    } else {
      hasSpan.style.background = info.secundaryColor;
      hasSpan.style.top = position[1] + 'px';
      hasSpan.style.left = position[0] + 'px';
    }
  }

  function removeEraserRange() {
    const span = document.querySelector('.eraserRange');
    const body = document.querySelector('body');
    if(span) body.removeChild(span);
  }

  function lineEvent(windowPosition, pointA) {
    info.endLine = (info.endLine)? false: true;
    if(info.endLine === false) {
      const point = windowPosition;
      beginLine(point);
      info.pointA = pointA;
    } else if(info.endLine) {
      const body = document.querySelector('body');
      const hasBegin = document.querySelector('.begin');
      if(hasBegin)  body.removeChild(hasBegin);
    }
  }

  canvas.onmousedown = (e)=> {
    if(e.buttons === 2) return;
    click = true;
    if(currentTool === 'line') {
      const windowPosition = [e.clientX, e.clientY];
      const pointA = {x: e.layerX + 5, y: e.layerY + 5};
      lineEvent(windowPosition, pointA);
    } else if(currentTool === 'square') {
      info.endLine = (info.endLine)? false: true;
      if(info.endLine === false) {
        info.pointA = {x: e.layerX, y: e.layerY};
      }
    } else if(currentTool === 'triangle') {
      info.endLine = (info.endLine)? false: true;
      if(info.endLine === false) {
        info.pointA = {x: e.layerX, y: e.layerY};
      }
    } else if(currentTool === 'circle') {
      info.endLine = (info.endLine)? false: true;
      if(info.endLine === false) {
        info.pointA = {x: e.layerX, y: e.layerY};
      }
    } else if(currentTool === 'bucket'){
      bucketEvent(mouse);
    } else if(currentTool === 'dropper') {
      const color = getStartColor(mouse);
      const colorDiv = document.querySelector('.firstColor').querySelector('.color');

      info.primaryColor = color;
      colorDiv.style.background = color;
    }
    mouse[0] = e.layerX;
    mouse[1] = e.layerY;
  }

  canvas.onmousemove = (e)=> {
    if(click) {
      const pointA = [mouse[0], mouse[1]];
      const pointB = [e.layerX, e.layerY];
      if(currentTool === 'pencil' || currentTool === 'eraser') {
        if(mouse[0] > e.layerX) draw(pointB, pointA);
        else draw(pointA, pointB);
      }
    }
    if(currentTool === 'line') {
      removeEraserRange();
      const point = [e.clientX, e.clientY];
      createLineCursor(point);
      info.pointB = {x: e.layerX + 5, y: e.layerY + 5};
      if(info.endLine === false) {
        drawLine();
      }
    } else if(currentTool === 'eraser') {
      removeLineCursor();
      removeEraserRange();
      canvas.style.cursor = 'none';
      const position = [e.clientX, e.clientY];
      eraserRange(position);
    } else if(currentTool === 'square') {
      removeLineCursor();
      removeEraserRange();
      canvas.style.cursor = 'crosshair';
      if(info.endLine === false) {
        info.pointB = {x: e.layerX, y: e.layerY};
        drawSquare();
      }
    } else if(currentTool === 'triangle'){
      removeLineCursor();
      removeEraserRange();
      canvas.style.cursor = 'crosshair';
      if(info.endLine === false) {
        info.pointB = {x: e.layerX, y: e.layerY};
        drawTriangle();
      }
    } else if(currentTool === 'circle') {
      removeLineCursor();
      removeEraserRange();
      canvas.style.cursor = 'crosshair';
      if(info.endLine === false) {
        info.pointB = {x: e.layerX, y: e.layerY};
        drawCircle();
      }
    } else {
      removeLineCursor();
      removeEraserRange();
      canvas.style.cursor = 'initial';
    }
    mouse[0] = e.layerX;
    mouse[1] = e.layerY;
  }

  canvas.onmouseup = (e)=> {
    if(click) {
      click = false;
      mouse[0] = 0;
      mouse[1] = 0;
      imageData = ctx.getImageData(0, 0, width, height);
      info.currentImage = imageData;
      info.imageStack.push(imageData);
    }
  }

  function toolEvent() {
    const toolName = this.classList[1];
    currentTool = toolName;
  }

  function getColor() {
    const color = this.style.background;
    if(info.colorType === 'first') {
      const colorDiv = document.querySelector('.firstColor').querySelector('.color');
      info.primaryColor = color;
      colorDiv.style.background = color;
    } else {
      const colorDiv = document.querySelector('.secondColor').querySelector('.color');
      colorDiv.style.background = color;
      info.secundaryColor = color;
    }
  }

  function changeMainColor() {
    const btns = [...document.querySelectorAll('button')];
    const hasActive = btns.find((btn) => btn.classList.contains('active'));
    if(hasActive) hasActive.classList.remove('active');
    this.classList.add('active');
    info.colorType = this.querySelector('p').textContent;
  }

  function putColors() {
    const colors = document.querySelector('#colorGrid');
    fetch('./colors.json')
      .then( (response)=> response.json() )
      .then( (data)=> {
        for(let i = 0; i < 30; i++) {
          const btn = document.createElement('button');
          btn.classList.add('smColor');
          if(data.mainColors[i]) btn.style.background = data.mainColors[i];
          btn.addEventListener('click', getColor);
          colors.appendChild(btn);
        }
      });
    const mainColors = [...document.querySelectorAll('.color')];
    mainColors[0].style.background = info.primaryColor;
    mainColors[1].style.background = info.secundaryColor;

    const firstColor = document.querySelector('.firstColor');
    const secondColor = document.querySelector('.secondColor');

    firstColor.addEventListener('click', changeMainColor);
    secondColor.addEventListener('click', changeMainColor);
  }

  function init() {
    const lineSizeInput = document.querySelector('#lineSize').querySelector('input');
    lineSizeInput.addEventListener('input', (e)=> {
      info.radio = e.target.value;
      ctx.lineWidth = info.radio;
    });
    putColors();
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'black';
    const tools = [...document.querySelectorAll('.tool'), ...document.querySelectorAll('.shape')];
    tools.forEach((tool)=> {
      tool.addEventListener('click', toolEvent)
    });
    imageData = ctx.getImageData(0, 0, width, height);
    info.currentImage = imageData;
    info.imageStack.push(imageData);
    ctx.lineWidth = info.radio;
  }

  init();

  window.onkeydown = (e)=> {
    if(e.key === 'Control') info.ctrlHold = true;
    if(e.key === 'z' && info.ctrlHold) goBack();
    else return;
  }

  window.onkeyup = (e)=> {
    if(e.key === 'Control') info.ctrlHold = false;
  }
}
