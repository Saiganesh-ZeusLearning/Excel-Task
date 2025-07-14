import { ExcelRenderer } from "../../Core/ExcelRenderer.js";
import { CellData } from "../../DataStructures/CellData.js";
import { ColData } from "../../DataStructures/ColData.js";
import { RowData } from "../../DataStructures/RowData.js";
import { ColumnLabelCanvas } from "../../Elements/ColumnLabelCanvas.js";
import { cellWidth, totalVisibleCols } from "../../Utils/GlobalVariables.js";

/**
 * Handles adding new columns via user interaction on the column label canvas.
 */
export class ColAddingHandler {

    /** @type {ColumnLabelCanvas} Reference to the column label canvas */
    private colObj: ColumnLabelCanvas;

    /** @type {number} Stores the index of the column being resized */
    private targetCol: number = -1;

    /** @type {ColData} Column data model for managing columns */
    private colData: ColData;

    /** @type {CellData} Cell data model for managing cell data */
    private cellData: CellData;

    /** @type {ExcelRenderer} Used to trigger re-rendering after column addition */
    private excelRenderer: ExcelRenderer;

    /**
     * Initializes the ColAddingHandler.
     * @param {ColumnLabelCanvas} colObj Column label canvas instance
     * @param {ColData} colData Column data model
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        colObj: ColumnLabelCanvas,
        colData: ColData,
        cellData: CellData,
        excelRenderer: ExcelRenderer,
    ) {

        /** Stores the column label canvas reference */
        this.colObj = colObj;

        /** Stores the column data model */
        this.colData = colData;

        /** Stores the cell data model */
        this.cellData = cellData;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event is near a column boundary for adding a column.
     * If so, changes the cursor and starts the add column process.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {

        if (e.target !== this.colObj.getColCanvas) return false;

        const offsetY = e.offsetY;
        const offsetX = e.offsetX;

        let x = 0;

        for (let i = 0; i < totalVisibleCols; i++) {
            const col = this.colObj.getColStart + i;
            const width = this.colData.get(col)?.width ?? cellWidth;

            if (Math.abs(offsetX - (x + width)) <= 4 && offsetY <= 5) {
                this.colObj.getColCanvas.style.cursor = "copy";
                this.targetCol = col;
                return true;
            }
            x += width;
        }
        return false;
    }

    /**
     * Handles mouse down event to add a new column.
     * @param {MouseEvent} e Mouse event
     * @param {number} col Index of the column after which to add a new column
     */
    handlePointerDownEvent(e: MouseEvent) {

        this.cellData.insertColumnAt(this.targetCol + 2);
        this.colData.insertColumnAt(this.targetCol + 1);

        this.excelRenderer.render();
    }

    /**
     * Handles mouse move event (not used for column adding).
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        // No operation needed for column adding on mouse move
        return;
    }

    /**
     * Handles mouse up event to reset the cursor.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        return;
    }

    getCursor(e: MouseEvent) {
        if (this.hitTest(e)) {
            this.colObj.getColCanvas.style.cursor = "copy";
            return true;
        }
        return false;
    }
}
