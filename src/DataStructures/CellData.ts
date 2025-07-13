/**
 * Class to manage and manipulate cell data using a `${row}_${col}` key format.
 */
export class CellData {
  /**
   * @type {{ [key: `${number}_${number}`]: string }} 
   * Internal cell storage using "row_col" format as key.
   */
  private data: { [key: `${number}_${number}`]: string } = {};

  /**@type {number} Starting index of selected row */
  private startRow: number = -100;

  /**@type {number} Starting index of selected column */
  private startCol: number = -100;

  /**@type {number} Ending index of selected row */
  private endRow: number = -100;

  /**@type {number} Ending index of selected column */
  private endCol: number = -100;

  /**@type {boolean} Whether a selection is currently active */
  private selectionState: boolean = false;

  /**
   * Sets cell selection data.
   * @param {{startRow: number, startCol: number, endRow: number, endCol: number, selectionState: boolean}} data
   */
  set setCellSelection(data: { startRow: number, startCol: number, endRow: number, endCol: number, selectionState: boolean }) {
    this.startRow = data.startRow;
    this.startCol = data.startCol;
    this.endRow = data.endRow;
    this.endCol = data.endCol;
    this.selectionState = data.selectionState;
  }

  /**
   * Returns current cell selection state.
   * @returns {{startRow: number, startCol: number, endRow: number, endCol: number, selectionState: boolean}}
   */
  get getCellSelection() {
    return {
      startRow: this.startRow,
      startCol: this.startCol,
      endRow: this.endRow,
      endCol: this.endCol,
      selectionState: this.selectionState
    };
  }

  /**
   * Sets a value at the given row and column.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @param {string} value - Cell content.
   */
  set(row: number, col: number, value: string): void {
    const key = `${row}_${col}` as const;
    this.data[key] = value;
  }

  /**
   * Gets the value from a specific cell.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @returns {string | undefined} Cell value or undefined.
   */
  get(row: number, col: number): string | undefined {
    return this.data[`${row}_${col}` as const];
  }

  /**
   * Checks if a cell exists.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @returns {boolean} True if cell exists.
   */
  has(row: number, col: number): boolean {
    return `${row}_${col}` in this.data;
  }

  /**
   * Deletes a specific cell.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   */
  delete(row: number, col: number): void {
    delete this.data[`${row}_${col}` as const];
  }

  /**
   * Returns all stored cell data as key-value pairs.
   * @returns {[string, string][]} List of [key, value] pairs.
   */
  entries(): [string, string][] {
    return Object.entries(this.data);
  }

  /**
   * Internal recursive helper to shift cell data downward.
   * Used when inserting a row.
   * @param {number} row - Current row.
   * @param {number} col - Column.
   * @param {string} value - Value to propagate.
   */
  private shiftCellDown(row: number, col: number, value: string): void {
    const nextRow = row + 1;

    if (this.has(nextRow, col)) {
      const nextValue = this.get(nextRow, col)!;
      this.shiftCellDown(nextRow, col, nextValue);
    }

    this.set(nextRow, col, value);
    this.delete(row, col);
  }

  /**
   * Shifts all cells from the given row and below downward by 1.
   * Used during row insertions.
   * @param {number} row - Row index to insert at.
   */
  insertRowAt(row: number): void {
    const entriesToShift = this.entries()
      .map(([key, value]) => {
        const [r, c] = key.split("_").map(Number);
        return { row: r, col: c, value };
      })
      .filter(({ row: r }) => r >= row)
      .sort((a, b) => b.row - a.row); // shift bottom-up

    for (const { row: r, col: c, value } of entriesToShift) {
      this.shiftCellDown(r, c, value);
    }
  }

  /**
   * Internal recursive helper to shift cell data rightward.
   * Used when inserting a column.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @param {string} value - Value to propagate.
   */
  private shiftCellRight(row: number, col: number, value: string): void {
    const nextCol = col + 1;

    if (this.has(row, nextCol)) {
      const nextValue = this.get(row, nextCol)!;
      this.shiftCellRight(row, nextCol, nextValue);
    }

    this.set(row, nextCol, value);
    this.delete(row, col);
  }

  /**
   * Shifts all cells from the given column and rightward by 1.
   * Used during column insertions.
   * @param {number} col - Column index to insert at.
   */
  insertColumnAt(col: number): void {
    const entriesToShift = this.entries()
      .map(([key, value]) => {
        const [r, c] = key.split("_").map(Number);
        return { row: r, col: c, value };
      })
      .filter(({ col: c }) => c >= col)
      .sort((a, b) => b.col - a.col); // shift right-to-left

    for (const { row: r, col: c, value } of entriesToShift) {
      this.shiftCellRight(r, c, value);
    }
  }
}
