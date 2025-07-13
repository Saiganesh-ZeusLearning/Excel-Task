import { CellData } from "../DataStructures/CellData.js";
import { ColData } from "../DataStructures/ColData.js";
import { cellWidth, ColLabel, totalVisibleCols } from "../Utils/GlobalVariables.js";
import { RowData } from "../DataStructures/RowData.js";

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

  /** @type {number} Height of the label area (in pixels) */
  private height = 24;

  /** @type {number} Total canvas width based on totalVisibleCols and cellWidth */
  private width = totalVisibleCols * cellWidth + 1;

  /** @type {RowData} Reference to row data for selection state */
  private rowData: RowData;

  /** @type {ColData} Reference to column data for column widths and selection */
  private colData: ColData;

  /** @type {CellData} Reference to cell data for cell selection */
  private cellData: CellData;

  /**
   * Initializes the ColumnLabelCanvas instance.
   * @param {RowData} rowData - Row data object for row selection state.
   * @param {ColData} colData - Column data object for column widths and selection state.
   * @param {CellData} cellData - Cell data object for cell selection state.
   */
  constructor(
    rowData: RowData,
    colData: ColData,
    cellData: CellData,
  ) {
    /** Store reference to row data */
    this.rowData = rowData;

    /** Store reference to column data */
    this.colData = colData;

    /** Store reference to cell data */
    this.cellData = cellData;

    /** Get the wrapper element for the column labels */
    this.colWrapper = document.querySelector(".col-label-wrapper") as HTMLElement;

    /** Create the canvas element for column labels */
    this.canvas = document.createElement("canvas");

    /** Add a CSS class for styling */
    this.canvas.classList.add("col-label");

    /** Append the canvas to the wrapper */
    this.colWrapper.appendChild(this.canvas);

    /** Initialize the starting column index */
    this.startCol = 0;

    /** Get the 2D context for drawing */
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    /** Initialize the canvas size and scaling */
    this.initCanvas(ctx);

    /** Draw the initial column labels */
    this.drawColumns(ctx, 0);
  }

  /**
   * Getter to access the column canvas element.
   * @returns {HTMLCanvasElement} The canvas element for column labels.
   */
  get getColCanvas() {
    return this.canvas;
  }

  /**
   * Getter to access the starting column index.
   * @returns {number} The starting column index for rendering.
   */
  get getColStart() {
    return this.startCol;
  }

  /**
   * Initializes the canvas size and scales it for high-DPI screens.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   */
  private initCanvas(ctx: CanvasRenderingContext2D): void {
    /** @type {number} Device pixel ratio for high-DPI screens */
    const dpr = window.devicePixelRatio || 1;

    /** Set the canvas width and height based on device pixel ratio */
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    /** Set the CSS width and height for proper display */
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    /** Scale the drawing context for crisp rendering */
    ctx.scale(dpr, dpr);
  }

  /**
   * Draws the column headers and vertical grid lines.
   * Handles highlighting for selected columns, rows, or cells.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   * @param {number} startCol - Column index to start drawing from.
   */
  drawColumns(ctx: CanvasRenderingContext2D, startCol: number): void {
    /** Clear the entire canvas before redrawing */
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /** @type {number} The current X position for drawing */
    let x = -0.5;

    /** Iterate through all visible columns */
    for (let col = startCol; col <= startCol + totalVisibleCols; col++) {
      /** Update the starting column index */
      this.startCol = startCol;

      /** @type {any} Column info (width, etc.) from colData */
      const colInfo = this.colData.get(col);

      /** @type {number} Width of the current column */
      const nxtWidth = colInfo ? colInfo.width : cellWidth;

      /** @type {any} Selected cell range and state */
      const selectedCells = this.cellData.getCellSelection;

      /** @type {number} Start index of selected columns */
      let startColIndex = selectedCells.startCol;

      /** @type {number} End index of selected columns */
      let endColIndex = selectedCells.endCol;

      /** @type {boolean} Whether a cell selection is active */
      let selectionState = selectedCells.selectionState;

      /** Swap start/end if selection is reversed */
      if (startColIndex > endColIndex) {
        [startColIndex, endColIndex] = [endColIndex, startColIndex];
      }

      /** @type {number} Minimum selected column index for column selection */
      let startMin = Math.min(this.colData.ColSelection.startCol, this.colData.ColSelection.endCol);

      /** @type {number} Maximum selected column index for column selection */
      let startMax = Math.max(this.colData.ColSelection.startCol, this.colData.ColSelection.endCol);

      /** @type {boolean} Whether a column selection is active */
      let colSelectionState = this.colData.ColSelection.selectionState;

      // ---- Highlighting logic ----
      if ((colSelectionState && startMin <= col && startMax >= col)) {
        // Column selection highlight
        ctx.fillStyle = "#107C41";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";

        // Draw horizontal line at the bottom
        ctx.beginPath();
        ctx.moveTo(x, 23);
        ctx.lineTo(x + nxtWidth, 23);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.strokeStyle = "#A0D8B9";

        // Draw vertical line at the left edge
        ctx.beginPath();
        ctx.moveTo(x, -1.5);
        ctx.lineTo(x, this.canvas.height - 1.5);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if ((this.rowData.RowSelection.selectionState) || (selectionState && startColIndex <= col && endColIndex >= col)) {
        // Row or cell selection highlight
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "green";
        ctx.font = "12px sans-serif";

        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 22);
        ctx.strokeStyle = "#A0D8B9";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw horizontal line at the bottom
        ctx.beginPath();
        ctx.moveTo(x, 23);
        ctx.lineTo(x + nxtWidth + 1, 23);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "green";
        ctx.stroke();
      } else {
        // Default (unselected) state
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";

        // Draw horizontal grid line
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(x, 23.5);
        ctx.lineTo(x + nxtWidth, 23.5);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();

        // Draw vertical grid line with special highlight if at selection boundary
        if (endColIndex == col - 1) {
          ctx.strokeStyle = "#A0D8B9";
        } else {
          ctx.strokeStyle = "#ddd";
        }

        ctx.beginPath();
        ctx.moveTo(x, 0.5);
        ctx.lineTo(x, this.canvas.height + 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      /** @type {string} The label for the current column (A, B, C, ...) */
      const label = ColLabel(1 + col);

      /** Draw the column label centered in the cell */
      ctx.fillText(label, x + nxtWidth / 2 - 5, 16);

      /** Advance X position for next column */
      x += nxtWidth;
    }
  }
}
