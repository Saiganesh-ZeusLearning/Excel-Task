import { ColumnLabelCanvas } from "../Elements/ColumnManager.js";
import { RowLabelCanvas } from "../Elements/RowManager.js";
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


        const rowLabel = document.querySelector(".row-label") as HTMLElement;
        rowLabel.style.top = `${scrollTop + 24}px`
        rowLabel.style.left = `${scrollLeft}px`
        
        const colLabel = document.querySelector(".col-label") as HTMLElement;
        colLabel.style.left = `${scrollLeft + 50}px`
        colLabel.style.top = `${scrollTop}px`
        
        const grid = document.querySelector(".main-canvas") as HTMLElement;
        grid.style.top = `${scrollTop + 26}px`
        grid.style.left = `${scrollLeft + 50}px`


        rowObj.drawRows(rowCtx, scrollTop);
        colObj.drawColumns(colCtx, scrollLeft);
        gridObj.drawGrid(gridCtx, scrollTop, scrollLeft);
    })
}

const scrollDiv = document.querySelector(".scrollable") as HTMLElement;

scrollDiv.addEventListener("click", (e) => {
        
    console.log("row", Math.ceil((e.clientY + scrollDiv.scrollTop -25)/24) , "col",  Math.ceil((e.clientX + scrollDiv.scrollLeft -50)/100));
})

