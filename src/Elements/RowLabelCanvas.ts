import { CellData } from "../DataStructures/CellData.js";
import { RowData } from "../DataStructures/RowData.js";
import { cellHeight, totalVisibleRows } from "../Utils/GlobalVariables.js";
import { ColData } from "../DataStructures/ColData.js";

/**
 * Handles rendering and interaction for row labels in the Excel grid.
 * Supports row selection and row height resizing.
 */
export class RowLabelCanvas {
  /** Canvas element for row labels */
  private canvas: HTMLCanvasElement;
  private inputDiv: HTMLInputElement;

  /** Container element for the row label canvas */
  private rowWrapper: HTMLElement;

  /** Starting row index to render from */
  private startRow: number = 0;

  /** Width of the row label area */
  private width = 50;

  /** Total canvas height (for all rows) */
  public height = totalVisibleRows * cellHeight;

  private rowData: RowData;
  private colData: ColData;
  private cellData: CellData;

  /**
   * Initializes the RowLabelCanvas class
   * @param rowId - ID of the canvas element in DOM
   */
  constructor(rowData: RowData, colData: ColData,
    cellData: CellData
  ) {
    this.rowData = rowData;
    this.colData = colData;
    this.cellData = cellData;

    this.rowWrapper = document.querySelector(".row-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;
    this.canvas.classList.add("row-label");
    this.rowWrapper.appendChild(this.canvas);

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.startRow = 0;

    this.initCanvas(ctx);
    this.drawRows(ctx, 0);
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

  get getStartRow() {
    return this.startRow;
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
    for (let row = startRow; row < totalVisibleRows + startRow; row++) {
      const rowInfo = this.rowData.get(row);
      const nxtHeight = rowInfo ? rowInfo.height : cellHeight;

      const selectedCells = this.cellData.getCellSelection;
      let startRowIndex = selectedCells.startRow;
      let endRowIndex = selectedCells.endRow;
      let selectionState = selectedCells.selectionState;

      if ((startRowIndex > endRowIndex)) {
        [startRowIndex, endRowIndex] = [endRowIndex, startRowIndex]
      }


      let startMin = Math.min(this.rowData.RowSelection.startRow, this.rowData.RowSelection.endRow);
      let startMax = Math.max(this.rowData.RowSelection.startRow, this.rowData.RowSelection.endRow);
      let rowSelectionState = this.rowData.RowSelection.selectionState;

      // === Row Number Label Highlight ===
      if (((rowSelectionState && startMin <= row && startMax >= row))) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(0, y, 50, nxtHeight);
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

      } else if ((selectionState && startRowIndex <= row && endRowIndex >= row)
        || (this.colData.ColSelection.selectionState)
      ) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(0, y, 50, nxtHeight);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#0F703B";

        // Horizontal separator line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(48, y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#A0D8B9";
        ctx.stroke();

        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(49.5, y);
        ctx.lineTo(49.5, y + nxtHeight + 1);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "green";
        ctx.stroke();


      } else {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, y, 100, nxtHeight);

        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";


        // Horizontal separator line
        ctx.beginPath();
        if (endRowIndex == row - 1) {
          ctx.strokeStyle = "#A0D8B9";
          ctx.moveTo(0, y);
          ctx.lineTo(48, y);
        } else {
          ctx.moveTo(0, y);
          ctx.lineTo(this.canvas.width, y);
        }
        ctx.lineWidth = 1;
        ctx.stroke();


        // Vertical separator line
        ctx.beginPath();
        ctx.moveTo(49.5, y - 1);
        ctx.lineTo(49.5, y + nxtHeight + 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ddd";
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
}
