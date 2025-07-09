import { cellData } from "../main.js";
import { SelectionManager } from "../Core/SelectionManager.js";

export class Calculations {
    private optionSelector: HTMLSelectElement;
    private calculateBtn: HTMLElement;
    private output: HTMLInputElement;
    private selectionManager: SelectionManager;

    constructor(selectionManager: SelectionManager) {
        this.optionSelector = document.querySelector("#formulas") as HTMLSelectElement;
        this.calculateBtn = document.querySelector(".calculateBtn") as HTMLElement;
        this.output = document.querySelector(".output") as HTMLInputElement;
        this.selectionManager = selectionManager;
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
        if(selector === "max"){
            res = -Infinity;
        }else if(selector === "min"){
            res = Infinity
        }
        if (this.selectionManager.RowSelection.selectionState) {
            let rowStart = this.selectionManager.RowSelection.startRow + 1;
            let rowEnd = this.selectionManager.RowSelection.endRow + 1;
            for (let [coordinates, data] of cellData.entries()) {
                let row = Number(coordinates.split("_")[0]);
                if (row >= rowStart && row <= rowEnd) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        }else if(selector === "sum"){
                            res += Number(data);
                        }else if(selector === "max"){
                            res = Math.max(Number(data), res);
                        }else if(selector === "min"){
                            res = Math.min(Number(data), res);
                        }else if(selector === "average"){
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        } else if (this.selectionManager.ColSelection.selectionState) {
            let colStart = this.selectionManager.ColSelection.startCol + 1;
            let colEnd = this.selectionManager.ColSelection.endCol + 1;
            for (let [coordinates, data] of cellData.entries()) {
                let col = Number(coordinates.split("_")[1]);
                if (col >= colStart && col <= colEnd) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        }else if(selector === "sum"){
                            res += Number(data);
                        }else if(selector === "max"){
                            res = Math.max(Number(data), res);
                        }else if(selector === "min"){
                            res = Math.min(Number(data), res);
                        }else if(selector === "average"){
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        } else if (this.selectionManager.getCellSelection.selectionState) {

            const {
                startRow,
                endRow,
                startCol,
                endCol,
            } = this.selectionManager.getCellSelection;

            const [minStartRow, maxEndRow] = this.getSortedRange(startRow, endRow);
            const [minStartCol, maxEndCol] = this.getSortedRange(startCol, endCol);

            for (let [coordinates, data] of cellData.entries()) {
                let row = Number(coordinates.split("_")[0]);
                let col = Number(coordinates.split("_")[1]);
                if (col >= minStartCol && col <= maxEndCol && row >= minStartRow && row <= maxEndRow) {
                    if (isFinite(Number(data))) {
                        if (selector === "count") {
                            res++;
                        }else if(selector === "sum"){
                            res += Number(data);
                        }else if(selector === "max"){
                            res = Math.max(Number(data), res);
                        }else if(selector === "min"){
                            res = Math.min(Number(data), res);
                        }else if(selector === "average"){
                            res += Number(data);
                            cnt++;
                        }
                    }
                }
            }
        }
        return selector === "average" ? res/cnt : res;
    }
}