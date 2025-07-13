import { RowData } from "../../DataStructures/RowData.js";
import { RowLabelCanvas } from "../../Elements/RowLabelCanvas.js";
import { cellHeight, totalVisibleRows } from "../../Utils/GlobalVariables.js";
import { ExcelRenderer } from "../../Core/ExcelRenderer.js";

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
        // Only respond if the event target is the row label canvas
        if (e.target !== this.rowObj.getRowCanvas) return false;

        const offsetY = e.offsetY;
        const offsetX = e.offsetX;

        let y = 0;

        // Iterate through all visible rows to find if pointer is near a row boundary
        for (let i = 0; i < totalVisibleRows; i++) {
            const row = this.rowObj.getStartRow + i;
            const height = this.rowData.get(row)?.height ?? cellHeight;

            // If pointer is within 4px of the bottom of a row, enable resizing
            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX > 20) {
                this.rowObj.getRowCanvas.style.cursor = "s-resize";
                this.handlePointerDownEvent(e, row);
                return true;
            }
            y += height;
        }
        return false;
    }

    /**
     * Handles mouse down event to start row resizing.
     * @param {MouseEvent} e Mouse event
     * @param {number} row Index of the row to resize
     */
    handlePointerDownEvent(e: MouseEvent, row: number) {
        this.rowData.RowSelection = { ...this.rowData.RowSelection, isRowResizing: true };
        this.resizeStartY = e.offsetY;
        this.targetRow = row;
    }

    /**
     * Handles mouse move event to update row height during resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        // Only resize if a row is currently being resized
        if (!this.rowData.RowSelection.isRowResizing) return;

        // Calculate the new height
        const diff = e.offsetY - this.resizeStartY;
        const currentHeight = this.rowData.get(this.targetRow)?.height ?? cellHeight;
        const newHeight = Math.max(20, currentHeight + diff);

        // Update the row height in the data model
        this.rowData.set(this.targetRow, newHeight);

        // Update the starting Y position for the next move event
        this.resizeStartY = e.offsetY;

        // Trigger re-render
        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end row resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.rowData.RowSelection = { ...this.rowData.RowSelection, isRowResizing: false };
        this.rowObj.getRowCanvas.style.cursor = "default";
    }
}
