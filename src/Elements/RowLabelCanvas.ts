import { cellData } from "../DataStructures/CellData.js";
import { ColData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { selectionManager } from "../Interaction/SelectionManager.js";
import { excelRenderer, inputManager } from "../main.js";
import { CanvasLeftOffset } from "../Utils/GlobalVariables.js";

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
  private totalRows = 40;

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


    // === Events ===
    this.canvas.addEventListener("mousedown", this.handleMouseDownResize.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDownEventSelection.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));


    this.initCanvas(ctx);
    this.drawRows(ctx, rowId);
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

    let y = -0.5;
    for (let row = startRow; row < this.totalRows + startRow; row++) {
      const rowInfo = rowData.get(row);
      const nxtHeight = rowInfo ? rowInfo.height : this.cellHeight;

      const selectedCells = selectionManager.getCellSelection;
      let startRowIndex = selectedCells.startRow;
      let endRowIndex = selectedCells.endRow;
      let selectionState = selectedCells.selectionState;

      if ((startRowIndex > endRowIndex)) {
        [startRowIndex, endRowIndex] = [endRowIndex, startRowIndex]
      }

      let startMin = Math.min(selectionManager.RowSelectionStart, selectionManager.RowSelectionEnd);
      let startMax = Math.max(selectionManager.RowSelectionStart, selectionManager.RowSelectionEnd);
      let rowSelectionState = selectionManager.RowSelectionStatus;
      console.log(selectionManager.RowSelectionStart);

      // === Row Number Label Highlight ===
      if (((RowData.getSelectedRow() == row) || (rowSelectionState && startMin <= row && startMax >= row))) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px, Arial";
        
        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(this.canvas.width, y - 1);
        ctx.lineTo(this.canvas.width, y + nxtHeight + 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "green";
        ctx.stroke();
        
        // Horizontal separator line
        ctx.beginPath();
        ctx.moveTo(-2, y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#A0D8B9";
        ctx.lineTo(this.canvas.width - 2, y);
        ctx.stroke();
        
      } else if ((RowData.getSelectedCellRow() == row || ColData.getSelectedCol()) || (selectionState && startRowIndex <= row && endRowIndex >= row)) {
        ctx.fillStyle = "#A0D8B9";
        ctx.fillRect(0, y, 100, nxtHeight);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#0F703B";
        
        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(49, y - 1);
        ctx.lineTo(49, y + nxtHeight + 1);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0F703B";
        ctx.stroke();
        
        // Horizontal separator line
        ctx.beginPath();
        ctx.moveTo(-0.5, y);
        ctx.lineTo(48, y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#0F703B";
        ctx.stroke();
      } else {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, y, 100, nxtHeight);
        
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        
        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(49, y - 1);
        ctx.lineTo(49, y + nxtHeight + 1);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
        
        // Horizontal separator line
        if (endRowIndex == row - 1) {
          ctx.strokeStyle = "#0F703B";
        }
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineWidth = 1;
        ctx.lineTo(this.canvas.width, y);
        ctx.stroke();
      }

      // Draw row label text
      ctx.textAlign = "end";
      let rowStart = y;
      let rowEnd = y + nxtHeight;
      ctx.fillText((row + 1).toString(), 45, (rowStart + rowEnd) / 2 + 4);

      y += nxtHeight;
    }
  }


  /**
   * Handles click event for selecting a full row
   * @param e - Mouse event
   */
  private handleMouseDownEventSelection(e: MouseEvent) {
    e.preventDefault();
    if (this.skipClick) return;
    let y = 0.5;
    let offsetY = e.offsetY;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (offsetY >= y + 4 && offsetY <= y + height) {
        inputManager.inputDiv.style.left = `${CanvasLeftOffset}px`;
        selectionManager.RowSelectionStart = selectionManager.getCellSelection.currRow;
        selectionManager.RowSelectionEnd = selectionManager.getCellSelection.currRow;
        RowData.setSelectedCellRow(selectionManager.RowSelectionStart);
        ColData.setSelectedCellCol(0);
        selectionManager.RowSelectionStatus = true;
        selectionManager.set(selectionManager.RowSelectionStart, 0, selectionManager.RowSelectionStart, 0, true);
        inputManager.setInputLocation(selectionManager.RowSelectionStart, 0)
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
  private handleMouseDownResize(e: MouseEvent) {
    const offsetY = e.offsetY;
    const offsetX = e.offsetX;
    let y = 0;

    this.skipClick = false;

    selectionManager.set(-100, -100, -100, -100, false);

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
        this.isResizing = true;
        this.resizeStartY = offsetY;
        this.targetRow = row;
        this.skipClick = true;
        break;
      }
      if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
        this.skipClick = true;
        cellData.insertRowAt(row + 2);
        RowData.setSelectedRow(row + 1);
        rowData.insertRowAt(row + 1);
        RowData.setSelectedCellRow(null);
        excelRenderer.render();
        break;
      }

      y += height;
    }

  }

  /**
   * Handles mouse move to show resize cursor and perform resizing
   * @param e - Mouse event
   */
  private handleMouseMove(e: MouseEvent) {
    const offsetY = e.offsetY;
    const offsetX = e.offsetX;
    let y = 0.5;
    let found = false;
    let isRowAdd = false;

    for (let i = 0; i < this.totalRows; i++) {
      const row = this.startRow + i;
      const height = rowData.get(row)?.height ?? this.cellHeight;

      if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
        this.canvas.style.cursor = "s-resize";
        found = true;
        break;
      }
      if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
        this.canvas.style.cursor = "copy";
        isRowAdd = true;
        break;
      }

      y += height;
    }

    if (selectionManager.RowSelectionStatus) {
      selectionManager.RowSelectionEnd = selectionManager.getCellSelection.currRow;
      excelRenderer.render();
    }

    if (!found && !this.isResizing && !isRowAdd) {
      this.canvas.style.cursor = "url('../../build/style/cursor-right.png') 12 12, auto";
    }


    // === Resize logic ===
    if (this.isResizing && this.targetRow !== -1) {
      const diff = offsetY - this.resizeStartY;
      const currentHeight = rowData.get(this.targetRow)?.height ?? this.cellHeight;
      const newHeight = Math.max(20, currentHeight + diff);

      rowData.set(this.targetRow, newHeight);
      this.resizeStartY = offsetY;

      excelRenderer.render();
    }
  }

  /**
   * Handles mouse up to finish resizing
   */
  private handleMouseUp() {
    this.isResizing = false;
    selectionManager.RowSelectionStatus = false;
    selectionManager.RowSelectionStart = -100;
    selectionManager.RowSelectionEnd = -100;
    this.targetRow = -1;
  }
}

/** Singleton export for global use */
export const rowObj = new RowLabelCanvas(0);
