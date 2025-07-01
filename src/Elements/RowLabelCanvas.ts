import { ColData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { excelRenderer, inputManager } from "../main.js";

/**
 * Handles rendering and interaction for row labels in the Excel grid.
 * Supports row selection and row height resizing.
 */
export class RowLabelCanvas {
  /** Canvas element for row labels */
  private canvas: HTMLCanvasElement;

  /** Container element for the row label canvas */
  private rowWrapper: HTMLElement;

  /** Starting row index to render from */
  private startRow: number = 0;

  /** Width of the row label area */
  private width = 50;

  /** Total number of rows */
  private totalRows = 100;

  /** Default cell height */
  public cellHeight = 24;

  /** Total canvas height (for all rows) */
  public height = this.totalRows * this.cellHeight;

  /** Resizing state tracking */
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

    // === Events ===
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("click", this.handleClickEvent.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * Initializes canvas size and scaling for high DPI screens
   * @param ctx - 2D drawing context
   */
  initCanvas(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    ctx.scale(dpr, dpr);
  }

  /**
   * Returns the current canvas
   */
  get getRowCanvas() {
    return this.canvas;
  }

  /**
   * Draws row lines and row number labels
   * @param ctx - 2D drawing context
   * @param startRow - Index of first row to render
   */
  drawRows(ctx: CanvasRenderingContext2D, startRow: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.startRow = startRow;

    let y = 0.5;
    for (let row = startRow; row < this.totalRows + startRow; row++) {
      const rowInfo = rowData.get(row);
      const nxtHeight = rowInfo ? rowInfo.height : this.cellHeight;

        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(this.canvas.width, y + nxtHeight);

      // === Row Number Label Highlight ===
      if (RowData.getSelectedRow() == row) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px, Arial";

        // Vertical separator line
        ctx.lineWidth = 1;
        ctx.strokeStyle = "green";
      } else if (RowData.getSelectedCellRow() == row || ColData.getSelectedCol()) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#0F703B";

        // Vertical separator line
        ctx.lineWidth = 4;
        ctx.strokeStyle = "green";
      } else {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, y, 100, nxtHeight);

        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";

        // Vertical separator line
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ddd";
      }
      ctx.stroke();

      
      // Draw row label text
      ctx.textAlign = "end";
      let rowStart = y;
      let rowEnd = y + nxtHeight;
      ctx.fillText((row + 1).toString(), 45, (rowStart + rowEnd) / 2 + 4);
      
      // Horizontal separator line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineWidth = 1;
      ctx.lineTo(this.canvas.width, y);
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      y += nxtHeight;
    }
  }


  /**
   * Handles click event for selecting a full row
   * @param e - Mouse event
   */
  private handleClickEvent(e: MouseEvent) {
    if (this.skipClick) return;

    let y = 0.5;
    let offsetY = e.offsetY;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (offsetY >= y + 4 && offsetY <= y + height) {
        RowData.setSelectedRow(row);
        ColData.setSelectedCol(null);
        RowData.setSelectedCellRow(null);
        ColData.setSelectedCellCol(null);
        excelRenderer.render();
        return;
      }

      y += height;
    }
  }

  /**
   * Handles mouse down for initiating row resize
   * @param e - Mouse event
   */
  private handleMouseDown(e: MouseEvent) {
    const offsetY = e.offsetY;
    let y = 0;

    this.skipClick = false;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (Math.abs(offsetY - (y + height)) <= 4) {
        this.isResizing = true;
        this.resizeStartY = offsetY;
        this.targetRow = row;
        this.skipClick = true;
        break;
      }

      y += height;
    }

    inputManager.inputDiv.style.display = "none";
    RowData.setSelectedCellRow(null);
    ColData.setSelectedCellCol(null);
  }

  /**
   * Handles mouse move to show resize cursor and perform resizing
   * @param e - Mouse event
   */
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

    // === Resize logic ===
    if (this.isResizing && this.targetRow !== -1) {
      const diff = offsetY - this.resizeStartY;
      const currentHeight = rowData.get(this.targetRow)?.height ?? this.cellHeight;
      const newHeight = Math.max(20, currentHeight + diff);

      rowData.set(this.targetRow, newHeight);
      this.resizeStartY = offsetY;

      const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
      this.initCanvas(ctx);
      this.drawRows(ctx, this.startRow);
      excelRenderer.render();
    }
  }

  /**
   * Handles mouse up to finish resizing
   */
  private handleMouseUp() {
    this.isResizing = false;
    this.targetRow = -1;
  }
}

/** Singleton export for global use */
export const rowObj = new RowLabelCanvas(0);
