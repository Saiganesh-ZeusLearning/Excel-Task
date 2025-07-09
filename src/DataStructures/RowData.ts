/**
 * Class to manage row metadata like height and selection state.
 */
export class RowData {
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
   * @returns {{ height: number } | undefined} Row data or undefined.
   */
  get(row: number): { height: number } | undefined {
    return this.rows[row];
  }

  /**
   * Checks if the given row exists.
   * @param {number} row - Row index.
   * @returns {boolean} True if row exists.
   */
  has(row: number): boolean {
    return row in this.rows;
  }

  /**
   * Deletes the row data at the specified row index.
   * @param {number} row - Row index.
   */
  delete(row: number): void {
    delete this.rows[row];
  }

  /**
   * Returns all stored row entries.
   * @returns {[number, { height: number }][]} Array of [row, data] pairs.
   */
  entries(): [number, { height: number }][] {
    return Object.entries(this.rows).map(([row, data]) => [Number(row), data]);
  }


  insertRowAt(row: number): void {
    const referenceHeight = this.get(row - 1)?.height ?? 24;

    // Shift rows from bottom to top, delete original after moving
    const entriesToShift = this.entries()
      .filter(([r]) => r >= row)
      .sort((a, b) => b[0] - a[0]); // descending order

    for (const [r, data] of entriesToShift) {
      this.set(r + 1, data.height); // shift to next row
      this.delete(r);               // remove original
    }

    // Set inserted row with height copied from above
    this.set(row, referenceHeight);
  }

}

/** Singleton instance of the RowData class */

// Example usage:
// RowData.setSelectedCellRow(5);
// RowData.setSelectedRow(5);

// rowData.insertRowAt(5);
// rowData.set(5, 25);
// rowData.set(7, 25);

// console.log(rowData.entries());


