/**
 * Class to manage and manipulate cell data using a `${row}_${col}` key format.
 */
export class CellData {
  private data: { [key: `${number}_${number}`]: string } = {};

  /** Sets a value at given row and column */
  set(row: number, col: number, value: string): void {
    const key = `${row}_${col}` as const;
    this.data[key] = value;
  }

  /** Gets the value from a given cell */
  get(row: number, col: number): string | undefined {
    return this.data[`${row}_${col}` as const];
  }

  /** Checks if a cell exists */
  has(row: number, col: number): boolean {
    return `${row}_${col}` in this.data;
  }

  /** Deletes a specific cell */
  delete(row: number, col: number): void {
    delete this.data[`${row}_${col}` as const];
  }

  /** Returns all cells as [key, value] pairs */
  entries(): [string, string][] {
    return Object.entries(this.data);
  }

  /** Internal helper to recursively shift cell data down */
  private shiftCellDown(row: number, col: number, value: string): void {
    const nextRow = row + 1;

    if (this.has(nextRow, col)) {
      const nextValue = this.get(nextRow, col)!;
      this.shiftCellDown(nextRow, col, nextValue);
    }

    this.set(nextRow, col, value);
    this.delete(row, col);
  }

  /** Public method to shift all cells from a given row down by 1 */
  insertRowAt(row: number): void {
    const entriesToShift = this.entries()
      .map(([key, value]) => {
        const [r, c] = key.split("_").map(Number);
        return { row: r, col: c, value };
      })
      .filter(({ row: r }) => r >= row)
      .sort((a, b) => b.row - a.row); // bottom-up

    for (const { row: r, col: c, value } of entriesToShift) {
      this.shiftCellDown(r, c, value);
    }
  }
  /** Internal helper to recursively shift cell data right */
  private shiftCellRight(row: number, col: number, value: string): void {
    const nextCol = col + 1;

    if (this.has(row, nextCol)) {
      const nextValue = this.get(row, nextCol)!;
      this.shiftCellRight(row, nextCol, nextValue);
    }

    this.set(row, nextCol, value);
    this.delete(row, col);
  }

  /** Public method to shift all cells from a given column right by 1 */
  insertColumnAt(col: number): void {
    const entriesToShift = this.entries()
      .map(([key, value]) => {
        const [r, c] = key.split("_").map(Number);
        return { row: r, col: c, value };
      })
      .filter(({ col: c }) => c >= col)
      .sort((a, b) => b.col - a.col); // right-to-left

    for (const { row: r, col: c, value } of entriesToShift) {
      this.shiftCellRight(r, c, value);
    }
  }

}
export const cellData = new CellData();

// cellData.set(6, 2, "123");
// cellData.set(7, 2, "hello");
// cellData.insertRowAt(6)

