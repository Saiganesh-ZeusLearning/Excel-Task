export class RowData {
  private rows: {
    [row: number]: {
      height: number;
    };
  } = {};

  private static selectedCellRow: number | null = null;
  private static selectedRow: number | null = null;

  // Set row height
  set(row: number, height: number): void {
    this.rows[row] = { height };
  }

  // Get row data
  get(row: number): { height: number } | undefined {
    return this.rows[row];
  }

  // Check if row exists
  has(row: number): boolean {
    return row in this.rows;
  }

  // Delete row
  delete(row: number): void {
    delete this.rows[row];
  }

  // Get all entries
  entries(): [number, { height: number }][] {
    return Object.entries(this.rows).map(([row, data]) => [Number(row), data]);
  }

  // --- Static handlers for selection ---

  static setSelectedCellRow(row: number | null) {
    RowData.selectedCellRow = row;
  }

  static getSelectedCellRow(): number | null {
    return RowData.selectedCellRow;
  }

  static setSelectedRow(row: number | null) {
    RowData.selectedRow = row;
  }

  static getSelectedRow(): number | null {
    return RowData.selectedRow;
  }
}

export const rowData = new RowData();

// RowData.setSelectedCellRow(5);
// RowData.setSelectedRow(5);
