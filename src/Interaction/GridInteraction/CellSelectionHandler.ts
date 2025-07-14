import { ExcelRenderer } from "../../Core/ExcelRenderer.js";
import { GridCanvas } from "../../Core/GridCanvas.js";
import { CellData } from "../../DataStructures/CellData.js";
import { CurrentCellPosition } from "../../Elements/CurrentCellPosition.js";

/**
 * Handles cell selection interactions on the grid canvas.
 */
export class CellSelectionHandler {

    /** @type {boolean} Tracks if a cell selection is in progress */
    private selectionState: boolean;

    /** @type {CurrentCellPosition} Utility for calculating cell positions from mouse events */
    private currentCellPosition: CurrentCellPosition;

    /** @type {GridCanvas} Reference to the grid canvas */
    private gridObj: GridCanvas;

    /** @type {CellData} Cell data model for managing cell selection */
    private cellData: CellData;

    /** @type {ExcelRenderer} Used to trigger re-rendering after selection changes */
    private excelRenderer: ExcelRenderer;

    /**
     * Initializes the CellSelectionHandler.
     * @param {CurrentCellPosition} currentCellPosition Utility for cell position calculation
     * @param {GridCanvas} gridObj Grid canvas instance
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        currentCellPosition: CurrentCellPosition,
        gridObj: GridCanvas,
        cellData: CellData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Stores the grid canvas reference */
        this.gridObj = gridObj;

        /** Stores the cell data model */
        this.cellData = cellData;

        /** Stores the cell position utility */
        this.currentCellPosition = currentCellPosition;

        /** Tracks if a cell selection is in progress */
        this.selectionState = false;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;
    }

    /**
     * Determines if the pointer event hits the grid canvas and starts selection if so.
     * @param {MouseEvent} e Mouse event
     * @returns {boolean} True if this handler should process the event
     */
    hitTest(e: MouseEvent) {
        if (e.target !== this.gridObj.getGridCanvas) return false;
        return true;
    }

    /**
     * Handles mouse down event to start cell selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerDownEvent(e: MouseEvent) {
        this.selectionState = true;

        const { row, col } = this.currentCellPosition.get(e);

        this.cellData.setCellSelection = {
            startCol: col,
            endCol: col,
            startRow: row,
            endRow: row,
            selectionState: true,
        }
        this.excelRenderer.render();
    }

    /**
     * Handles mouse move event to update cell selection range.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {
        if (!this.selectionState) return;

        const { row, col } = this.currentCellPosition.get(e);

        this.cellData.setCellSelection = {
            ...this.cellData.getCellSelection,
            endCol: col,
            endRow: row,
        }
        this.excelRenderer.render();
    }

    /**
     * Handles mouse up event to end cell selection.
     * @param {MouseEvent} e Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.selectionState = false;
    }

    getCursor(e: MouseEvent) {
        if (this.hitTest(e)) {
            this.gridObj.getGridCanvas.style.cursor = "cell";
            return true;
        }
        return false;
    }
}
