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
   * Tracks the row of the selected cell.
   * @private
   * @static
   * @type {number | null}
   */
  private static selectedCellRow: number | null = null;

  /**
   * Tracks the currently selected row (for full row highlight).
   * @private
   * @static
   * @type {number | null}
   */
  private static selectedRow: number | null = null;

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

  // --- Static Handlers for Row Selection ---

  /**
   * Sets the row index of the selected cell.
   * @param {number | null} row - Row index or null to clear.
   */
  static setSelectedCellRow(row: number | null) {
    RowData.selectedCellRow = row;
  }

  /**
   * Gets the row index of the selected cell.
   * @returns {number | null} Selected cell row index.
   */
  static getSelectedCellRow(): number | null {
    return RowData.selectedCellRow;
  }

  /**
   * Sets the selected row (for full row highlight).
   * @param {number | null} row - Row index or null to clear.
   */
  static setSelectedRow(row: number | null) {
    RowData.selectedRow = row;
  }

  /**
   * Gets the currently selected row (for full row highlight).
   * @returns {number | null} Selected row index.
   */
  static getSelectedRow(): number | null {
    return RowData.selectedRow;
  }
}

/** Singleton instance of the RowData class */
export const rowData = new RowData();

// Example usage:
// RowData.setSelectedCellRow(5);
// RowData.setSelectedRow(5);
