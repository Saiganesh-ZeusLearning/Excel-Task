import { ColData } from "../DataStructures/ColData.js";
import { RowData } from "../DataStructures/RowData.js";
import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { CanvasLeftOffset, CanvasTopOffset, cellHeight, cellWidth } from "../Utils/GlobalVariables.js";
import { GridCanvas } from "./GridCanvas.js";

/**
 * Renders the Excel grid and manages canvas scrolling and repainting.
 */
export class ExcelRenderer {
  /** @type {number} The row index from where rendering starts */
  private startRow: number = 0;

  /** @type {number} The column index from where rendering starts */
  private startCol: number = 0;

  /** @type {HTMLElement} The scroll container for the grid */
  private scrollContainer: HTMLElement;

  /** @type {CanvasRenderingContext2D} Context for row label canvas */
  private rowCtx: CanvasRenderingContext2D;

  /** @type {CanvasRenderingContext2D} Context for column label canvas */
  private colCtx: CanvasRenderingContext2D;

  /** @type {CanvasRenderingContext2D} Context for main grid canvas */
  private gridCtx: CanvasRenderingContext2D;

  /** @type {RowLabelCanvas} Row label canvas instance */
  private rowObj: RowLabelCanvas;

  /** @type {ColumnLabelCanvas} Column label canvas instance */
  private colObj: ColumnLabelCanvas;

  /** @type {GridCanvas} Main grid canvas instance */
  private gridObj: GridCanvas;

  /** @type {RowData} Row metadata handler */
  private rowData: RowData;

  /** @type {ColData} Column metadata handler */
  private colData: ColData;

  /**
   * Initializes the renderer with canvas objects and attaches scroll listener.
   * @param {RowLabelCanvas} rowObj - Row label canvas object
   * @param {ColumnLabelCanvas} colObj - Column label canvas object
   * @param {GridCanvas} gridObj - Grid canvas object
   * @param {RowData} rowData - Row metadata store
   * @param {ColData} colData - Column metadata store
   */
  constructor(rowObj: RowLabelCanvas, colObj: ColumnLabelCanvas, gridObj: GridCanvas, rowData: RowData, colData: ColData) {
    this.rowData = rowData;
    this.colData = colData;

    this.scrollContainer = document.querySelector(".scrollable") as HTMLElement;

    this.rowObj = rowObj;
    const rowCanvas = rowObj.getRowCanvas;
    this.rowCtx = rowCanvas.getContext("2d") as CanvasRenderingContext2D;

    this.colObj = colObj;
    const colCanvas = colObj.getColCanvas;
    this.colCtx = colCanvas.getContext("2d") as CanvasRenderingContext2D;

    this.gridObj = gridObj;
    const gridCanvas = gridObj.getGridCanvas;
    this.gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

    this.attachScrollListener();
    this.render(); // Initial paint
  }

  /**
   * Attaches a scroll event listener to trigger re-rendering of visible canvas regions.
   * @private
   */
  private attachScrollListener(): void {
    this.scrollContainer.addEventListener("scroll", () => {
      
      this.render()
    });
  }

  /**
   * Calculates the visible rows and columns and re-renders the row, column, and grid canvases accordingly.
   * @public
   */
  public render(): void {
    const scrollTop = this.scrollContainer.scrollTop;
    const scrollLeft = this.scrollContainer.scrollLeft;

    // Determine the starting visible row
    let virtualStartRow = 0;
    let accumulated = 0;
    while (accumulated < scrollTop) {
      const height = this.rowData.get(virtualStartRow)?.height ?? cellHeight;
      if (accumulated + height > scrollTop) break;
      accumulated += height;
      virtualStartRow++;
    }
    this.startRow = virtualStartRow;

    // Compute top offset for row/canvas alignment
    let canvasTop = 0;
    for (let i = 0; i < this.startRow; i++) {
      canvasTop += this.rowData.get(i)?.height ?? cellHeight;
    }

    // Determine the starting visible column
    let virtualStartCol = 0;
    let accumulatedLeft = 0;
    while (accumulatedLeft < scrollLeft) {
      const width = this.colData.get(virtualStartCol)?.width ?? cellWidth;
      if (accumulatedLeft + width > scrollLeft) break;
      accumulatedLeft += width;
      virtualStartCol++;
    }
    this.startCol = virtualStartCol;

    // Compute left offset for column/canvas alignment
    let canvasLeft = 0;
    for (let i = 0; i < this.startCol; i++) {
      canvasLeft += this.colData.get(i)?.width ?? cellWidth;
    }

    // Move row label canvas into position
    const rowLabel = document.querySelector(".row-label") as HTMLElement;
    rowLabel.style.top = `${canvasTop + CanvasTopOffset}px`;
    rowLabel.style.left = `${scrollLeft}px`;

    // Move column label canvas into position
    const colLabel = document.querySelector(".col-label") as HTMLElement;
    colLabel.style.left = `${canvasLeft + CanvasLeftOffset}px`;
    colLabel.style.top = `${scrollTop}px`;

    // Move grid canvas into position
    const grid = document.querySelector(".main-canvas") as HTMLElement;
    grid.style.top = `${canvasTop + CanvasTopOffset}px`;
    grid.style.left = `${canvasLeft + CanvasLeftOffset}px`;

    // Trigger actual drawing
    this.rowObj.drawRows(this.rowCtx, this.startRow);
    this.colObj.drawColumns(this.colCtx, this.startCol);
    this.gridObj.drawGrid(this.gridCtx, this.startRow, this.startCol);
  }
}
