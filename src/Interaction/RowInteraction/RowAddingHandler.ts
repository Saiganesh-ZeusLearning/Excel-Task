import { ExcelRenderer } from "../../Core/ExcelRenderer.js";
import { CellData } from "../../DataStructures/CellData.js";
import { RowData } from "../../DataStructures/RowData.js";
import { RowLabelCanvas } from "../../Elements/RowLabelCanvas.js";
import { cellHeight, totalVisibleRows } from "../../Utils/GlobalVariables.js";

/**
 * Handles adding new rows via user interaction on the row label canvas.
 */
export class RowAddingHandler {

    /** @type {RowLabelCanvas} Reference to the row label canvas */
    private rowObj: RowLabelCanvas;

    /** @type {RowData} Row data model for managing rows */
    private rowData: RowData;

    /** @type {CellData} Cell data model for managing cell data */
    private cellData: CellData;

    /** @type {number} Stores the index of the row being resized */
    private targetRow: number = -1;

    /** @type {ExcelRenderer} Used to trigger re-rendering after row addition */
    private excelRenderer: ExcelRenderer;

    /**
     * Initializes the RowAddingHandler.
     * @param {RowLabelCanvas} rowObj Row label canvas instance
     * @param {RowData} rowData Row data model
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        rowObj: RowLabelCanvas,
        rowData: RowData,
        cellData: CellData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Stores the row label canvas reference */
        this.rowObj = rowObj;

        /** Stores the row data model */
        this.rowData = rowData;

        /** Stores the cell data model */
        this.cellData = cellData;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event is near a row boundary for adding a row.
     * If so, changes the cursor and starts the add row process.
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

            if (Math.abs(offsetY - (y + height)) <= 4 && offsetX < 20) {
                this.targetRow = row;
                return true;
            }
            y += height;
        }
        return false;
    }

    /**
     * Handles mouse down event to add a new row.
     * @param {MouseEvent} e Mouse event
     * @param {number} row Index of the row after which to add a new row
     */
    handlePointerDownEvent(e: MouseEvent) {
        this.cellData.insertRowAt(this.targetRow + 2);
        this.rowData.insertRowAt(this.targetRow + 1);

        this.rowData.RowSelection = {...this.rowData.RowSelection, startRow: this.targetRow+1 , endRow: this.targetRow+1, selectionState: true}

        this.excelRenderer.render();
    }

    /**
     * Handles mouse move event (not used for row adding).
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        // No operation needed for row adding on mouse move
        return;
    }

    /**
     * Handles mouse up event to reset the cursor.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
    }

    getCursor(e: MouseEvent) {
        if(this.hitTest(e)){
            this.rowObj.getRowCanvas.style.cursor = "copy";
            return true;
        }
        return false;
    }
}
