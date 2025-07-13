import { CellData } from "../DataStructures/CellData.js";
import { RowData } from "../DataStructures/RowData.js";
import { ColData } from "../DataStructures/ColData.js";

export class Calculations {
    private optionSelector: HTMLSelectElement;
    private calculateBtn: HTMLElement;
    private output: HTMLInputElement;
    private rowData: RowData;
    private colData: ColData;
    private cellData: CellData;


    constructor(rowData: RowData, colData: ColData, cellData: CellData) {
        this.rowData = rowData;
        this.colData = colData;
        this.cellData = cellData;
        this.optionSelector = document.querySelector("#formulas") as HTMLSelectElement;
        this.calculateBtn = document.querySelector(".calculateBtn") as HTMLElement;
        this.output = document.querySelector(".output") as HTMLInputElement;
        this.calculateBtn.addEventListener("click", () => {

            switch (this.optionSelector.value) {
                case "count":
                    this.output.value = this.DynamicCalculations("count").toString();
                    break;
                case "sum":
                    this.output.value = this.DynamicCalculations("sum").toString();
                    break;
                case "max":
                    this.output.value = this.DynamicCalculations("max").toString();
                    break;
                case "min":
                    this.output.value = this.DynamicCalculations("min").toString();
                    break;
                case "average":
                    this.output.value = this.DynamicCalculations("average").toString();
                    break;
                default:
                    console.log("Unknown");
            }
        })

    }
    getSortedRange(a: number, b: number): [number, number] {
        return [Math.min(a, b) + 1, Math.max(a, b) + 1];
    }

    private DynamicCalculations(selector: string): number {
        let res = 0;
        let cnt = 0;
        if (selector === "max") {
            res = -Infinity;
        } else if (selector === "min") {
            res = Infinity
        }
        if (this.rowData.RowSelection.selectionState) {
            let rowStart = this.rowData.RowSelection.startRow + 1;
            let rowEnd = this.rowData.RowSelection.endRow + 1;
            for (let [coordinates, data] of this.cellData.entries()) {
                let row = Number(coordinates.split("_")[0]);
                if (row >= rowStart && row <= rowEnd) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        } else if (selector === "sum") {
                            res += Number(data);
                        } else if (selector === "max") {
                            res = Math.max(Number(data), res);
                        } else if (selector === "min") {
                            res = Math.min(Number(data), res);
                        } else if (selector === "average") {
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        } else if (this.colData.ColSelection.selectionState) {
            let colStart = this.colData.ColSelection.startCol + 1;
            let colEnd = this.colData.ColSelection.endCol + 1;
            for (let [coordinates, data] of this.cellData.entries()) {
                let col = Number(coordinates.split("_")[1]);
                if (col >= colStart && col <= colEnd) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        } else if (selector === "sum") {
                            res += Number(data);
                        } else if (selector === "max") {
                            res = Math.max(Number(data), res);
                        } else if (selector === "min") {
                            res = Math.min(Number(data), res);
                        } else if (selector === "average") {
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        } 
        else if (this.cellData.getCellSelection.selectionState) {

            const {
                startRow,
                endRow,
                startCol,
                endCol,
            } = this.cellData.getCellSelection;

            const [minStartRow, maxEndRow] = this.getSortedRange(startRow, endRow);
            const [minStartCol, maxEndCol] = this.getSortedRange(startCol, endCol);

            for (let [coordinates, data] of this.cellData.entries()) {
                let row = Number(coordinates.split("_")[0]);
                let col = Number(coordinates.split("_")[1]);
                if (col >= minStartCol && col <= maxEndCol && row >= minStartRow && row <= maxEndRow) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        } else if (selector === "sum") {
                            res += Number(data);
                        } else if (selector === "max") {
                            res = Math.max(Number(data), res);
                        } else if (selector === "min") {
                            res = Math.min(Number(data), res);
                        } else if (selector === "average") {
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        }
        return selector === "average" ? res / cnt : res;
    }
}