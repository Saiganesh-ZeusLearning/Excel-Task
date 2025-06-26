class CellData {
  private data: { [key: `${number}_${number}`]: string } = {};

  // Set value at row, col
  set(row: number, col: number, value: string): void {
    const key = `${row}_${col}` as const;
    this.data[key] = value;
  }

  // Get value at row, col
  get(row: number, col: number): string | undefined {
    const key = `${row}_${col}` as const;
    return this.data[key];
  }

  // Optional: check if cell exists
  has(row: number, col: number): boolean {
    const key = `${row}_${col}` as const;
    return key in this.data;
  }

  // Optional: delete a cell
  delete(row: number, col: number): void {
    const key = `${row}_${col}` as const;
    delete this.data[key];
  }

  // Optional: get all entries
  entries(): [string, string][] {
    return Object.entries(this.data);
  }
}

export const cellData = new CellData();
