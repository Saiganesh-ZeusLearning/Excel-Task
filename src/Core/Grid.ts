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


  drawGrid(ctx: CanvasRenderingContext2D, scrollTop: number, scrollLeft: number) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Vertical lines
    for (let col = 0; col <= this.totalCols; col++) {
      const x = col * this.cellWidth;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, this.canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
    }

    // Horizontal lines
    for (let row = 0; row <= this.totalRows; row++) {
      const y = row * this.cellHeight - 1;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(this.canvas.width, y + 0.5);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
    }
  }
}

