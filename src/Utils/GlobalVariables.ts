

export const CanvasLeftOffset: number = 50;
export const CanvasTopOffset: number = 24;

/** @type {number} Default width of each cell */
export const cellWidth: number = 100;
/** @type {number} Default height of each cell */
export const cellHeight: number = 24;

/** @type {number} Total number of columns in the grid */
export const totalCols: number = 1000;
/** @type {number} Total number of rows in the grid */
export const totalRows: number = 100000;

/** @type {number} Total number of columns in the grid */
export const totalVisibleCols: number = 20;
/** @type {number} Total number of rows in the grid */
export const totalVisibleRows: number = 50;

export const ExcelLeftOffset = 50;
export const ExcelTopOffset = 25;

export function ColLabel(num: number): string {
   let label = "";
   num--;
   while (num >= 0) {
      label = String.fromCharCode("A".charCodeAt(0) + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
   }
   return label;
}

export function LabelToCol(label: string): number {
   let num = 0;
   for (let i = 0; i < label.length; i++) {
      num *= 26;
      num += label.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
   }
   return num;
}
