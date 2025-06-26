import { colObj } from "../Elements/ColumnLabelCanvas.js";
import { rowObj } from "../Elements/RowLabelCanvas.js";
import { gridObj } from "./Grid.js";

export class ExcelRenderer {
  public startRow: number = 0;
  public startCol: number = 0;

  private scrollContainer: HTMLElement;
  private rowCtx: CanvasRenderingContext2D;
  private colCtx: CanvasRenderingContext2D;
  private gridCtx: CanvasRenderingContext2D;

  constructor() {
    this.scrollContainer = document.querySelector(".scrollable") as HTMLElement;

    const rowCanvas = rowObj.getRowCanvas;
    this.rowCtx = rowCanvas.getContext("2d") as CanvasRenderingContext2D;

    const colCanvas = colObj.getColCanvas;
    this.colCtx = colCanvas.getContext("2d") as CanvasRenderingContext2D;

    const gridCanvas = gridObj.getGridCanvas;
    this.gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

    this.attachScrollListener();
    this.render(); // Initial render
  }

  private attachScrollListener(): void {
    this.scrollContainer.addEventListener("scroll", () => this.render());
  }

  public render(): void {
    const scrollTop = this.scrollContainer.scrollTop;
    const scrollLeft = this.scrollContainer.scrollLeft;

    this.startRow = Math.floor(scrollTop / rowObj.cellHeight);
    this.startCol = Math.floor(scrollLeft / colObj.cellWidth);

    const canvasTop = this.startRow * rowObj.cellHeight;
    const canvasLeft = this.startCol * colObj.cellWidth;

    const rowLabel = document.querySelector(".row-label") as HTMLElement;
    rowLabel.style.top = `${canvasTop + 24}px`;
    rowLabel.style.left = `${scrollLeft}px`;

    const colLabel = document.querySelector(".col-label") as HTMLElement;
    colLabel.style.left = `${canvasLeft + 50}px`;
    colLabel.style.top = `${scrollTop}px`;

    const grid = document.querySelector(".main-canvas") as HTMLElement;
    grid.style.top = `${canvasTop + 24}px`;
    grid.style.left = `${canvasLeft + 50}px`;
    console.log("asdas")
    rowObj.drawRows(this.rowCtx, this.startRow);
    colObj.drawColumns(this.colCtx, this.startCol);
    gridObj.drawGrid(this.gridCtx, this.startRow, this.startCol);
  }
}
