// variables
const canvas = document.getElementById('wall');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const eraserBtn = document.getElementById('eraserBtn');
const sprayBtn = document.getElementById('sprayBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const undoBtn = document.getElementById('undoBtn');
const history = [];
const maxHistory = 50;


let isDrawing = false;
let isEraser = false;
let isSpray = false;
let brushColor = '#000';
let brushSize = 5;

// intial canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

// canvas - event listeners
canvas.addEventListener('mousedown', () => {
    isDrawing = true;
    if (history.length >= maxHistory) history.shift();
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// working of buttons
colorPicker.addEventListener('input', e => {
    brushColor = e.target.value;
    isEraser = false;
});

sizePicker.addEventListener('input', e => {
    brushSize = e.target.value;
});

eraserBtn.addEventListener('click', () => {
    isEraser = true;
    isSpray = false;
});

sprayBtn.addEventListener('click', () => {
    isSpray = !isSpray;
    isEraser = false;
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// function to draw
function draw(e) {
    if (!isDrawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    if (isSpray) {
        for (let i = 0; i < 20; i++) {
            const offsetX = (Math.random() - 0.5) * brushSize * 2;
            const offsetY = (Math.random() - 0.5) * brushSize * 2;
            ctx.fillStyle = isEraser ? '#ffffff' : brushColor;
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        return;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
        const prevState = history.pop();
        ctx.putImageData(prevState, 0, 0);
    }
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'virtual-wall.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
