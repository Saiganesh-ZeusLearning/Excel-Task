import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { GridCanvas } from "./Grid.js";

export function renderExcel() {
    const rowObj = new RowLabelCanvas(0);
    const rowCanvas = rowObj.getRowCanvas;
    const rowCtx = rowCanvas.getContext("2d") as CanvasRenderingContext2D;


    const colObj = new ColumnLabelCanvas(0);
    const colCanvas = colObj.getColCanvas;
    const colCtx = colCanvas.getContext("2d") as CanvasRenderingContext2D;

    const gridObj = new GridCanvas();
    const gridCanvas = gridObj.getGridCanvas;
    const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;



    const scrollContainer = document.querySelector(".scrollable") as HTMLElement;

    scrollContainer.addEventListener("scroll", (e) => {
        const scrollTop = scrollContainer.scrollTop;
        const scrollLeft = scrollContainer.scrollLeft;

        const startRow = Math.floor(scrollTop / rowObj.cellHeight);  
        const startCol = Math.floor(scrollLeft / colObj.cellWidth);  
        
        const canvasTop = startRow * rowObj.cellHeight;
        const canvasLeft = startCol * colObj.cellWidth;
        
        const rowLabel = document.querySelector(".row-label") as HTMLElement;
        rowLabel.style.top = `${canvasTop + 24}px`
        rowLabel.style.left = `${scrollLeft}px`

        const colLabel = document.querySelector(".col-label") as HTMLElement;
        colLabel.style.left = `${canvasLeft + 50}px`
        colLabel.style.top = `${scrollTop}px`

        const grid = document.querySelector(".main-canvas") as HTMLElement;
        grid.style.top = `${canvasTop + 24}px`
        grid.style.left = `${canvasLeft + 50}px`


        rowObj.drawRows(rowCtx, startRow);
        colObj.drawColumns(colCtx, startCol);
        gridObj.drawGrid(gridCtx, startRow, startCol);
    })
}



