export interface rowDataValueInterface {
    height: number;
    prefixHeight: number;
    isSingleRowCellSelected: boolean;
    isRowSelected: boolean;
};

export interface rowDataInterface {
    [row: number]: rowDataValueInterface
}

class RowData {
    private data: rowDataInterface = {};

    // Set row data
    set(
        row: number,
        value: {
            height: number;
            prefixHeight: number;
            isSingleRowCellSelected: boolean;
            isRowSelected: boolean;
        }
    ): void {
        this.data[row] = value;
    }

    // Get row data
    get(row: number) {
        return this.data[row];
    }

    // Check if row exists
    has(row: number): boolean {
        return row in this.data;
    }

    // Delete a row
    delete(row: number): void {
        delete this.data[row];
    }

    findRowByPixelY(y: number, rowData: any): number {
        for (const [row, data] of rowData.entries()) {
            if (y >= data.prefixHeight && y < data.prefixHeight + data.height) {
                return row + 1;
            }
        }
        return 0;
    }

    // Get all entries
    entries(): [number, typeof this.data[number]][] {
        return Object.entries(this.data).map(([key, value]) => [parseInt(key), value]);
    }
}

export const rowData = new RowData();

function setDefaultValues() {
    for (let i = 0; i <= 100000; i++) {
        rowData.set(i, {
            height: 24,
            prefixHeight: i*24 + 25,
            isSingleRowCellSelected: false,
            isRowSelected: false,
        })
    }
}
setDefaultValues();

function recalculatePrefixHeights(fromRow: number = 0) {
    const entries = rowData.entries().sort((a, b) => a[0] - b[0]);

    for (let i = fromRow; i < entries.length; i++) {
        const [row, data] = entries[i];

        if (row === 0) {
            data.prefixHeight = 0;
        } else {
            const prev = rowData.get(row - 1);
            if (prev) {
                data.prefixHeight = prev.prefixHeight + prev.height;
            }
        }

        rowData.set(row, data); // Update with new prefixHeight
    }
}

// rowData.set(5, { ...rowData.get(5), height: 48 });
// recalculatePrefixHeights(5); // Update prefixHeight from row 4 onward
// rowData.set(8, { ...rowData.get(8), height: 72 });
// recalculatePrefixHeights(8); // Update prefixHeight from row 4 onward
