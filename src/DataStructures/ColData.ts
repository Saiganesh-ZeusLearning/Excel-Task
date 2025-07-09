/**
 * Class to manage column metadata like width and selection state.
 */
export class ColData {
  /**
   * Internal storage for column widths, indexed by column number.
   * @private
   * @type {{ [col: number]: { width: number } }}
   */
  private cols: {
    [col: number]: {
      width: number;
    };
  } = {};


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

  insertColumnAt(col: number): void {
    const referenceWidth = this.get(col - 1)?.width ?? 100;

    // Shift columns from right to left (descending)
    const entriesToShift = this.entries()
      .filter(([c]) => c >= col)
      .sort((a, b) => b[0] - a[0]); // descending order

    for (const [c, data] of entriesToShift) {
      this.set(c + 1, data.width); // shift to next col
      this.delete(c);              // delete original
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



// Example usage
// colData.set(2, 200);
// ColData.setSelectedCol(2); // highlights full column
// ColData.setSelectedCellCol(2); // highlights a single cell
