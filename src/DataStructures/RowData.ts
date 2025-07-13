/**
 * Class to manage row metadata like height and selection state.
 */
export class RowData {

  /** @type {number} Stores the start index of the selected row range */
  private RowSelectionStart = -100;

  /** @type {number} Stores the end index of the selected row range */
  private RowSelectionEnd = -100;

  /** @type {boolean} Tracks if a row selection is active */
  private RowSelectionStatus = false;

  /** @type {boolean} Indicates whether a row is being resized */
  private isRowResizing = false;

  /**
   * Internal storage for row heights, indexed by row number.
   * @private
   * @type {{ [row: number]: { height: number } }}
   */
  private rows: {
    [row: number]: {
      height: number;
    };
  } = {};

  /**
   * Sets the current row selection details.
   * @param {{ startRow: number, endRow: number, selectionState: boolean, isRowResizing: boolean }} data
   * Object containing selection metadata.
   */
  set RowSelection(data: {
    startRow: number,
    endRow: number,
    selectionState: boolean,
    isRowResizing: boolean
  }) {
    this.RowSelectionStart = data.startRow;
    this.RowSelectionEnd = data.endRow;
    this.RowSelectionStatus = data.selectionState;
    this.isRowResizing = data.isRowResizing;
  }

  /**
   * Returns the current row selection details.
   * @returns {{ startRow: number, endRow: number, selectionState: boolean, isRowResizing: boolean }}
   */
  get RowSelection() {
    return {
      startRow: this.RowSelectionStart,
      endRow: this.RowSelectionEnd,
      selectionState: this.RowSelectionStatus,
      isRowResizing: this.isRowResizing,
    };
  }

  /**
   * Sets the height of a specific row.
   * @param {number} row - Row index.
   * @param {number} height - Height to assign to the row.
   */
  set(row: number, height: number): void {
    this.rows[row] = { height };
  }

  /**
   * Gets the row data for a specific row.
   * @param {number} row - Row index.
   * @returns {{ height: number } | undefined} Row data or undefined if not found.
   */
  get(row: number): { height: number } | undefined {
    return this.rows[row];
  }

  /**
   * Checks if the given row exists in the data.
   * @param {number} row - Row index.
   * @returns {boolean} True if the row exists, false otherwise.
   */
  has(row: number): boolean {
    return row in this.rows;
  }

  /**
   * Deletes the row data at the specified row index.
   * @param {number} row - Row index to delete.
   */
  delete(row: number): void {
    delete this.rows[row];
  }

  /**
   * Returns all stored row entries as an array of [row, data] pairs.
   * @returns {[number, { height: number }][]} Array of row entries.
   */
  entries(): [number, { height: number }][] {
    return Object.entries(this.rows).map(([row, data]) => [Number(row), data]);
  }

  /**
   * Inserts a new row at the specified index and shifts rows below it.
   * @param {number} row - The index at which to insert a new row.
   */
  insertRowAt(row: number): void {
    const referenceHeight = this.get(row - 1)?.height ?? 24;

    // Shift rows from bottom to top and delete originals
    const entriesToShift = this.entries()
      .filter(([r]) => r >= row)
      .sort((a, b) => b[0] - a[0]); // descending order

    for (const [r, data] of entriesToShift) {
      this.set(r + 1, data.height); // shift to next row
      this.delete(r);               // remove original
    }

    // Set the inserted row with copied height
    this.set(row, referenceHeight);
  }
}
