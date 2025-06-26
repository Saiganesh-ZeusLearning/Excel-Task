import { cellData } from "../DataStructures/CellData.js";

export class GridCanvas {
  canvas: HTMLCanvasElement;
  cellWidth: number = 100;
  cellHeight: number = 24;
  totalCols: number = 20;
  totalRows: number = 40;
  mainCanvasWrapper: HTMLElement;

  constructor() {
    this.mainCanvasWrapper = document.querySelector(".main-canvas-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("main-canvas");
    this.mainCanvasWrapper.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.cellWidth = this.cellWidth;
    this.cellHeight = this.cellHeight;
    this.totalCols = this.totalCols;
    this.totalRows = this.totalRows;

    this.setCanvasSize();
    this.drawGrid(ctx, 0, 0);
  }


  get getGridCanvas() {
    return this.canvas;
  }


  setCanvasSize() {
    this.canvas.width = this.cellWidth * this.totalCols + 1;
    this.canvas.height = this.cellHeight * this.totalRows + 1;
  }


  drawGrid(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Vertical lines
    let x = 0.5;

    for (let col = startCol; col <= this.totalCols + startCol; col++) {

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      x += this.cellWidth;
    }

    // Horizontal lines
    let y = 0.5;
    for (let row = startRow; row <= this.totalRows + startRow; row++) {

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      y += this.cellHeight;
    }

    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";
    for (let r = 0; r < this.totalRows; r++) {
      const rowIndex = startRow + r + 1;

      for (let c = 0; c < this.totalCols; c++) {
        const colIndex = startCol + c + 1;

        if (cellData.has(rowIndex, colIndex)) {
          const text = `${cellData.get(rowIndex, colIndex)}`;
          ctx.fillText(text, c * 100 + 5, r * 24 + 17);
        }
      }
    }
  }
}

export const gridObj = new GridCanvas();
