import { RowData } from "../../DataStructures/RowData.js";
import { RowLabelCanvas } from "../../Elements/RowLabelCanvas.js";
import { cellHeight, totalVisibleRows } from "../../Utils/GlobalVariables.js";
import { ExcelRenderer } from "../../Core/ExcelRenderer.js";
import { CLIENT_RENEG_LIMIT } from "tls";

/**
 * Handles row resizing interactions on the row label canvas.
 */
export class RowResizingHandler {

    /** @type {number} Stores the initial Y position when resizing starts */
    private resizeStartY: number = 0;

    /** @type {number} Stores the index of the row being resized */
    private targetRow: number = -1;

    /** @type {ExcelRenderer} Used to trigger re-rendering after resizing */
    private excelRenderer: ExcelRenderer;

    /** @type {RowLabelCanvas} Reference to the row label canvas */
    private rowObj: RowLabelCanvas;

    /** @type {RowData} Row data model for row heights and selection state */
    private rowData: RowData;

    /**
     * Initializes the RowResizingHandler.
     * @param {RowLabelCanvas} rowObj Row label canvas instance
     * @param {RowData} rowData Row data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        rowObj: RowLabelCanvas,
        rowData: RowData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Stores the row data model */
        this.rowData = rowData;

        /** Stores the row label canvas reference */
        this.rowObj = rowObj;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits a row boundary for resizing.
     * If so, changes the cursor and starts the resize.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {
        if (e.target !== this.rowObj.getRowCanvas) return false;

        const offsetY = e.offsetY;
        const offsetX = e.offsetX;

        let y = 0;

        for (let i = 0; i < totalVisibleRows; i++) {
            const row = this.rowObj.getStartRow + i;
            const height = this.rowData.get(row)?.height ?? cellHeight;

            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
                this.targetRow = row;
                return true;
            }
            y += height;
        }
        return false;
    }

    /**
     * Handles mouse down event to start row resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerDownEvent(e: MouseEvent) {
        this.rowData.RowSelection = { ...this.rowData.RowSelection, isRowResizing: true };
        this.resizeStartY = e.offsetY;
    }

    /**
     * Handles mouse move event to update row height during resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        if (!this.rowData.RowSelection.isRowResizing) return;

        const diff = e.offsetY - this.resizeStartY;
        const currentHeight = this.rowData.get(this.targetRow)?.height ?? cellHeight;
        const newHeight = Math.max(20, currentHeight + diff);

        this.rowData.set(this.targetRow, newHeight);

        this.resizeStartY = e.offsetY;

        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end row resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.rowData.RowSelection = { ...this.rowData.RowSelection, isRowResizing: false };
    }

    getCursor(e: MouseEvent) {
        if(this.hitTest(e)){
            this.rowObj.getRowCanvas.style.cursor = "s-resize";
            return true;
        }
        return false;
    }
}
