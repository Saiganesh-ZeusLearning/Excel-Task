const canvas = document.querySelector(".main-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.addEventListener("click", (e) => {
    console.log("x", e.clientX, "y", e.clientY);
})

// --- Config ---
const cellWidth = 100;
const cellHeight = 24;
const totalCols = 30;
const totalRows = 50;
canvas.height = cellHeight * totalRows;
canvas.width= cellWidth * totalCols;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let col = 0; col < totalCols; col++) {
    const x = col * cellWidth;

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
  }

  for (let row = 0; row < totalRows; row++) {
    const y =  row * cellHeight - 1;

    // Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
  }
}

drawGrid();
