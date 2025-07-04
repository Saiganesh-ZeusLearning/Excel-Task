import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { excelRenderer } from "../main.js";

/**
 * Manages input editing within the grid cells.
 * Handles click-based selection and keyboard navigation.
 */
export class SelectionManager {

    /** Scroll container element */
    public scrollDiv: HTMLElement;

    /** Main Canvas container element */
    public mainCanvas: HTMLElement;


    /** Starting of selected row index */
    private startRow: number = -100;

    /** Starting of selected column index */
    private startCol: number = -100;

    /** Ending of selected row index */
    private endRow: number = -100;

    /** Ending of selected column index */
    private endCol: number = -100;

    /** Ending of selected row index */
    private currRow: number = -100;

    /** Ending of selected column index */
    private currCol: number = -100;

    private selectionState: boolean = false;

    public RowSelectionStart = -100
    public RowSelectionEnd = -100
    public RowSelectionStatus = false

    /** Default Row Height */
    private defaultRowHeight = 24;

    /** Default Width Height */
    private defaultColWidth = 100;

    private selectingMultipleCells: boolean = false;


    /**
     * Initializes input manager and attaches event listeners.
     */
    constructor() {
        this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
        this.mainCanvas = document.querySelector(".main-canvas-wrapper") as HTMLElement;

        this.attachListeners();
    }

    get getCellSelection() {
        return {
            startRow: this.startRow,
            startCol: this.startCol,
            endRow: this.endRow,
            endCol: this.endCol,
            currRow: this.currRow, 
            currCol: this.currCol, 
            selectionState : this.selectionState
        }
    }

    set RowSelection(data: {startRow: number, endRow: number, selectionState: boolean}){
            this.RowSelectionStart = data.startRow;
            this.RowSelectionEnd = data.endRow;
            this.RowSelectionStatus = data.selectionState;
    }

    get RowSelection(){
        return {
            startRow: this.RowSelectionStart,
            endRow: this.RowSelectionEnd,
            selectionState: this.RowSelectionStatus,
        }
    }

    set(startRow: number, startCol: number, endRow: number, endCol: number, selectionState: boolean){
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.selectionState = selectionState;
    }


    /**
     * Attaches listeners for clicks and keyboard navigation.
     */
    private attachListeners() {
        this.mainCanvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
        window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    private handleMouseDown(e: MouseEvent) {
        if (e.button !== 0) return; 
        
        this.selectingMultipleCells = true;

        this.startRow = this.currRow;
        this.startCol = this.currCol;
        this.set(this.startRow,this.startCol,this.currRow, this.currCol, true);
    }
    
    private handleMouseUp() {
        this.selectingMultipleCells = false;
    }


    private handleMouseMove(e: MouseEvent) {

        const scrollLeft = this.scrollDiv.scrollLeft;
        const scrollTop = this.scrollDiv.scrollTop;

        const clientX = e.clientX + scrollLeft - 50; // offset for col label
        const clientY = e.clientY + scrollTop - 25; // offset for row label

        RowData.setSelectedRow(null);
        ColData.setSelectedCol(null);

        // === Calculate Column ===
        let x = 0, col = 0;
        while (x <= clientX) {
            const colWidth = colData.get(col)?.width ?? this.defaultColWidth;
            if (x + colWidth > clientX) break;
            x += colWidth;
            col++;
        }
        
        // === Calculate Row ===
        let y = 0, row = 0;
        while (y <= clientY) {
            const rowHeight = rowData.get(row)?.height ?? this.defaultRowHeight;
            if (y + rowHeight > clientY) break;
            y += rowHeight;
            row++;
        }

        this.currRow = row;
        this.currCol = col;

        if (!this.selectingMultipleCells) return;

        this.endRow = this.currRow;
        this.endCol = this.currCol;
        // Set selected cell
        RowData.setSelectedCellRow(row);
        ColData.setSelectedCellCol(col);
        excelRenderer.render();
    }
}


export const selectionManager = new SelectionManager();

// selectionManager.set(3, 0, 2, 2, true);

selectionManager.RowSelection = {startRow: 4, endRow: 7, selectionState: false}