import { ExcelRenderer } from "../Core/ExcelRenderer";
import { SelectionManager } from "../Core/SelectionManager";
import { rowData } from "../main.js";

export class RowResizingHandler {

    private isResizing: boolean;

    private selectionManager: SelectionManager;

    constructor(selectionManager: SelectionManager) {
        this.selectionManager = selectionManager;
        this.isResizing = false;
    }

    handlePointerDownEvent(e: MouseEvent, targetRow: number) {
        this.isResizing = true;
        
    }

    handlePointerMoveEvent(e: MouseEvent) {
        if(!this.isResizing) return;
    }

    handlePointerUpEvent(e: MouseEvent) {
        
    }
}