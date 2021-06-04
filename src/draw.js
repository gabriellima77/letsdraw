
function drawEvent(info) {
  const {pointA, pointB, color, weight, ctx} = info;
  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;x
  ctx.strokeStyle = rgbColor;
  ctx.lineWidth = weight;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pointA[0], pointA[1]);
  ctx.lineTo(pointB[0], pointB[1]);
  ctx.stroke();
}

function eraserRange(position, color, weight) {
  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const body = document.querySelector('body');
  const hasSpan = body.querySelector('.eraserRange');
  if(!hasSpan){
    const span = document.createElement('span');
    span.classList.add('eraserRange');

    span.style.background = rgbColor;

    span.addEventListener('contextmenu', (e)=> e.preventDefault());
    span.addEventListener('mousedown', ()=> click = (click)? false: true);
    span.addEventListener('mouseup', ()=> click = (click)? false: true);

    span.style.width = `${ weight }px`;
    span.style.height = `${ weight }px`;
    span.style.top = position[1] - weight/2 + 'px';
    span.style.left = position[0] - weight/2 + 'px';
    body.appendChild(span);
  } else {
    hasSpan.style.background = color;
    hasSpan.style.width = `${ weight }px`;
    hasSpan.style.height = `${ weight }px`;
    hasSpan.style.top = position[1] - weight/2  + 'px';
    hasSpan.style.left = position[0] - weight/2  +'px';
  }
}

function removeEraserRange() {
  const span = document.querySelector('.eraserRange');
  const body = document.querySelector('body');
  if(span) body.removeChild(span);
}

export default function draw(info) {
  if(info === 'remove') {
    removeEraserRange();
    return;
  }
  const {pointA, pointB, weight} = info;
  if(!info.position) {
    if(pointA[0] > pointB[0]) {
      let aux = info.pointB;
      info.pointB = info.pointA;
      info.pointA = aux;
    }
    drawEvent(info);
  } else {
    const canvas = document.querySelector('canvas');
    canvas.style.cursor = 'none';
    eraserRange(info.position, info.color, weight);
  }
}