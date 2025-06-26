import { cellData } from "../DataStructures/CellData.js";
import { excelRenderer } from "../main.js";

export class InputManager {
  private scrollDiv: HTMLElement;
  private inputDiv: HTMLInputElement;

  private prevTop: number = 0;
  private prevLeft: number = 0;
  private prevRow: number = 0;
  private prevCol: number = 0;
  private currRow: number = 0;
  private currCol: number = 0;

  private top: number = 0;
  private left: number = 0;

  constructor() {
    this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;

    this.attachListeners();
  }

  private attachListeners() {
    this.scrollDiv.addEventListener("click", this.handleClick.bind(this));
    this.inputDiv.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleClick(e: MouseEvent) {
    const scrollLeft = this.scrollDiv.scrollLeft;
    const scrollTop = this.scrollDiv.scrollTop;

    this.left = Math.floor((e.clientX + scrollLeft - 50) / 100) * 100 + 50;
    this.top = Math.floor((e.clientY + scrollTop - 25) / 24) * 24 + 25;

    this.currRow = Math.ceil((e.clientY + scrollTop - 25) / 24);
    this.currCol = Math.ceil((e.clientX + scrollLeft - 50) / 100);

    if (this.prevTop !== this.top || this.prevLeft !== this.left) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow, this.prevCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(this.currRow, this.currCol)) {
        this.inputDiv.value = cellData.get(this.currRow, this.currCol) || "";
      }
      excelRenderer.render();

      this.prevRow = this.currRow;
      this.prevCol = this.currCol;
      this.prevTop = this.top;
      this.prevLeft = this.left;

    }

    this.inputDiv.style.top = `${this.top}px`;
    this.inputDiv.style.left = `${this.left}px`;
    this.inputDiv.focus();
    this.inputDiv.select();
  }

  private handleKeyDown(e: KeyboardEvent) {
    let currRow = Math.floor(Number((this.inputDiv.style.top).replace("px", "")) / 24);
    let currCol = Math.floor(Number((this.inputDiv.style.left).replace("px", "")) / 100);
    if (e.key === "Enter" || e.key === "ArrowDown") {

      if (this.inputDiv.value !== "") {
        cellData.set(currRow, currCol + 1, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(currRow + 1, currCol + 1)) {
        this.inputDiv.value = cellData.get(currRow + 1, currCol + 1) || "";
      }

      this.top += 24;
      excelRenderer.render();
      this.inputDiv.focus();
      this.inputDiv.select();

    } else if (e.key === "ArrowUp") {

      if (currRow === 1) {
        return;
      }

      if (this.inputDiv.value !== "") {
        cellData.set(currRow, currCol + 1, this.inputDiv.value);
        this.inputDiv.value = "";
        this.inputDiv.select();
      }

      if (cellData.has(currRow - 1, currCol + 1)) {
        this.inputDiv.value = cellData.get(currRow - 1, currCol + 1) || "";
      }

      this.top -= 24;
      excelRenderer.render();
      this.inputDiv.focus();
    } else if (e.key === "ArrowLeft") {

    }
    this.inputDiv.style.top = `${this.top}px`;
  }
}

