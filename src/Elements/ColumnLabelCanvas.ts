export class ColumnLabelCanvas {
  private canvas: HTMLCanvasElement;
  private colWrapper: HTMLElement;

  private height = 25;
  public cellWidth = 100;
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
  drawColumns(ctx: CanvasRenderingContext2D, startCol: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Col Label Function
    function ColLabel(num: number): string {
      let label = "";
      num--; // Adjust to 0-based index

      while (num >= 0) {
        label = String.fromCharCode("A".charCodeAt(0) + (num % 26)) + label;
        num = Math.floor(num / 26) - 1;
      }

      return label;
    }


    let x = 0.5;

    for (let col = 0 + startCol; col <= startCol + this.totalCols; col++) {

      // if(col === 5){
      //   x += this.cellWidth;
      // }
      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      // Draw column label
      const label = ColLabel(1 + col);
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText(label, x + 45, 16);
      x += this.cellWidth
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


export const colObj = new ColumnLabelCanvas(0);
