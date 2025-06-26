import { cellData } from "../DataStructures/CellData.js";
import { excelRenderer } from "../main.js";

export class InputManager {
  private scrollDiv: HTMLElement;
  private inputDiv: HTMLInputElement;

  private prevTop: number = 0;
  private prevLeft: number = 0;
  private prevRow: number = 0;
  private prevCol: number = 0;

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

    const row = Math.ceil((e.clientY + scrollTop - 25) / 24);
    const col = Math.ceil((e.clientX + scrollLeft - 50) / 100);

    if (this.prevTop !== this.top || this.prevLeft !== this.left) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow, this.prevCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(row, col)) {
        this.inputDiv.value = cellData.get(row, col) || "";
      }

      excelRenderer.render();

      this.prevRow = row;
      this.prevCol = col;
      this.prevTop = this.top;
      this.prevLeft = this.left;
    }

    this.inputDiv.style.top = `${this.top}px`;
    this.inputDiv.style.left = `${this.left}px`;
    this.inputDiv.focus();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.top += 24;
      this.inputDiv.style.top = `${this.top}px`;
      excelRenderer.render();
    }
  }
}

