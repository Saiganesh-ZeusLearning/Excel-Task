import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData } from "../DataStructures/RowData.js";
import { excelRenderer, inputManager } from "../main.js";

export class ColumnLabelCanvas {
  private canvas: HTMLCanvasElement;
  private colWrapper: HTMLElement;

  private startCol: number;
  private height = 25;
  public cellWidth = 100;
  private totalCols = 20;
  private headerWidth = 0;
  private headerHeight = 24;
  private width = this.totalCols * this.cellWidth + 1;

  private isResizing = false;
  private resizeStartX = 0;
  private targetCol = -1;
  private skipClick: boolean;


  /**
   * Initializes the ColumnLabelCanvas class
   * @param canvasId - ID of the canvas element in DOM
   */
  constructor(colId: number) {
    this.colWrapper = document.querySelector(".col-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("col-label");
    this.colWrapper.appendChild(this.canvas);
    this.startCol = 0;
    this.skipClick = false;
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas(ctx);
    this.drawColumns(ctx, colId);
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("click", this.handleClickEvent.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
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

    for (let col = startCol; col <= startCol + this.totalCols; col++) {
      this.startCol = startCol;
      const colInfo = colData.get(col);
      const nxtWidth = colInfo ? colInfo.width : this.cellWidth;
      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      // Draw column label
      if (ColData.getSelectedCol() == col) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "white"
        ctx.font = "bold 14px, Arial";
      } else if (ColData.getSelectedCellCol() == col) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "green"
      } else {
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
      }
      const label = ColLabel(1 + col);
      let colStart = x;
      let colEnd = x + nxtWidth;
      ctx.fillText(label, (colStart + colEnd) / 2 - 5, 16);
      x += nxtWidth;
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

  private handleClickEvent(e: MouseEvent) {
    if (this.skipClick) return;

    let x = 0.5;
    let offsetX = e.offsetX;

    for (let i = 0; i < this.totalCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? this.cellWidth;

      if (offsetX >= x + 4 && offsetX <= x + width) {
        ColData.setSelectedCol(col);
        RowData.setSelectedCellRow(null);
        ColData.setSelectedCellCol(null);
        excelRenderer.render();
        return;
      }
      x += width;
    }

  }


  private handleMouseDown(e: MouseEvent) {
    const offsetX = e.offsetX;
    let x = 0;

    this.skipClick = false;

    for (let i = 0; i < this.totalCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? this.cellWidth;

      if (Math.abs(offsetX - (x + width)) <= 4) {
        this.isResizing = true;
        this.resizeStartX = offsetX;
        this.targetCol = col;
        this.skipClick = true;
        break;
      }

      x += width;
    }
    inputManager.inputDiv.style.display = "none";
  }


  private handleMouseMove(e: MouseEvent) {
    const offsetX = e.offsetX;
    let x = 0;
    let found = false;

    for (let i = 0; i < this.totalCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? this.cellWidth;

      if (Math.abs(offsetX - (x + width)) <= 4) {
        this.canvas.style.cursor = "col-resize";
        found = true;
        break;
      }

      x += width;
    }

    if (!found && !this.isResizing) {
      this.canvas.style.cursor = "default";
    }

    if (this.isResizing && this.targetCol !== -1) {
      const diff = offsetX - this.resizeStartX;
      const currentWidth = colData.get(this.targetCol)?.width ?? this.cellWidth;
      const newWidth = Math.max(30, currentWidth + diff);
      colData.set(this.targetCol, newWidth);

      this.resizeStartX = offsetX;
      excelRenderer.render();
    }
  }


  private handleMouseUp() {
    this.isResizing = false;
    this.targetCol = -1;
    inputManager.scrollDiv.style.cursor = "default";
  }

}


export const colObj = new ColumnLabelCanvas(0);
