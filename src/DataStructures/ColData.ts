export interface colDataValueInterface {
    width: number;
    prefixWidth: number;
    isSingleColCellSelected: boolean;
    isColSelected: boolean;
};

export interface colDataInterface {
    [col: number]: colDataValueInterface;
}

class ColData {
    private data: colDataInterface = {};

    set(
        col: number,
        value: {
            width: number;
            prefixWidth: number;
            isSingleColCellSelected: boolean;
            isColSelected: boolean;
        }
    ): void {
        this.data[col] = value;
    }

    get(col: number) {
        return this.data[col];
    }

    has(col: number): boolean {
        return col in this.data;
    }

    delete(col: number): void {
        delete this.data[col];
    }

    findColByPixelX(x: number, colData: any): number {
        for (const [col, data] of colData.entries()) {
            if (x >= data.prefixWidth && x < data.prefixWidth + data.width) {
                return col + 1;
            }
        }
        return 0;
    }

    entries(): [number, typeof this.data[number]][] {
        return Object.entries(this.data).map(([key, value]) => [parseInt(key), value]);
    }
}

export const colData = new ColData();

function setDefaultColValues() {
    for (let i = 0; i <= 100000; i++) {
        colData.set(i, {
            width: 100,
            prefixWidth: 100 * i + 50,
            isSingleColCellSelected: false,
            isColSelected: false,
        });
    }
}

setDefaultColValues();

function recalculatePrefixWidths(fromCol: number = 0) {
    const entries = colData.entries().sort((a, b) => a[0] - b[0]);

    for (let i = fromCol; i < entries.length; i++) {
        const [col, data] = entries[i];

        if (col === 0) {
            data.prefixWidth = 0;
        } else {
            const prev = colData.get(col - 1);
            if (prev) {
                data.prefixWidth = prev.prefixWidth + prev.width;
            }
        }

        colData.set(col, data);
    }
}


colData.set(5, { ...colData.get(5), width: 200 });
recalculatePrefixWidths(5);
