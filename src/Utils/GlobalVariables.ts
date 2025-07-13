/** @type {number} Left offset for the main canvas (for row labels) */
export const CanvasLeftOffset: number = 50;

/** @type {number} Top offset for the main canvas (for column labels) */
export const CanvasTopOffset: number = 24;

/** @type {number} Default width of each cell */
export const cellWidth: number = 100;

/** @type {number} Default height of each cell */
export const cellHeight: number = 24;

/** @type {number} Total number of columns in the grid */
export const totalCols: number = 1000;

/** @type {number} Total number of rows in the grid */
export const totalRows: number = 100000;

/** @type {number} Number of visible columns in the viewport */
export const totalVisibleCols: number = 20;

/** @type {number} Number of visible rows in the viewport */
export const totalVisibleRows: number = 50;

/** @type {number} Starting row index for rendering */
export let StartRow: number = 0;

/** @type {number} Left offset for Excel-like grid (for row labels) */
export const ExcelLeftOffset = 50;

/** @type {number} Top offset for Excel-like grid (for column labels) */
export const ExcelTopOffset = 25;

/**
 * Converts a column number to its Excel-style label (e.g., 1 -> A, 27 -> AA).
 * @param {number} num - The column number (1-based).
 * @returns {string} The column label.
 */
export function ColLabel(num: number): string {
   let label = "";
   num--;
   while (num >= 0) {
      label = String.fromCharCode("A".charCodeAt(0) + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
   }
   return label;
}

/**
 * Converts an Excel-style column label to its column number (e.g., "A" -> 1, "AA" -> 27).
 * @param {string} label - The column label.
 * @returns {number} The column number (1-based).
 */
export function LabelToCol(label: string): number {
   let num = 0;
   for (let i = 0; i < label.length; i++) {
      num *= 26;
      num += label.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
   }
   return num;
}
