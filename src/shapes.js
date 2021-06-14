export default function drawLine(pointA, pointB, color, lineWidth, ctx) {
  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.strokeStyle = rgbColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(pointA[0], pointA[1]);
  ctx.lineTo(pointB[0], pointB[1]);
  ctx.stroke();
}