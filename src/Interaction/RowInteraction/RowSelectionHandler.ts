import { RowData } from "../../DataStructures/RowData.js";
import { RowLabelCanvas } from "../../Elements/RowLabelCanvas.js";
import { ColData } from "../../DataStructures/ColData.js";
import { CellData } from "../../DataStructures/CellData.js";
import { CurrentCellPosition } from "../../Elements/CurrentCellPosition.js";
import { ExcelRenderer } from "../../Core/ExcelRenderer.js";

/**
 * Handles row selection interactions on the row label canvas.
 */
export class RowSelectionHandler {

    /** @type {boolean} Tracks if a row selection is in progress */
    private selectionState: boolean;

    /** @type {ExcelRenderer} Used to trigger re-rendering after selection changes */
    private excelRenderer: ExcelRenderer;

    /** @type {CurrentCellPosition} Utility for calculating cell positions from mouse events */
    private currentCellPosition: CurrentCellPosition;

    /** @type {RowLabelCanvas} Reference to the row label canvas */
    private rowObj: RowLabelCanvas;

    /** @type {RowData} Row data model for selection state */
    private rowData: RowData;

    /** @type {ColData} Column data model for clearing column selection */
    private colData: ColData;

    /** @type {CellData} Cell data model for clearing cell selection */
    private cellData: CellData;

    /**
     * Initializes the RowSelectionHandler.
     * @param {CurrentCellPosition} currentCellPosition Utility for cell position calculation
     * @param {RowLabelCanvas} rowObj Row label canvas instance
     * @param {RowData} rowData Row data model
     * @param {ColData} colData Column data model
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        currentCellPosition: CurrentCellPosition,
        rowObj: RowLabelCanvas,
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

        /** Stores the row label canvas reference */
        this.rowObj = rowObj;

        /** Stores the cell position utility */
        this.currentCellPosition = currentCellPosition;

        /** Tracks if a row selection is in progress */
        this.selectionState = false;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits a row label and starts selection if so.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {
        if (e.target !== this.rowObj.getRowCanvas) return false;

        return true;
    }

    /**
     * Handles mouse down event to start row selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerDownEvent(e: MouseEvent) {
        const { row } = this.currentCellPosition.get(e);

        this.colData.ColSelection = { ...this.colData.ColSelection, selectionState: false };
        this.cellData.setCellSelection = { ...this.cellData.getCellSelection, selectionState: false };

        this.rowData.RowSelection = { startRow: row, endRow: row, selectionState: true, isRowResizing: false };
        this.selectionState = true;

        this.excelRenderer.render();
    }

    /**
     * Handles mouse move event to update row selection range.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        if (!this.selectionState) return;

        const { row } = this.currentCellPosition.get(e);

        this.rowData.RowSelection = { ...this.rowData.RowSelection, endRow: row };

        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end row selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.selectionState = false;
    }

    getCursor(e: MouseEvent){
        if(this.hitTest(e)){
            this.rowObj.getRowCanvas.style.cursor = "url('../../build/style/cursor-right.png') 12 12, auto";
            return true;
        }
        return false;
    }
}
