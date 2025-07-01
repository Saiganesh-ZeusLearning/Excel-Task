import { cellData } from "../DataStructures/CellData.js";
import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { SelectionManager } from "../Interaction/SelectionManager.js";

/**
 * Class responsible for rendering the main grid canvas including cells, grid lines, and cell data.
 */
export class GridCanvas {
  /** @type {HTMLCanvasElement} The canvas element used for grid drawing */
  canvas: HTMLCanvasElement;

  /** @type {number} Default width of each cell */
  cellWidth: number = 100;
  /** @type {number} Default height of each cell */
  cellHeight: number = 24;

  /** @type {number} Total number of columns in the grid */
  totalCols: number = 20;
  /** @type {number} Total number of rows in the grid */
  totalRows: number = 100;

  /** @type {number} Width of the entire grid in pixels */
  width: number;
  /** @type {number} Height of the entire grid in pixels */
  height: number;

  /** @type {HTMLElement} Wrapper element holding the canvas */
  mainCanvasWrapper: HTMLElement;

  selectionManager;

  /**
   * Initializes the GridCanvas, creates the canvas element, and triggers initial draw.
   */
  constructor() {
    this.mainCanvasWrapper = document.querySelector(".main-canvas-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("main-canvas");
    this.mainCanvasWrapper.appendChild(this.canvas);
    this.selectionManager = new SelectionManager();

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.height = this.cellHeight * this.totalRows;
    this.width = this.cellWidth * this.totalCols;
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
    let x = 0.5;
    for (let col = startCol; col <= startCol + this.totalCols; col++) {
      const colWidth = colData.get(col)?.width ?? this.cellWidth;
      let lineHeight = 0;

      if (ColData.getSelectedCol() == col) {
        lineHeight = 1.3;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
      } else if (ColData.getSelectedCol() == col - 1) {
        lineHeight = -1.3;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
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
    let y = 0.5;
    for (let row = startRow; row <= startRow + this.totalRows; row++) {
      const rowHeight = rowData.get(row)?.height ?? this.cellHeight;
      let lineHeight = 0;

      if (RowData.getSelectedRow() == row) {
        lineHeight = 1.5;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
      } else if (RowData.getSelectedRow() == row - 1) {
        lineHeight = -1.5;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
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
    for (let r = 0; r < this.totalRows; r++) {
      const rowIndex = startRow + r;
      const rowHeight = rowData.get(rowIndex)?.height ?? this.cellHeight;

      let xPos = 0;
      for (let c = 0; c < this.totalCols; c++) {
        const colIndex = startCol + c;
        const colWidth = colData.get(colIndex)?.width ?? this.cellWidth;

        let text;
        if (cellData.has(rowIndex + 1, colIndex + 1)) {
          text = `${cellData.get(rowIndex + 1, colIndex + 1)}`;
          ctx.font = "12px Arial";
          ctx.fillStyle = "#000";
          ctx.fillText(text, xPos + 5, yPos + rowHeight / 2 + 4);
        }
        // console.log(selectedCells.startRow + 1, selectedCells.endRow + 1, selectedCells.selectionState);
        const selectedCells = this.selectionManager.get();

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
        if (
          (startRowIndex <= rowIndex)
          && (endRowIndex >= rowIndex)
          && (endColIndex >= colIndex)
          && (startColIndex <= colIndex)
          || (startRowIndex <= rowIndex)
          && (endRowIndex >= rowIndex)
          && (startColIndex === colIndex)
          && selectedCells.selectionState
          || (RowData.getSelectedRow() === rowIndex && colIndex !== 0) 
          || (ColData.getSelectedCol() === colIndex && rowIndex !== 0)
        ) {
          ctx.fillStyle = "#E8F2EC";
          ctx.fillRect(xPos, yPos, colWidth, rowHeight);
          ctx.fillStyle = "black";
          ctx.fillText(text || "", xPos + 5, yPos + rowHeight / 2 + 4);
        }
        if (
          selectedCells.startRow === rowIndex
          && selectedCells.startCol === colIndex
        ) {
          ctx.fillStyle = "white";
          ctx.fillRect(xPos, yPos, colWidth, rowHeight);
          ctx.fillStyle = "black";
          ctx.fillText(text || "", xPos + 5, yPos + rowHeight / 2 + 4);
        }

        xPos += colWidth;
      }

      yPos += rowHeight;
    }
  }
  drawCellSelection(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {

    let yPos = 0;
    for (let r = 0; r < 40; r++) {
      const rowIndex = startRow + r;
      const rowHeight = rowData.get(rowIndex)?.height ?? this.cellHeight;

      let xPos = 0;
      for (let c = 0; c < 12; c++) {
        const colIndex = startCol + c;
        const colWidth = colData.get(colIndex)?.width ?? this.cellWidth;

        const selectedCells = this.selectionManager.get();
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
        ) {
          // Start Vertical Line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos, yPos + rowHeight);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "green";
          ctx.stroke();

        }
        if ((selectedCells.startRow <= rowIndex)
          && (selectedCells.endRow >= rowIndex)
          && selectedCells.selectionState
          && (selectedCells.endCol === colIndex)
        ) {

          // Start Vertical Line
          ctx.beginPath();
          ctx.moveTo(xPos + colWidth, yPos);
          ctx.lineTo(xPos + colWidth, yPos + rowHeight);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "green";
          ctx.stroke();
        }
        if ((selectedCells.startCol <= colIndex)
          && (selectedCells.endCol >= colIndex)
          && selectedCells.selectionState
          && (selectedCells.endRow === rowIndex)
        ) {

          // Start Bottom Horizonal Line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos + rowHeight);
          ctx.lineTo(xPos + colWidth, yPos + rowHeight);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "green";
          ctx.stroke();
        }
        if ((selectedCells.startCol <= colIndex)
          && (selectedCells.endCol >= colIndex)
          && (selectedCells.startRow === rowIndex)
          && selectedCells.selectionState
        ) {
          // Start Horizontal Line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos + colWidth, yPos);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "green";
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

    this.drawCellData(ctx, startRow, startCol);
    if (RowData.getSelectedRow() !== null) {
      this.drawVerticalGridLines(ctx, startCol);
      this.drawHorizontalGridLines(ctx, startRow);
    } else {
      this.drawHorizontalGridLines(ctx, startRow);
      this.drawVerticalGridLines(ctx, startCol);
    }
    this.drawCellSelection(ctx, startRow, startCol);
  }
}


export const gridObj = new GridCanvas();