import { selectionManager } from "./SelectionManager.js";

export class Calculations{
    optionSelector: HTMLSelectElement;
    calculateBtn: HTMLElement;

    constructor(){
        this.optionSelector = document.querySelector("#formulas") as HTMLSelectElement;
        this.calculateBtn = document.querySelector(".calculateBtn") as HTMLElement;

        this.calculateBtn.addEventListener("click", () => {
            console.log(selectionManager.RowSelectionStart)
            console.log(this.optionSelector.value);
        })
    }
}