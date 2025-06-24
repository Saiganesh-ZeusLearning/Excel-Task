class ColumnLabelCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private height = 25;
  private cellWidth = 100;
  private totalCols = 30;
  private headerWidth = 0;
  private headerHeight = 24;
  private width = this.totalCols * this.cellWidth;

  /**
   * Initializes the ColumnLabelCanvas class
   * @param canvasId - ID of the canvas element in DOM
   */
  constructor(canvasId: string) {
    this.canvas = document.querySelector(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas();
    this.drawColumns();
  }

  /**
   * Initializes canvas size and scaling for high DPI screens
   */
  private initCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Draws vertical lines and column labels (A-Z)
   */
  private drawColumns(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let col = 0; col < this.totalCols; col++) {
      const x = this.headerWidth + col * this.cellWidth;

      // Draw vertical line
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.strokeStyle = "#ddd";
      this.ctx.stroke();

      // Draw column label
      const label = String.fromCharCode(65 + col); // A, B, C...
      this.ctx.fillStyle = "#000";
      this.ctx.font = "12px sans-serif";
      this.ctx.fillText(label, x + 45, 16);
    }

    this.drawHeaderBorders();
  }

  /**
   * Draws header vertical/horizontal border lines
   */
  private drawHeaderBorders(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.headerWidth, 0);
    this.ctx.moveTo(0, this.headerHeight);
    this.ctx.lineTo(this.canvas.width, this.headerHeight);
    this.ctx.strokeStyle = "#000";
    this.ctx.stroke();
  }
}

new ColumnLabelCanvas(".col-label");