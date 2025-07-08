import { cellData } from "../DataStructures/CellData.js";
import { colData } from "../DataStructures/ColData.js";
import { rowData } from "../DataStructures/RowData.js";
import { SelectionManager } from "../Interaction/SelectionManager.js";
import { cellHeight, cellWidth, totalVisibleCols, totalVisibleRows } from "../Utils/GlobalVariables.js";
import { ExcelRenderer } from "./ExcelRenderer.js";

/**
 * Class responsible for rendering the main grid canvas including cells, grid lines, and cell data.
 */
export class GridCanvas {
  /** @type {HTMLCanvasElement} The canvas element used for grid drawing */
  private canvas: HTMLCanvasElement;
  private selectionManager: SelectionManager | null;


  /** @type {number} Width of the entire grid in pixels */
  private width: number;
  /** @type {number} Height of the entire grid in pixels */
  private height: number;

  /** @type {HTMLElement} Wrapper element holding the canvas */
  private mainCanvasWrapper: HTMLElement;

  /**
   * Initializes the GridCanvas, creates the canvas element, and triggers initial draw.
   */
  constructor(selectionManager: SelectionManager) {
    this.mainCanvasWrapper = document.querySelector(".main-canvas-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("main-canvas");
    this.mainCanvasWrapper.appendChild(this.canvas);
    this.selectionManager = selectionManager;

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.height = cellHeight * totalVisibleRows;
    this.width = cellWidth * totalVisibleCols;
    this.initCanvas(ctx);
    this.drawGrid(ctx, 0, 0);
  }

  /**
   * Returns the canvas used for drawing the grid.
   * @returns {HTMLCanvasElement}
   */
  get getGridCanvas() {
    return this.canvas;
  }

  /**
   * Initializes the canvas size and scales it according to the device pixel ratio.
   * @param {CanvasRenderingContext2D} ctx - The 2D context of the canvas.
   * @private
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
   * Draws vertical grid lines with special styling if a column is selected.
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on.
   * @param {number} startRow - Starting row index.
   * @param {number} startCol - Starting column index.
   */
  drawVerticalGridLines(ctx: CanvasRenderingContext2D, startCol: number) {
    let x = -0.5;
    for (let col = startCol; col < startCol + totalVisibleCols; col++) {
      const colWidth = colData.get(col)?.width ?? cellWidth;
      let lineHeight = 0;
if(this.selectionManager === null) return;
      let startMin = Math.min(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);
      let startMax = Math.max(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);

      if ((startMin == col && this.selectionManager.ColSelection.selectionState)) {
        lineHeight = 1.3;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
      } else if ((startMax == col - 1 && this.selectionManager.ColSelection.selectionState)) {
        lineHeight = -1.3;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(x + lineHeight, 0);
      ctx.lineTo(x + lineHeight, this.canvas.height);
      ctx.stroke();
      x += colWidth;
    }
  }

  /**
   * Draws horizontal grid lines with special styling if a row is selected.
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on.
   * @param {number} startRow - Starting row index.
   * @param {number} startCol - Starting column index.
   */
  drawHorizontalGridLines(ctx: CanvasRenderingContext2D, startRow: number) {
    let y = -0.5;
    for (let row = startRow; row <= startRow + totalVisibleRows; row++) {
      const rowHeight = rowData.get(row)?.height ?? cellHeight;
      let lineHeight = 0;
      if(this.selectionManager === null) return;
      let startMin = Math.min(this.selectionManager.RowSelection.startRow, this.selectionManager.RowSelection.endRow);
      let startMax = Math.max(this.selectionManager.RowSelection.startRow, this.selectionManager.RowSelection.endRow);

      if ((startMin == row && this.selectionManager.RowSelection.selectionState)) {
        lineHeight = 1.5;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
      } else if ((startMax == row - 1 && this.selectionManager.RowSelection.selectionState)) {
        lineHeight = -1.5;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(0, y + lineHeight);
      ctx.lineTo(this.canvas.width, y + lineHeight);
      ctx.stroke();
      y += rowHeight;
    }
  }

  /**
   * Draws the text inside each cell and applies selection background color if applicable.
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on.
   * @param {number} startRow - Starting row index.
   * @param {number} startCol - Starting column index.
   */
  drawCellData(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {
    let yPos = 0;

    for (let r = 0; r < totalVisibleRows; r++) {
      const rowIndex = startRow + r;
      const rowHeight = rowData.get(rowIndex)?.height ?? cellHeight;

      let xPos = 0;
      for (let c = 0; c < totalVisibleCols; c++) {
        const colIndex = startCol + c;
        const colWidth = colData.get(colIndex)?.width ?? cellWidth;

        let text;
        if (cellData.has(rowIndex + 1, colIndex + 1)) {
          text = `${cellData.get(rowIndex + 1, colIndex + 1)}`;
          ctx.font = "12px Arial";
          ctx.fillStyle = "#000";
          if (isFinite(Number(text))) {
            ctx.textAlign = "end"
            ctx.fillText(text, xPos - 5 + colWidth, yPos + rowHeight / 2 + 4);
          } else {
            ctx.textAlign = "left"
            ctx.fillText(text, xPos + 5, yPos + rowHeight / 2 + 4);
          }
        }
        if(this.selectionManager === null) return;
        const selectedCells = this.selectionManager.getCellSelection;

        let startRowIndex = selectedCells.startRow;
        let endRowIndex = selectedCells.endRow;
        let startColIndex = selectedCells.startCol;
        let endColIndex = selectedCells.endCol;

        if (startRowIndex > endRowIndex) {
          [startRowIndex, endRowIndex] = [endRowIndex, startRowIndex]
        }
        if (startColIndex > endColIndex) {
          [startColIndex, endColIndex] = [endColIndex, startColIndex];
        }
        let startRowMin = Math.min(this.selectionManager.RowSelection.startRow, this.selectionManager.RowSelection.endRow);
        let startRowMax = Math.max(this.selectionManager.RowSelection.startRow, this.selectionManager.RowSelection.endRow);
        let startColMin = Math.min(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);
        let startColMax = Math.max(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);
        if (
          (startRowIndex <= rowIndex)
          && (endRowIndex >= rowIndex)
          && (endColIndex >= colIndex)
          && (startColIndex <= colIndex)
          || (startRowIndex <= rowIndex)
          && (endRowIndex >= rowIndex)
          && (startColIndex === colIndex)
          && selectedCells.selectionState
          || (startRowMin <= rowIndex)
          && (startRowMax >= rowIndex)
          && this.selectionManager.RowSelection.selectionState
          || (startColMin <= colIndex)
          && (startColMax >= colIndex)
          && this.selectionManager.ColSelection.selectionState
        ) {
          ctx.fillStyle = "#E8F2EC";
          ctx.fillRect(xPos, yPos, colWidth, rowHeight);
          ctx.fillStyle = "black";
          if (isFinite(Number(text))) {
            ctx.textAlign = "end"
            ctx.fillText(text || "", xPos - 5 + colWidth, yPos + rowHeight / 2 + 4);
          } else {
            ctx.textAlign = "left"
            ctx.fillText(text || "", xPos + 5, yPos + rowHeight / 2 + 4);
          }
        }
        if (
          selectedCells.startRow === rowIndex
          && selectedCells.startCol === colIndex
        ) {
          ctx.fillStyle = "white";
          ctx.fillRect(xPos, yPos, colWidth, rowHeight);
          ctx.fillStyle = "black";
          if (isFinite(Number(text))) {
            ctx.textAlign = "end"
            ctx.fillText(text || "", xPos - 5 + colWidth, yPos + rowHeight / 2 + 4);
          } else {
            ctx.textAlign = "left"
            ctx.fillText(text || "", xPos + 5, yPos + rowHeight / 2 + 4);
          }
        }

        xPos += colWidth;
      }

      yPos += rowHeight;
    }
  }
  drawCellSelection(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {

    let yPos = -0.5;
    for (let r = 0; r < totalVisibleRows; r++) {
      const rowIndex = startRow + r;
      const rowHeight = rowData.get(rowIndex)?.height ?? cellHeight;
      let xPos = -0.5;
      for (let c = 0; c < totalVisibleCols; c++) {
        const colIndex = startCol + c;
        const colWidth = colData.get(colIndex)?.width ?? cellWidth;

        if(this.selectionManager === null) return;
        const selectedCells = this.selectionManager.getCellSelection;
        if (selectedCells.startRow > selectedCells.endRow) {
          [selectedCells.startRow, selectedCells.endRow] = [selectedCells.endRow, selectedCells.startRow]
        }
        if (selectedCells.startCol > selectedCells.endCol) {
          [selectedCells.startCol, selectedCells.endCol] = [selectedCells.endCol, selectedCells.startCol];
        }

        if ((selectedCells.startRow <= rowIndex)
          && (selectedCells.endRow >= rowIndex)
          && selectedCells.selectionState
          && (selectedCells.startCol === colIndex)
          && !(this.selectionManager.RowSelection.selectionState)
          && !(this.selectionManager.ColSelection.selectionState)
        ) {
          // Start Vertical Line
          ctx.beginPath();
          ctx.moveTo(xPos + 1, yPos);
          ctx.lineTo(xPos + 1, yPos + rowHeight);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#137E43";
          ctx.stroke();

        }
        if ((selectedCells.startRow <= rowIndex)
          && (selectedCells.endRow >= rowIndex)
          && selectedCells.selectionState
          && (selectedCells.endCol === colIndex)
          && !(this.selectionManager.RowSelection.selectionState)
          && !(this.selectionManager.ColSelection.selectionState)
        ) {

          // End Vertical Line
          ctx.beginPath();
          ctx.moveTo(xPos + colWidth - 1, yPos);
          ctx.lineTo(xPos + colWidth - 1, yPos + rowHeight);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#137E43";
          ctx.stroke();
        }
        if ((selectedCells.startCol <= colIndex)
          && (selectedCells.endCol >= colIndex)
          && selectedCells.selectionState
          && (selectedCells.endRow === rowIndex)
          && !(this.selectionManager.RowSelection.selectionState)
          && !(this.selectionManager.ColSelection.selectionState)
        ) {

          // Start Bottom Horizonal Line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos + rowHeight - 1);
          ctx.lineTo(xPos + colWidth, yPos + rowHeight - 1);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#137E43";
          ctx.stroke();
        }
        if ((selectedCells.startCol <= colIndex)
          && (selectedCells.endCol >= colIndex)
          && (selectedCells.startRow === rowIndex)
          && selectedCells.selectionState
          && !(this.selectionManager.RowSelection.selectionState)
          && !(this.selectionManager.ColSelection.selectionState)
        ) {
          // Start Horizontal Line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos + 1);
          ctx.lineTo(xPos + colWidth, yPos + 1);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#137E43";
          ctx.stroke();
        }


        xPos += colWidth;
      }

      yPos += rowHeight;
    }
  }

  /**
   * Master method that clears the canvas and triggers drawing of grid lines and cell data.
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on.
   * @param {number} startRow - Starting row index.
   * @param {number} startCol - Starting column index.
   */
  drawGrid(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.selectionManager === null) return;
    this.drawCellData(ctx, startRow, startCol);
    if (this.selectionManager.RowSelection.selectionState) {
      this.drawVerticalGridLines(ctx, startCol);
      this.drawHorizontalGridLines(ctx, startRow);
    } else {
      this.drawHorizontalGridLines(ctx, startRow);
      this.drawVerticalGridLines(ctx, startCol);
    }
    this.drawCellSelection(ctx, startRow, startCol);
  }
}
