import { GridCanvas } from "../Core/GridCanvas.js";
import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { colData, rowData } from "../main.js";
import { cellHeight, cellWidth, totalVisibleCols, totalVisibleRows } from "../Utils/GlobalVariables.js";

export class MasterInteraction {

    rowObj: RowLabelCanvas;
    colObj: ColumnLabelCanvas;
    gridObj: GridCanvas;
    constructor(rowObj: RowLabelCanvas, colObj: ColumnLabelCanvas, gridObj: GridCanvas) {
        this.rowObj = rowObj;
        this.colObj = colObj;
        this.gridObj = gridObj;

        this.rowObj.getRowCanvas.addEventListener("pointerdown", this.handleRowMouseMove.bind(this));
        this.colObj.getColCanvas.addEventListener("pointerdown", this.handleColMouseMove.bind(this));
    }

    private handleRowMouseMove(e: MouseEvent) {
        const offsetY = e.offsetY;
        const offsetX = e.offsetX;
        let y = 0.5;

        for (let i = 0; i < totalVisibleRows; i++) {
            const row = this.rowObj.getStartRow + i;
            const height = rowData.get(row)?.height ?? cellHeight;

            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
                console.log("resizing")
                break;
            }

            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
                console.log("row-add")
                break;
            }
            if (offsetY >= y + 4 && offsetY <= y + height) {
                console.log("row-selection")
                break;
            }

            y += height;
        }
    }

    private handleColMouseMove(e: MouseEvent) {
        const offsetX = e.offsetX;
        const offsetY = e.offsetY
        let x = 0;

        for (let i = 0; i < totalVisibleCols; i++) {
            const col = this.colObj.getColStart + i;
            const width = colData.get(col)?.width ?? cellWidth;

            if (Math.abs(offsetX - (x + width)) <= 4 && offsetY > 9) {
                console.log("resizing")
                break;
            }
            if (Math.abs(offsetX - (x + width)) <= 4 && offsetY < 9) {
                console.log("add-col")
                break;
            }

            x += width;
        }
    }
}
