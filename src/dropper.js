export default function getColor(x, y, width, img) {
  const index = (x + y * width) * 4;
  const color = { 
    r: img.data[index],
    g: img.data[index + 1],
    b: img.data[index + 2]
  }
  return color;
}
