import { ColData } from "../../DataStructures/ColData.js";
import { ColumnLabelCanvas } from "../../Elements/ColumnLabelCanvas.js";
import { cellWidth, totalVisibleCols } from "../../Utils/GlobalVariables.js";
import { ExcelRenderer } from "../../Core/ExcelRenderer.js";

/**
 * Handles column resizing interactions on the column label canvas.
 */
export class ColResizingHandler {

    /** @type {number} Stores the initial X position when resizing starts */
    private resizeStartX: number = 0;

    /** @type {number} Stores the index of the column being resized */
    private targetCol: number = -1;

    /** @type {ColumnLabelCanvas} Reference to the column label canvas */
    private colObj: ColumnLabelCanvas;

    /** @type {ColData} Column data model for column widths and selection state */
    private colData: ColData;

    /** @type {ExcelRenderer} Used to trigger re-rendering after resizing */
    private excelRenderer: ExcelRenderer;

    /**
     * Initializes the ColResizingHandler.
     * @param {ColumnLabelCanvas} colObj Column label canvas instance
     * @param {ColData} colData Column data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        colObj: ColumnLabelCanvas,
        colData: ColData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Stores the column data model */
        this.colData = colData;

        /** Stores the column label canvas reference */
        this.colObj = colObj;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits a column boundary for resizing.
     * If so, changes the cursor and starts the resize.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {
        // Only respond if the event target is the column label canvas
        if (e.target !== this.colObj.getColCanvas) return false;

        const offsetY = e.offsetY;
        const offsetX = e.offsetX;

        let x = 0;

        // Iterate through all visible columns to find if pointer is near a column boundary
        for (let i = 0; i < totalVisibleCols; i++) {
            const col = this.colObj.getColStart + i;
            const width = this.colData.get(col)?.width ?? cellWidth;

            // If pointer is within 4px of the right edge of a column, enable resizing
            if (Math.abs(offsetX - (x + width)) <= 4 && offsetY > 9) {
                this.colObj.getColCanvas.style.cursor = "w-resize";
                this.handlePointerDownEvent(e, col);
                return true;
            }
            x += width;
        }
        return false;
    }

    /**
     * Handles mouse down event to start column resizing.
     * @param {MouseEvent} e Mouse event
     * @param {number} col Index of the column to resize
     */
    handlePointerDownEvent(e: MouseEvent, col: number) {
        // Set the column selection state to resizing
        this.colData.ColSelection = { ...this.colData.ColSelection, isColResizing: true }
        // Store the initial X position and target column
        this.resizeStartX = e.offsetX;
        this.targetCol = col;
    }

    /**
     * Handles mouse move event to update column width during resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        // Only resize if a column is currently being resized
        if (!this.colData.ColSelection.isColResizing) return;

        // Calculate the new width
        const diff = e.offsetX - this.resizeStartX;
        const currentWidth = this.colData.get(this.targetCol)?.width ?? cellWidth;
        const newWidth = Math.max(50, currentWidth + diff);

        // Update the column width in the data model
        this.colData.set(this.targetCol, newWidth);

        // Update the starting X position for the next move event
        this.resizeStartX = e.offsetX;

        // Trigger re-render
        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end column resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        // Reset the column selection state
        this.colData.ColSelection = { ...this.colData.ColSelection, isColResizing: false }
        // Reset the cursor to default
        this.colObj.getColCanvas.style.cursor = "default";
    }
}
