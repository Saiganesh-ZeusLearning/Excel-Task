import { GridCanvas } from "../Core/GridCanvas.js";
import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { colData, rowData } from "../main.js";
import { cellHeight, cellWidth, totalVisibleCols, totalVisibleRows } from "../Utils/GlobalVariables.js";
import { RowResizingHandler } from "./RowResizingHandler.js";
import { RowSelectionHandler } from "./RowSelectionHandler.js";

export class MasterInteraction {

    private rowObj: RowLabelCanvas;
    private colObj: ColumnLabelCanvas;
    private gridObj: GridCanvas;
    private rowSelectionHandler: RowSelectionHandler;
    private rowResizingHandler: RowResizingHandler;

    /**
     * Handles mouse up pointer
     * @param rowObj - Row Label Canvas
     * @param colObj - Column Label Canvas
     * @param gridObj - Grid Label Canvas
     * @param rowSelectionHandler - rowSelectionHandler for handling selection of Rows.
     */
    constructor(rowObj: RowLabelCanvas, colObj: ColumnLabelCanvas, gridObj: GridCanvas, rowSelectionHandler: RowSelectionHandler, rowResizingHandler: RowResizingHandler) {

        this.rowObj = rowObj;
        this.colObj = colObj;
        this.gridObj = gridObj;

        this.rowSelectionHandler = rowSelectionHandler;
        this.rowResizingHandler = rowResizingHandler;

        this.rowObj.getRowCanvas.addEventListener("pointerdown", this.handleRowPointerDown.bind(this));
        this.colObj.getColCanvas.addEventListener("pointerdown", this.handleColPointerMove.bind(this));

        window.addEventListener("pointermove", this.handleRowPointerMove.bind(this));
        window.addEventListener("pointerup", this.handleRowPointerUp.bind(this));
    }

    /**
     * Handles mouse up pointer
     * @param e - Mouse event
    */
    private handleRowPointerUp(e: MouseEvent) {
        this.rowSelectionHandler.handlePointerUpEvent(e);
    }

    /**
     * Handles mouse down pointer for Row Label Canvas
     * @param e - Mouse event
     */
    private handleRowPointerDown(e: MouseEvent) {
        const offsetY = e.offsetY;
        const offsetX = e.offsetX;
        let y = 0.5;

        for (let i = 0; i < totalVisibleRows; i++) {
            const row = this.rowObj.getStartRow + i;
            const height = rowData.get(row)?.height ?? cellHeight;

            // Resizing of Row
            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
                let targetRow = row;
                this.rowResizingHandler.handlePointerDownEvent(e, targetRow);
                break;
            }
            
            // Adding of Row
            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
                break;
            }
            
            // Selection of Row
            if (offsetY >= y + 4 && offsetY <= y + height) {

                this.rowSelectionHandler.handlePointerDownEvent(e);
                break;
            }

            y += height;
        }
    }


    /**
     * Handles mouse move pointer for Row Label Canvas
     * @param e - Mouse event
     */
    private handleRowPointerMove(e: MouseEvent) {
        const offsetY = e.offsetY;
        const offsetX = e.offsetX;
        let y = 0.5;

        for (let i = 0; i < totalVisibleRows; i++) {
            const row = this.rowObj.getStartRow + i;
            const height = rowData.get(row)?.height ?? cellHeight;

            // Resizing of Row
            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
                this.rowObj.getRowCanvas.style.cursor = "s-resize";
                break;
            }

            // Adding of Row
            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
                this.rowObj.getRowCanvas.style.cursor = "copy";
                break;
            }

            // Selection of Row
            if (offsetY >= y + 4 && offsetY <= y + height) {
                this.rowObj.getRowCanvas.style.cursor = "url('../../build/style/cursor-right.png') 12 12, auto";

                this.rowSelectionHandler.handlePointerMoveEvent(e);
                break;
            }
            y += height;
        }
    }

        /**
 * Handles mouse move pointer for Column Label Canvas
 * @param e - Mouse event
 */
    private handleColPointerMove(e: MouseEvent) {
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
