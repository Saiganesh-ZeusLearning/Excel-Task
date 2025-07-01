/**
 * Class to manage and store cell data using a row_col key format.
 */
class CellData {
  /**
   * Internal map storing cell values with keys formatted as `${row}_${col}`.
   * @private
   * @type {{ [key: `${number}_${number}`]: string }}
   */
  private data: { [key: `${number}_${number}`]: string } = {};

  /**
   * Sets the value at a specific row and column.
   * @param {number} row - Row index of the cell.
   * @param {number} col - Column index of the cell.
   * @param {string} value - Value to store in the cell.
   */
  set(row: number, col: number, value: string): void {
    const key = `${row}_${col}` as const;
    this.data[key] = value;
  }

  /**
   * Retrieves the value from a specific cell.
   * @param {number} row - Row index of the cell.
   * @param {number} col - Column index of the cell.
   * @returns {string | undefined} The stored value or undefined if not set.
   */
  get(row: number, col: number): string | undefined {
    const key = `${row}_${col}` as const;
    return this.data[key];
  }

  /**
   * Checks whether a value exists at the given row and column.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @returns {boolean} True if the cell exists, false otherwise.
   */
  has(row: number, col: number): boolean {
    const key = `${row}_${col}` as const;
    return key in this.data;
  }

  /**
   * Deletes the value at the specified row and column.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   */
  delete(row: number, col: number): void {
    const key = `${row}_${col}` as const;
    delete this.data[key];
  }

  /**
   * Returns all stored cell entries.
   * @returns {[string, string][]} An array of [key, value] pairs.
   */
  entries(): [string, string][] {
    return Object.entries(this.data);
  }
}

/** Singleton instance of the CellData class */
export const cellData = new CellData();

// Example usage
cellData.set(4, 3, "Hello");
