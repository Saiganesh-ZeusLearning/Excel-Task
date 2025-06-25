export class ColumnLabelCanvas {
  private canvas: HTMLCanvasElement;
  private colWrapper: HTMLElement;

  private height = 25;
  private cellWidth = 100;
  private totalCols = 20;
  private headerWidth = 0;
  private headerHeight = 24;
  private width = this.totalCols * this.cellWidth + 1;

  /**
   * Initializes the ColumnLabelCanvas class
   * @param canvasId - ID of the canvas element in DOM
   */
  constructor(colId: number) {
    this.colWrapper = document.querySelector(".col-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("col-label");
    this.colWrapper.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas(ctx);
    this.drawColumns(ctx, colId);
  }


  get getColCanvas() {
    return this.canvas;
  }

  /**
   * Initializes canvas size and scaling for high DPI screens
   */
  private initCanvas(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    ctx.scale(dpr, dpr);
  }

  /**
   * Draws vertical lines and column labels (A-Z)
   */
  drawColumns(ctx: CanvasRenderingContext2D, scrollLeft: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Col Label Function
    function ColLabel(num: number): string {
      num--;
      if (num < 0) return "";
      return ColLabel(Math.floor(num / 26)) + String.fromCharCode("A".charCodeAt(0) + (num % 26));
    }
    for (let col = 0; col <= this.totalCols; col++) {
      const x = this.headerWidth + col * this.cellWidth;

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, this.canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      // Draw column label
      const colId = scrollLeft / 100;
      const label = ColLabel(col + (colId) + 1);
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText(label, x + 45, 16);
    }

    this.drawHeaderBorders(ctx);
  }

  /**
   * Draws header vertical/horizontal border lines
   */
  private drawHeaderBorders(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.headerWidth, 0);
    ctx.moveTo(0, this.headerHeight);
    ctx.lineTo(this.canvas.width, this.headerHeight);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
}
