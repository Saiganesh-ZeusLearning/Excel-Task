import { ColData } from "../DataStructures/ColData.js";
import { RowData } from "../DataStructures/RowData.js";
import { cellHeight, cellWidth, ExcelLeftOffset, ExcelTopOffset } from "../Utils/GlobalVariables.js";

/**
 * Manages input editing within the grid cells.
 * Handles click-based selection and keyboard navigation.
 */
export class CurrentCellPosition {

    /** @type {HTMLElement} The scrollable container for the grid */
    private scrollDiv: HTMLElement;

    /** @type {RowData} Reference to row data for calculating row positions */
    private rowData: RowData;

    /** @type {ColData} Reference to column data for calculating column positions */
    private colData: ColData;

    /**
     * Initializes the CurrentCellPosition instance.
     * @param {RowData} rowData - Row data object for row heights and info.
     * @param {ColData} colData - Column data object for column widths and info.
     */
    constructor(rowData: RowData, colData: ColData) {
        /** Store reference to row data */
        this.rowData = rowData;

        /** Store reference to column data */
        this.colData = colData;

        /** Get the scrollable grid container element */
        this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    }

    /**
     * Calculates the grid cell position (row, col) based on a mouse event.
     * Takes into account scroll position and Excel-style offsets.
     * @param {MouseEvent} e - Mouse event from user interaction.
     * @returns {{row: number, col: number, x: number, y: number}} The calculated cell indices and their top-left coordinates.
     */
    get(e: MouseEvent) {
        /** @type {number} Horizontal scroll offset */
        const scrollLeft = this.scrollDiv.scrollLeft;
        /** @type {number} Vertical scroll offset */
        const scrollTop = this.scrollDiv.scrollTop;

        /** 
         * @type {number} Adjusted X position relative to grid (accounts for scroll and label offset)
         */
        const clientX = e.clientX + scrollLeft - ExcelLeftOffset;
        /**
         * @type {number} Adjusted Y position relative to grid (accounts for scroll and label offset)
         */
        const clientY = e.clientY + scrollTop - ExcelTopOffset;

        // === Calculate Column Index ===
        /** @type {number} X position tracker */
        let x = 0;
        /** @type {number} Column index */
        let col = 0;
        while (x <= clientX) {
            /** @type {number} Width of the current column */
            const colWidth = this.colData.get(col)?.width ?? cellWidth;
            if (x + colWidth > clientX) break;
            x += colWidth;
            col++;
        }

        // === Calculate Row Index ===
        /** @type {number} Y position tracker (starts at 50 to account for header?) */
        let y = 50;
        /** @type {number} Row index */
        let row = 0;
        while (y <= clientY) {
            /** @type {number} Height of the current row */
            const rowHeight = this.rowData.get(row)?.height ?? cellHeight;
            if (y + rowHeight > clientY) break;
            y += rowHeight;
            row++;
        }

        /** 
         * Return the calculated row, column, and their top-left coordinates.
         * @returns {{row: number, col: number, x: number, y: number}}
         */
        return { row, col, x, y }
    }
}
