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
        this.colData = colData;

        this.colObj = colObj;

        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits a column boundary for resizing.
     * If so, changes the cursor and starts the resize.
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

            if (Math.abs(offsetX - (x + width)) <= 4 && offsetY > 9) {
                this.colObj.getColCanvas.style.cursor = "w-resize";
                this.targetCol = col;
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
    handlePointerDownEvent(e: MouseEvent) {
        this.colData.ColSelection = { ...this.colData.ColSelection, isColResizing: true }
        this.resizeStartX = e.offsetX;
    }

    /**
     * Handles mouse move event to update column width during resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        if (!this.colData.ColSelection.isColResizing) return;

        const diff = e.offsetX - this.resizeStartX;
        const currentWidth = this.colData.get(this.targetCol)?.width ?? cellWidth;
        const newWidth = Math.max(50, currentWidth + diff);

        this.colData.set(this.targetCol, newWidth);

        this.resizeStartX = e.offsetX;

        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end column resizing.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.colData.ColSelection = { ...this.colData.ColSelection, isColResizing: false }
        this.colObj.getColCanvas.style.cursor = "default";
    }


    getCursor(e: MouseEvent) {
        if (this.hitTest(e)) {
            this.colObj.getColCanvas.style.cursor = "w-resize";
            return true;
        }
        return false;
    }
}
