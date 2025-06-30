export class ColData {
  private cols: {
    [col: number]: {
      width: number;
    };
  } = {};

  private static selectedCol: number | null = null;
  private static selectedCellCol: number | null = null;

  // Set column data
  set(col: number, width: number): void {
    this.cols[col] = { width };
  }

  // Get column data
  get(col: number): { width: number } | undefined {
    return this.cols[col];
  }

  // Check if column exists
  has(col: number): boolean {
    return col in this.cols;
  }

  // Delete column
  delete(col: number): void {
    delete this.cols[col];
  }

  // Get all entries
  entries(): [number, { width: number }][] {
    return Object.entries(this.cols).map(([col, data]) => [Number(col), data]);
  }

  // Static Selected Column (for full column highlight)
  static setSelectedCol(col: number | null) {
    ColData.selectedCol = col;
  }

  static getSelectedCol(): number | null {
    return ColData.selectedCol;
  }

  // Static Selected Cell Column (for cell highlight)
  static setSelectedCellCol(col: number | null) {
    ColData.selectedCellCol = col;
  }

  static getSelectedCellCol(): number | null {
    return ColData.selectedCellCol;
  }
}

export const colData = new ColData();

colData.set(2, 200);
// ColData.setSelectedCol(2); // highlights full column
// ColData.setSelectedCellCol(2); // highlights a single cell
