import { ExcelRenderer } from "../Core/ExcelRenderer";
import { SelectionManager } from "../Core/SelectionManager";

export class RowSelectionHandler {

    private selectionState: boolean;

    private selectionManager: SelectionManager;
    private excelRenderer: ExcelRenderer;

     /**
     * Handles mouse up pointer
     * @param selectionManager - selectionManager for selecting the rows.
     * @param excelRenderer - to rerender for each row selection.
     */
    constructor(selectionManager: SelectionManager, excelRenderer: ExcelRenderer) {
        this.selectionManager = selectionManager;
        this.excelRenderer = excelRenderer;
        this.selectionState = false;
    }

     /**
     * Handles mouse down pointer for Row Label Canvas
     * @param e - Mouse event
     */
    handlePointerDownEvent(e: MouseEvent) {
        const startRow = this.selectionManager.getCellSelection.currRow;

        this.selectionManager.RowSelection = { endRow: startRow, startRow: startRow, selectionState: true, isRowResizing: false }

        this.selectionState = true;

        this.selectionManager.set(-100, -100, -100, -100, false);
    }

    /**
     * Handles mouse move pointer for Row Label Canvas
     * @param e - Mouse event
     */
    handlePointerMoveEvent(e: MouseEvent) {

        if (!this.selectionState) return;

        const endRow = this.selectionManager.getCellSelection.currRow;

        this.selectionManager.RowSelection = { ...this.selectionManager.RowSelection, endRow: endRow }

        this.excelRenderer.render();
    }

    /**
     * Handles mouse up pointer for Row Label Canvas
     * @param e - Mouse event
     */
    handlePointerUpEvent(e: MouseEvent) {
        this.selectionState = false;
    }
}