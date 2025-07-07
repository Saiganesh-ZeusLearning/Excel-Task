import { cellData } from "../DataStructures/CellData.js";
import { selectionManager } from "./SelectionManager.js";

export class Calculations {
    optionSelector: HTMLSelectElement;
    calculateBtn: HTMLElement;
    output: HTMLInputElement;

    constructor() {
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
        if(selector === "max"){
            res = -Infinity;
        }else if(selector === "min"){
            res = Infinity
        }
        if (selectionManager.RowSelectionStatus) {
            let rowStart = selectionManager.RowSelectionStart + 1;
            let rowEnd = selectionManager.RowSelectionEnd + 1;
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
        } else if (selectionManager.ColSelectionStatus) {
            let colStart = selectionManager.ColSelectionStart + 1;
            let colEnd = selectionManager.ColSelectionEnd + 1;
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
        } else if (selectionManager.getCellSelection.selectionState) {

            const {
                startRow,
                endRow,
                startCol,
                endCol,
            } = selectionManager.getCellSelection;

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