class RowLabelCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private width = 51;
  private cellHeight = 24;
  private totalRows = 50;
  private headerWidth = 50;
  private headerHeight = 24;
  private height = this.totalRows*this.cellHeight + this.headerHeight;
  /**
   * Initializes the RowLabelCanvas class
   * @param canvasId - ID of the canvas element in DOM
   */
  constructor(canvasId: string) {
    this.canvas = document.querySelector(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas();
    this.drawRows();
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
   * Draws row lines and row number labels
   */
  private drawRows(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let row = 0; row < this.totalRows; row++) {
      const y = this.headerHeight + row * this.cellHeight;

      // Draw horizontal line
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.strokeStyle = "#ddd";
      this.ctx.stroke();

      // Draw row number
      this.ctx.fillStyle = "#000";
      this.ctx.font = "12px sans-serif";
      this.ctx.fillText((row + 1).toString(), 15, y + 16);
    }

    this.drawHeaderBorders();
  }

  /**
   * Draws the top-left box and header border lines
   */
  private drawHeaderBorders(): void {
    // Row border lines
    this.ctx.beginPath();
    this.ctx.moveTo(this.headerWidth, 0);
    this.ctx.lineTo(this.headerWidth, this.canvas.height);
    this.ctx.moveTo(0, this.headerHeight);
    this.ctx.lineTo(this.canvas.width, this.headerHeight);
    this.ctx.strokeStyle = "#000";
    this.ctx.stroke();
  }
}

// new RowLabelCanvas(".row-label");


export default RowLabelCanvas;