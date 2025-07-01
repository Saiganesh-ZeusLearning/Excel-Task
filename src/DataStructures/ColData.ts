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
   * Tracks the currently selected column for full column highlight.
   * @private
   * @static
   * @type {number | null}
   */
  private static selectedCol: number | null = null;

  /**
   * Tracks the column of the selected cell.
   * @private
   * @static
   * @type {number | null}
   */
  private static selectedCellCol: number | null = null;

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
   * Returns all stored column entries.
   * @returns {[number, { width: number }][]} Array of [col, data] pairs.
   */
  entries(): [number, { width: number }][] {
    return Object.entries(this.cols).map(([col, data]) => [Number(col), data]);
  }

  /**
   * Sets the selected column (for full column highlight).
   * @param {number | null} col - Column index or null to clear selection.
   */
  static setSelectedCol(col: number | null) {
    ColData.selectedCol = col;
  }

  /**
   * Gets the currently selected column (for full column highlight).
   * @returns {number | null} Selected column index.
   */
  static getSelectedCol(): number | null {
    return ColData.selectedCol;
  }

  /**
   * Sets the column of the selected cell.
   * @param {number | null} col - Column index or null to clear selection.
   */
  static setSelectedCellCol(col: number | null) {
    ColData.selectedCellCol = col;
  }

  /**
   * Gets the column of the selected cell.
   * @returns {number | null} Selected cell column index.
   */
  static getSelectedCellCol(): number | null {
    return ColData.selectedCellCol;
  }
}

/** Singleton instance of the ColData class */
export const colData = new ColData();

// Example usage
// colData.set(2, 200);
// ColData.setSelectedCol(2); // highlights full column
// ColData.setSelectedCellCol(2); // highlights a single cell
