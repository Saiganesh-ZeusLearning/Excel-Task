import { ColData } from "../../DataStructures/ColData.js";
import { ColumnLabelCanvas } from "../../Elements/ColumnLabelCanvas.js";
import { cellWidth, totalVisibleCols } from "../../Utils/GlobalVariables.js";
import { RowData } from "../../DataStructures/RowData.js";
import { CellData } from "../../DataStructures/CellData.js";
import { CurrentCellPosition } from "../../Elements/CurrentCellPosition.js";
import { ExcelRenderer } from "../../Core/ExcelRenderer.js";

/**
 * Handles column selection interactions on the column label canvas.
 */
export class ColSelectionHandler {

    /** @type {boolean} Tracks if a column selection is in progress */
    private selectionState: boolean;

    /** @type {CurrentCellPosition} Utility for calculating cell positions from mouse events */
    private currentCellPosition: CurrentCellPosition;

    /** @type {ColumnLabelCanvas} Reference to the column label canvas */
    private colObj: ColumnLabelCanvas;

    /** @type {RowData} Row data model for clearing row selection */
    private rowData: RowData;

    /** @type {ColData} Column data model for managing column selection */
    private colData: ColData;

    /** @type {CellData} Cell data model for clearing cell selection */
    private cellData: CellData;

    /** @type {ExcelRenderer} Used to trigger re-rendering after selection changes */
    private excelRenderer: ExcelRenderer;

    /**
     * Initializes the ColSelectionHandler.
     * @param {CurrentCellPosition} currentCellPosition Utility for cell position calculation
     * @param {ColumnLabelCanvas} colObj Column label canvas instance
     * @param {RowData} rowData Row data model
     * @param {ColData} colData Column data model
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        currentCellPosition: CurrentCellPosition,
        colObj: ColumnLabelCanvas,
        rowData: RowData,
        colData: ColData,
        cellData: CellData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Stores the row data model */
        this.rowData = rowData;

        /** Stores the column data model */
        this.colData = colData;

        /** Stores the cell data model */
        this.cellData = cellData;

        /** Stores the column label canvas reference */
        this.colObj = colObj;

        /** Stores the cell position utility */
        this.currentCellPosition = currentCellPosition;

        /** Tracks if a column selection is in progress */
        this.selectionState = false;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits a column label and starts selection if so.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {
        // Only respond if the event target is the column label canvas
        if (e.target !== this.colObj.getColCanvas) return false;

        const offsetY = e.offsetY;
        const offsetX = e.offsetX;

        let x = 0;

        // Iterate through all visible columns to find which column was clicked
        for (let i = 0; i < totalVisibleCols; i++) {
            const col = this.colObj.getColStart + i;
            const width = this.colData.get(col)?.width ?? cellWidth;

            // If pointer is within the column label area, start selection
            if (offsetX >= x + 4 && offsetX <= x + width && offsetY > 5) {
                this.colObj.getColCanvas.style.cursor = "url('../../build/style/cursor-down.png') 12 12, auto";
                this.handlePointerDownEvent(e);
                return true;
            }
            x += width;
        }
        return false;
    }

    /**
     * Handles mouse down event to start column selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerDownEvent(e: MouseEvent) {
        // Clear any active row or cell selections
        this.rowData.RowSelection = { ...this.rowData.RowSelection, selectionState: false }
        this.cellData.setCellSelection = { ...this.cellData.getCellSelection, selectionState: false }

        // Get the column index from the mouse event
        const { col } = this.currentCellPosition.get(e);

        // Set column selection state
        this.colData.ColSelection = { endCol: col, startCol: col, selectionState: true, isColResizing: false }

        this.selectionState = true;
        // Trigger re-render
        this.excelRenderer.render();
    }

    /**
     * Handles mouse move event to update column selection range.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        if (!this.selectionState) return;

        // Get the current column index from the mouse event
        const { col } = this.currentCellPosition.get(e);

        // Update selection range
        this.colData.ColSelection = { ...this.colData.ColSelection, endCol: col }
        // Trigger re-render
        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end column selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.selectionState = false;
        this.colObj.getColCanvas.style.cursor = "default";
    }
}
