interface rowMap{
    rowIndex: number;
    rowHeight: number;
    isSelected: boolean;
}

export class RowLabelCanvas {
  private canvas: HTMLCanvasElement;
  private rowWrapper: HTMLElement;

  private width = 50;
  private totalRows = 40;
  private headerWidth = 49;
  private headerHeight = 1;
  public cellHeight = 24;
  public height = this.totalRows * this.cellHeight + this.headerHeight;
  // public rowMap: rowMap;

  /**
   * Initializes the RowLabelCanvas class
   * @param rowId - ID of the canvas element in DOM
   */
  constructor(rowId: number) {
    this.rowWrapper = document.querySelector(".row-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("row-label");
    this.rowWrapper.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas(ctx);
    this.drawRows(ctx, rowId);
  }


  
  /**
   * Initializes canvas size and scaling for high DPI screens
   */
  initCanvas(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    ctx.scale(dpr, dpr);
  }

  get getRowCanvas() {
    return this.canvas;
  }
  
  /**
   * Draws row lines and row number labels
   */
  drawRows(ctx: CanvasRenderingContext2D, startRow: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let y = 0.5;
    for (let row = startRow; row < this.totalRows + startRow; row++) {
      
      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      
      // Draw row number
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "end";
      ctx.fillText((row + 1).toString(), 45, y + 16);
      y += this.cellHeight;
    }

    this.drawHeaderBorders(ctx);
  }

  /**
   * Draws the border lines
   */
  private drawHeaderBorders(ctx: CanvasRenderingContext2D): void {
    // Row border lines
    ctx.beginPath();
    ctx.moveTo(this.headerWidth, 0);
    ctx.lineTo(this.headerWidth + 0.5, this.canvas.height + 0.5);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
}


export const rowObj = new RowLabelCanvas(0);