/**
 * Class to manage column metadata like width and selection state.
 */
export class ColData {
  /**@type {number} Stores the starting column index of selection */
  private ColSelectionStart = -100;

  /**@type {number} Stores the ending column index of selection */
  private ColSelectionEnd = -100;

  /**@type {boolean} Indicates if column selection is active */
  private ColSelectionStatus = false;

  /**@type {boolean} Indicates if a column is currently being resized */
  private isColResizing = false;

  /**
   * Internal storage for column widths, indexed by column number.
   * @type {{ [col: number]: { width: number } }}
   */
  private cols: {
    [col: number]: {
      width: number;
    };
  } = {};

  /**
   * Sets column selection state.
   * @param {{ startCol: number, endCol: number, selectionState: boolean, isColResizing: boolean }} data
   */
  set ColSelection(data: { startCol: number, endCol: number, selectionState: boolean, isColResizing: boolean }) {
    this.ColSelectionStart = data.startCol;
    this.ColSelectionEnd = data.endCol;
    this.ColSelectionStatus = data.selectionState;
    this.isColResizing = data.isColResizing;
  }

  /**
   * Gets current column selection state.
   * @returns {{ startCol: number, endCol: number, selectionState: boolean, isColResizing: boolean }}
   */
  get ColSelection() {
    return {
      startCol: this.ColSelectionStart,
      endCol: this.ColSelectionEnd,
      selectionState: this.ColSelectionStatus,
      isColResizing: this.isColResizing,
    };
  }

  /**
   * Sets width for a specific column.
   * @param {number} col - Column index.
   * @param {number} width - Width to assign to the column.
   */
  set(col: number, width: number): void {
    this.cols[col] = { width };
  }

  /**
   * Gets width data for a specific column.
   * @param {number} col - Column index.
   * @returns {{ width: number } | undefined} Column data or undefined.
   */
  get(col: number): { width: number } | undefined {
    return this.cols[col];
  }

  /**
   * Checks if the given column index exists.
   * @param {number} col - Column index.
   * @returns {boolean} True if column exists.
   */
  has(col: number): boolean {
    return col in this.cols;
  }

  /**
   * Deletes a column and its associated data.
   * @param {number} col - Column index.
   */
  delete(col: number): void {
    delete this.cols[col];
  }

  /**
   * Inserts a new column at the given index, shifting others to the right.
   * New column copies width from the previous column or uses default 100.
   * @param {number} col - Index at which to insert column.
   */
  insertColumnAt(col: number): void {
    const referenceWidth = this.get(col - 1)?.width ?? 100;

    // Shift columns from right to left (descending)
    const entriesToShift = this.entries()
      .filter(([c]) => c >= col)
      .sort((a, b) => b[0] - a[0]);

    for (const [c, data] of entriesToShift) {
      this.set(c + 1, data.width);
      this.delete(c);
    }

    // Insert new column with copied width
    this.set(col, referenceWidth);
  }

  /**
   * Returns all stored column entries.
   * @returns {[number, { width: number }][]} Array of [col, data] pairs.
   */
  entries(): [number, { width: number }][] {
    return Object.entries(this.cols).map(([col, data]) => [Number(col), data]);
  }
}
