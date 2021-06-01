// Flood fill Algorithm 4-way method


export default function floodFill(x, y, width, height, startColor, newColor, img) {
  if(compareColors(startColor, newColor)) return;

  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];
  const stack = [{x, y}];
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

function isEqual(x, y, width,startColor, img) {
  const index = (x + y * width) * 4;
  const color = {
    r: img.data[index],
    g: img.data[index + 1],
    b: img.data[index + 2]
  }
  return (color.r === startColor.r && color.g === startColor.g && color.b === startColor.b);
}