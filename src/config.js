// Global Info

window.currentTool = null;
window.primaryColor = {r: 0, g: 0, b: 0};
window.secundaryColor = {r: 255, g: 255, b: 255};
window.radius = 5;
window.imageStack = [];
window.canvas = document.getElementById('canvas');
window.ctx = canvas.getContext('2d');
window.ctrlHold = false;

// Put size to canvas and set Context

window.canvasW = window.canvas.width = window.canvas.offsetWidth;
window.canvasH = window.canvas.height = window.canvas.offsetHeight;

window.ctx.fillStyle = 'white';
window.ctx.fillRect(0, 0, window.canvasW, window.canvasH);
window.ctx.lineWidth = window.radius;


// Push firt Image to the ImageStack

const imageData = ctx.getImageData(0, 0, window.canvasW, window.canvasH);
window.currentImage = imageData;
window.imageStack.push(imageData);


