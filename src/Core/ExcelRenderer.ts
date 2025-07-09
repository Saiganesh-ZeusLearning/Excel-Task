import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { colData, rowData } from "../main.js";
import { CanvasLeftOffset, CanvasTopOffset, cellHeight, cellWidth } from "../Utils/GlobalVariables.js";
import { GridCanvas } from "./GridCanvas.js";

/**
 * Renders the Excel grid based on scroll position.
 */
export class ExcelRenderer {
  /** @type {number} The row index from where rendering starts */
  private startRow: number = 0;
  /** @type {number} The column index from where rendering starts */
  private startCol: number = 0;

  /** @type {HTMLElement} Scrollable container element */
  private scrollContainer: HTMLElement;
  /** @type {CanvasRenderingContext2D} 2D context for row label canvas */
  private rowCtx: CanvasRenderingContext2D;
  /** @type {CanvasRenderingContext2D} 2D context for column label canvas */
  private colCtx: CanvasRenderingContext2D;
  /** @type {CanvasRenderingContext2D} 2D context for grid canvas */
  private gridCtx: CanvasRenderingContext2D;

  private rowObj: RowLabelCanvas;
  private colObj: ColumnLabelCanvas;
  private gridObj: GridCanvas;

  /**
   * Initializes the ExcelRenderer class and attaches scroll listener.
   */
  constructor(rowObj : RowLabelCanvas, colObj: ColumnLabelCanvas, gridObj : GridCanvas) {
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
    this.render(); // Initial render
  }

  /**
   * Adds scroll event listener to re-render the canvas on scroll.
   * @private
   */
  private attachScrollListener(): void {
    this.scrollContainer.addEventListener("scroll", () => this.render());
  }

  /**
   * Calculates visible start row/col and applies necessary canvas translations,
   * then delegates rendering to the respective components.
   * @public
   */
  public render(): void {
    const scrollTop = this.scrollContainer.scrollTop;
    const scrollLeft = this.scrollContainer.scrollLeft;

    // Calculate virtual start row
    let virtualStartRow = 0;
    let accumulated = 0;
    while (accumulated < scrollTop) {
      const height = rowData.get(virtualStartRow)?.height ?? cellHeight;
      if (accumulated + height > scrollTop) break;
      accumulated += height;
      virtualStartRow++;
    }
    this.startRow = virtualStartRow;

    // Calculate canvasTop offset
    let canvasTop = 0;
    for (let i = 0; i < this.startRow; i++) {
      canvasTop += rowData.get(i)?.height ?? cellHeight;
    }

    // Calculate virtual start column
    let virtualStartCol = 0;
    let accumulatedLeft = 0;
    while (accumulatedLeft < scrollLeft) {
      const width = colData.get(virtualStartCol)?.width ?? cellWidth;
      if (accumulatedLeft + width > scrollLeft) break;
      accumulatedLeft += width;
      virtualStartCol++;
    }
    this.startCol = virtualStartCol;

    // Calculate canvasLeft offset
    let canvasLeft = 0;
    for (let i = 0; i < this.startCol; i++) {
      canvasLeft += colData.get(i)?.width ?? cellWidth;
    }

    // Move row label canvas
    const rowLabel = document.querySelector(".row-label") as HTMLElement;
    rowLabel.style.top = `${canvasTop + CanvasTopOffset}px`;
    rowLabel.style.left = `${scrollLeft}px`;

    // Move column label canvas
    const colLabel = document.querySelector(".col-label") as HTMLElement;
    colLabel.style.left = `${canvasLeft + CanvasLeftOffset}px`;
    colLabel.style.top = `${scrollTop}px`;

    // Move grid canvas
    const grid = document.querySelector(".main-canvas") as HTMLElement;
    grid.style.top = `${canvasTop + CanvasTopOffset}px`;
    grid.style.left = `${canvasLeft + CanvasLeftOffset}px`;

    
    // Draw visible parts
    this.rowObj.drawRows(this.rowCtx, this.startRow);
    this.colObj.drawColumns(this.colCtx, this.startCol);
    this.gridObj.drawGrid(this.gridCtx, this.startRow, this.startCol);
  }
}
