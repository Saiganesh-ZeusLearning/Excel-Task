import { ColData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { excelRenderer, inputManager } from "../main.js";

export class RowLabelCanvas {
  private canvas: HTMLCanvasElement;
  private rowWrapper: HTMLElement;

  private startRow: number = 0;
  private width = 50;
  private totalRows = 100;
  private headerWidth = 49;
  private headerHeight = 1;
  public cellHeight = 24;
  public height = this.totalRows * this.cellHeight + this.headerHeight;

  private isResizing = false;
  private resizeStartY = 0;
  private targetRow = -1;
  private skipClick = false;



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
    this.startRow = 0;

    this.initCanvas(ctx);
    this.drawRows(ctx, rowId);
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("click", this.handleClickEvent.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
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
    this.startRow = startRow;

    let y = 0.5;
    for (let row = startRow; row < this.totalRows + startRow; row++) {
      
      const rowInfo = rowData.get(row);
      const nxtHeight = rowInfo ? rowInfo.height : this.cellHeight;
      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      
      // Draw row number
      if (RowData.getSelectedRow() == row) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.fillStyle = "white"
        ctx.font = "bold 14px, Arial";
      } else if (RowData.getSelectedCellRow() == row) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.fillStyle = "green"
      } else {
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "end";
      }
      let rowStart = y;
      let rowEnd = y + nxtHeight;
      ctx.fillText((row + 1).toString(), 45, (rowStart + rowEnd) / 2 + 4);
      y += nxtHeight;
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

  private handleClickEvent(e: MouseEvent) {
    if (this.skipClick) return; // Skip if it was a resize

    let y = 0.5;
    let offsetY = e.offsetY;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (offsetY >= y + 4 && offsetY <= y + height) {
        RowData.setSelectedRow(row);
        RowData.setSelectedCellRow(null);
        ColData.setSelectedCellCol(null);
        excelRenderer.render();
        return;
      }

      y += height;
    }
  }


  private handleMouseDown(e: MouseEvent) {
    const offsetY = e.offsetY;
    let y = 0;

    this.skipClick = false; // Reset

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (Math.abs(offsetY - (y + height)) <= 4) {
        this.isResizing = true;
        this.resizeStartY = offsetY;
        this.targetRow = row;
        this.skipClick = true; // Prevent click handler
        break;
      }

      y += height;
    }

    inputManager.inputDiv.style.display = "none";
  }



  private handleMouseMove(e: MouseEvent) {
    const offsetY = e.offsetY;
    let y = 0.5;
    let found = false;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (Math.abs(offsetY - (y + height)) <= 4) {
        this.canvas.style.cursor = "row-resize";
        found = true;
        break;
      }
      y += height;
    }

    if (!found && !this.isResizing) {
      this.canvas.style.cursor = "default";
    }

    // Resize logic
    if (this.isResizing && this.targetRow !== -1) {
      const diff = offsetY - this.resizeStartY;
      const currentHeight = rowData.get(this.targetRow)?.height ?? this.cellHeight;
      const newHeight = Math.max(20, currentHeight + diff); // min height = 10

      rowData.set(this.targetRow, newHeight);
      this.resizeStartY = offsetY;

      const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
      this.initCanvas(ctx);
      this.drawRows(ctx, this.startRow); // ← use scroll-adjusted startRow

      excelRenderer.render(); // Trigger full re-render
    }
  }


  private handleMouseUp() {
    this.isResizing = false;
    this.targetRow = -1;
  }

}




export const rowObj = new RowLabelCanvas(0);