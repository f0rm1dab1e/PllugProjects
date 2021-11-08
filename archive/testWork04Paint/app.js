const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.width = 750;
canvas.height = 500;

context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);

const colorPanel = document.querySelector("#colors");
const tools = [...document.querySelectorAll(".tool")];

// properties
const lineWidth = document.querySelector("#lineWidth");
const mainBtnColor = document.querySelector("#main-bnt-color");
const contextMenuBtnColor = document.querySelector("#context-menu-bnt-color");
const cleanCanvasBtn = document.querySelector("#clean-canvas");
const saveCanvasBtn = document.querySelector("#save-canvas");
const fillCheckbox = document.querySelector("#fill-checkbox");

// instruments
const pencil = document.querySelector("#pencil");
const eraser = document.querySelector("#eraser");
const line = document.querySelector("#line");
const circle = document.querySelector("#circle");
const rectangle = document.querySelector("#rectangle");
const rightTriangle = document.querySelector("#right-triangle");
const star = document.querySelector("#star");
const cloudlet = document.querySelector("#cloudlet");

let saveImgData;
let isMouseDown = false;

const startCoords = {
  x: 0,
  y: 0,
};

const properties = {
  width: 8,
  mainBtnColor: "#000000",
  contextBtnColor: "#ffffff",
  currentColor: "#000000",
  fillElement: false,
  instrumentType: {
    pencil: true,
    eraser: false,
    line: false,
    circle: false,
    rectangle: false,
    rightTriangle: false,
    star: false,
    cloudlet: false,
  },
};

// adaptive canvas
window.addEventListener("resize", (event) => {
  if (event.target.outerWidth < 767) {
    canvas.width = 320;
    canvas.height = 500;
  } else {
    canvas.width = 750;
    canvas.height = 500;
  }
});

// mouse events listeners
canvas.addEventListener("mousedown", (event) => {
  startCoords.x = event.offsetX;
  startCoords.y = event.offsetY;

  saveCanvas();
  if (!properties.eraser) {
    properties.currentColor =
      event.button === 2 ? properties.contextBtnColor : properties.mainBtnColor;
  }
  isMouseDown = true;
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  context.beginPath();
});

canvas.addEventListener("mousemove", (event) => {
  if (!isMouseDown) {
    return;
  }
  const [x, y] = [event.offsetX, event.offsetY];

  if (properties.instrumentType.pencil) {
    pencilDrawing(x, y);
  } else if (properties.instrumentType.eraser) {
    eraserDrawing(x, y);
  } else if (properties.instrumentType.line) {
    restoreCanvas();
    lineDrawing(x, y);
  } else if (properties.instrumentType.circle) {
    restoreCanvas();
    circleDrawing(x, y);
  } else if (properties.instrumentType.rectangle) {
    restoreCanvas();
    rectangleDrawing(x, y);
  } else if (properties.instrumentType.rightTriangle) {
    restoreCanvas();
    rightTriangleDrawing(x, y);
  } else if (properties.instrumentType.star) {
    restoreCanvas();
    starDrawing(x, y);
  } else if (properties.instrumentType.cloudlet) {
    restoreCanvas();
    cloudletDrawing(x, y);
  }
});

cleanCanvasBtn.addEventListener("click", clearCanvas);

saveCanvasBtn.addEventListener("click", saveImgToDesktop, false);

// listeners for properties
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

lineWidth.addEventListener("change", (event) => {
  properties.width = event.target.value;
});

mainBtnColor.addEventListener("change", (event) => {
  properties.mainBtnColor = event.target.value;
});

contextMenuBtnColor.addEventListener("change", (event) => {
  properties.contextBtnColor = event.target.value;
});

fillCheckbox.addEventListener("click", (event) => {
  properties.fillElement = properties.fillElement ? false : true;
});

// get color for mouse buttons
colorPanel.addEventListener("click", (event) => {
  if (event.target.classList.contains("colors")) return;
  const elBg = event.target.style.backgroundColor;
  properties.mainBtnColor = elBg;
  mainBtnColor.value = rgbToHex(elBg);
});

colorPanel.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("colors")) return;
  const elBg = event.target.style.backgroundColor;
  properties.contextBtnColor = elBg;
  contextMenuBtnColor.value = rgbToHex(elBg);
});

// tool selection
pencil.addEventListener("click", (event) => {
  changeCurrentInstrument("pencil", event.target);
});

eraser.addEventListener("click", (event) => {
  changeCurrentInstrument("eraser", event.target);
  canvas.classList.add("eraser-cursor");
});

line.addEventListener("click", (event) => {
  changeCurrentInstrument("line", event.target);
});

circle.addEventListener("click", (event) => {
  changeCurrentInstrument("circle", event.target);
});

rectangle.addEventListener("click", (event) => {
  changeCurrentInstrument("rectangle", event.target);
});

rightTriangle.addEventListener("click", (event) => {
  changeCurrentInstrument("rightTriangle", event.target);
});

star.addEventListener("click", (event) => {
  changeCurrentInstrument("star", event.target);
});

cloudlet.addEventListener("click", (event) => {
  changeCurrentInstrument("cloudlet", event.target);
});

// other functions
function rgbToHex(color) {
  function toHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  color = color
    .replace(/[a-z()\s]/g, "")
    .split(",")
    .map((c) => +c);

  return `#${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`;
}

function changeCurrentInstrument(currentInstrument, target) {
  for (let key in properties.instrumentType) {
    properties.instrumentType[key] = false;
  }
  properties.instrumentType[currentInstrument] = true;
  canvas.classList.remove("eraser-cursor");

  tools.forEach((tool) => {
    tool.classList.remove("active");
  });
  target.classList.add("active");
}

function clearCanvas() {
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
  saveImgData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreCanvas() {
  context.putImageData(saveImgData, 0, 0);
}

function saveImgToDesktop() {
  this.href = canvas.toDataURL("png/*");
}

// tools event
function pencilDrawing(x, y) {
  context.lineTo(x, y);
  context.lineWidth = properties.width;
  context.strokeStyle = properties.currentColor;
  context.stroke();

  context.fillStyle = properties.currentColor;
  context.arc(x, y, properties.width / 2, 0, 2 * Math.PI);
  context.fill();

  context.beginPath();
  context.moveTo(x, y);
}

function eraserDrawing(x, y) {
  context.lineTo(x, y);
  context.lineWidth = 30;
  context.strokeStyle = "#ffffff";
  context.stroke();
}

function lineDrawing(x, y) {
  context.beginPath();
  context.lineWidth = properties.width;
  context.strokeStyle = properties.currentColor;
  context.moveTo(startCoords.x, startCoords.y);
  context.lineTo(x, y);
  context.stroke();
}

function circleDrawing(x, y) {
  const radius = Math.sqrt(
    Math.pow(x - startCoords.x, 2) + Math.pow(y - startCoords.y, 2)
  );
  context.lineWidth = properties.width;
  context.strokeStyle = context.fillStyle = properties.currentColor;
  context.beginPath();
  context.arc(x, y, radius, 0, 2.0 * Math.PI);
  context.stroke();
  if (properties.fillElement) context.fill();
}

function rectangleDrawing(x, y) {
  context.lineWidth = properties.width;
  context.strokeStyle = context.fillStyle = properties.currentColor;
  context.beginPath();
  context.rect(
    startCoords.x,
    startCoords.y,
    x - startCoords.x,
    y - startCoords.y
  );
  context.stroke();
  if (properties.fillElement) context.fill();
}

function rightTriangleDrawing(x, y) {
  context.lineWidth = properties.width;
  context.strokeStyle = context.fillStyle = properties.currentColor;
  context.beginPath();
  context.moveTo(startCoords.x, startCoords.y);
  context.lineTo(startCoords.x, y);
  context.lineTo(x, y);
  context.closePath();
  context.stroke();
  if (properties.fillElement) context.fill();
}

function starDrawing(mouseX, mouseY) {
  context.lineWidth = properties.width;
  context.strokeStyle = context.fillStyle = properties.currentColor;

  const spikes = 5;
  const outerRadius = startCoords.x - mouseX;
  const innerRadius = (startCoords.x - mouseX) / 2;

  let x = startCoords.x;
  let y = startCoords.y;

  let rot = (Math.PI / 2) * 3;
  let step = Math.PI / spikes;

  context.beginPath();
  context.moveTo(startCoords.x, startCoords.y - outerRadius);
  for (i = 0; i < spikes; i++) {
    x = startCoords.x + Math.cos(rot) * outerRadius;
    y = startCoords.y + Math.sin(rot) * outerRadius;
    context.lineTo(x, y);
    rot += step;

    x = startCoords.x + Math.cos(rot) * innerRadius;
    y = startCoords.y + Math.sin(rot) * innerRadius;
    context.lineTo(x, y);
    rot += step;
  }
  context.lineTo(startCoords.x, startCoords.y - outerRadius);
  context.closePath();
  context.stroke();
  if (properties.fillElement) context.fill();
}

function cloudletDrawing(x, y) {
  const cof = Math.sqrt(Math.pow(x - startCoords.x, 2)) / 50;
  context.lineWidth = properties.width;
  context.strokeStyle = context.fillStyle = properties.currentColor;

  context.beginPath();
  context.arc(startCoords.x, startCoords.y, 50 * cof, 2, 1.7 * Math.PI);
  context.arc(
    startCoords.x + 83 * cof,
    startCoords.y - 30 * cof,
    55 * cof,
    3.4,
    1.95 * Math.PI
  );
  context.arc(
    startCoords.x + 185 * cof,
    startCoords.y,
    55 * cof,
    3.75,
    2.3 * Math.PI
  );
  context.closePath();
  context.stroke();
  if (properties.fillElement) context.fill();
}
