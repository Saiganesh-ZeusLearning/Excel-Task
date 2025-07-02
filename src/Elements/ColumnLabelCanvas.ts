import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData } from "../DataStructures/RowData.js";
import { selectionManager } from "../Interaction/SelectionManager.js";
import { excelRenderer, inputManager } from "../main.js";

/**
 * Class responsible for rendering and interacting with the column label canvas (A, B, C...).
 */
export class ColumnLabelCanvas {
  /** @type {HTMLCanvasElement} Canvas element for column labels */
  private canvas: HTMLCanvasElement;

  /** @type {HTMLElement} Wrapper for column label canvas */
  private colWrapper: HTMLElement;

  /** @type {number} Starting column index for rendering */
  private startCol: number;

  /** @type {number} Height of the label area */
  private height = 25;

  /** @type {number} Default width for a column */
  public cellWidth = 100;

  /** @type {number} Total number of columns to render */
  private totalCols = 20;

  /** @type {number} Total canvas width based on totalCols and cellWidth */
  private width = this.totalCols * this.cellWidth + 1;

  public isMultipleColSelection: boolean = false;

  public ColSelectionStart: number = -1;

  public ColSelectionEnd: number = -1;

  /** @type {boolean} Whether column resizing is in progress */
  private isResizing = false;

  /** @type {number} X coordinate where resize started */
  private resizeStartX = 0;

  /** @type {number} Index of the column being resized */
  private targetCol = -1;

  /** @type {boolean} Prevents click action immediately after resize */
  private skipClick: boolean;

  /**
   * Initializes the ColumnLabelCanvas instance.
   * @param {number} colId - Column index to start drawing from.
   */
  constructor(colId: number) {
    this.colWrapper = document.querySelector(".col-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("col-label");
    this.colWrapper.appendChild(this.canvas);
    this.startCol = 0;
    this.skipClick = false;

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas(ctx);
    this.drawColumns(ctx, colId);

    // Attach event listeners
    this.canvas.addEventListener("mousedown", this.handleMouseDownResizing.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDownSelection.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * Getter to access the column canvas.
   * @returns {HTMLCanvasElement} Canvas element.
   */
  get getColCanvas() {
    return this.canvas;
  }

  /**
   * Initializes the canvas size and scales it for high-DPI screens.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
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
   * Draws the column headers and vertical grid lines.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   * @param {number} startCol - Column index to start drawing from.
   */
  drawColumns(ctx: CanvasRenderingContext2D, startCol: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /**
     * Converts a column number to its corresponding A-Z label.
     * @param {number} num - Column number (1-based).
     * @returns {string} Alphabetical label (e.g., A, B, ..., AA, AB, etc.)
     */
    function ColLabel(num: number): string {
      let label = "";
      num--;
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

      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x + nxtWidth, this.canvas.height);

      const selectedCells = selectionManager.get();

      let startColIndex = selectedCells.startCol;
      let endColIndex = selectedCells.endCol;
      let selectionState = selectedCells.selectionState;

      if (startColIndex > endColIndex) {
        [startColIndex, endColIndex] = [endColIndex, startColIndex]
      }

      let startMin = Math.min(this.ColSelectionStart, this.ColSelectionEnd);
      let startMax = Math.max(this.ColSelectionStart, this.ColSelectionEnd);

      // Highlight logic
      if (this.isMultipleColSelection && ColData.getSelectedCol() === col || startMin <= col && startMax >= col) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";

        // Draw horizontal line
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "green";
      } else if ((ColData.getSelectedCellCol() === col || RowData.getSelectedRow()) || (selectionState && startColIndex <= col && endColIndex >= col)) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "green";
        ctx.font = "12px sans-serif";

        // Draw horizontal line
        ctx.lineWidth = 3;
        ctx.strokeStyle = "green";
      } else {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";

        // Draw horizontal line
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ddd";
      }
      ctx.stroke();

      // Draw label
      const label = ColLabel(1 + col);
      ctx.fillText(label, x + nxtWidth / 2 - 5, 16);

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ddd";
      ctx.stroke();

      x += nxtWidth;
    }

  }

  /**
   * Handles column click event to select column.
   * @param {MouseEvent} e - Mouse click event.
   */
  private handleMouseDownSelection(e: MouseEvent) {
    e.preventDefault();
    if (this.skipClick) return;
    let x = 0.5;
    let offsetX = e.offsetX;

    for (let i = 0; i < this.totalCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? this.cellWidth;

      if (offsetX >= x + 4 && offsetX <= x + width) {
        // ColData.setSelectedCol(col);
        RowData.setSelectedRow(null);
        RowData.setSelectedCellRow(null);
        ColData.setSelectedCellCol(null);
        this.ColSelectionStart = selectionManager.get().currCol;
        this.ColSelectionEnd = selectionManager.get().currCol;
        this.isMultipleColSelection = true;
        selectionManager.set(-1, -1, -1, -1, false);
        excelRenderer.render();
        return;
      }
      x += width;
    }
  }

  /**
   * Handles mouse down event to initiate column resizing.
   * @param {MouseEvent} e - Mouse down event.
   */
  private handleMouseDownResizing(e: MouseEvent) {
    const offsetX = e.offsetX;
    let x = 0;

    this.skipClick = false;

    selectionManager.set(-1, -1, -1, -1, false);

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
    RowData.setSelectedCellRow(null);
    ColData.setSelectedCellCol(null);
  }

  /**
   * Handles mouse move event for column resizing and cursor feedback.
   * @param {MouseEvent} e - Mouse move event.
   */
  private handleMouseMove(e: MouseEvent) {
    const offsetX = e.offsetX;
    let x = 0;
    let found = false;

    for (let i = 0; i < this.totalCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? this.cellWidth;

      if (Math.abs(offsetX - (x + width)) <= 4) {
        this.canvas.style.cursor = "w-resize";
        found = true;
        break;
      }
      x += width;
    }

    
    if (this.isMultipleColSelection) {
      this.ColSelectionEnd = selectionManager.get().currCol;
      excelRenderer.render();
    }

    if (!found && !this.isResizing) {
      this.canvas.style.cursor = "url('../../build/style/cursor-down.png') 12 12, auto";
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

  /**
   * Handles mouse up event to finalize column resizing.
   */
  private handleMouseUp() {
    this.isResizing = false;
    this.isMultipleColSelection = false;

    this.ColSelectionStart = -1;
    this.ColSelectionEnd = -1;
    this.targetCol = -1;
    inputManager.scrollDiv.style.cursor = "cell";
  }
}

/** Singleton instance of ColumnLabelCanvas */
export const colObj = new ColumnLabelCanvas(0);
