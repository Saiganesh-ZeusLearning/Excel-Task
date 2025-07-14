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
        this.rowData = rowData;

        this.colData = colData;

        this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    }

    /**
     * Calculates the grid cell position (row, col) based on a mouse event.
     * Takes into account scroll position and Excel-style offsets.
     * @param {MouseEvent} e - Mouse event from user interaction.
     * @returns {{row: number, col: number, x: number, y: number}} The calculated cell indices and their top-left coordinates.
     */
    get(e: MouseEvent) {
        const scrollLeft = this.scrollDiv.scrollLeft;
        const scrollTop = this.scrollDiv.scrollTop;

        const clientX = e.clientX + scrollLeft - ExcelLeftOffset;

        const clientY = e.clientY + scrollTop - ExcelTopOffset;

        let x = 0;
        let col = 0;
        while (x <= clientX) {
            const colWidth = this.colData.get(col)?.width ?? cellWidth;
            if (x + colWidth > clientX) break;
            x += colWidth;
            col++;
        }

        let y = 50;
        let row = 0;
        while (y <= clientY) {
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
