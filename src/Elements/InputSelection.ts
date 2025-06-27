import { cellData } from "../DataStructures/CellData.js";
import { colData } from "../DataStructures/ColData.js";
import { rowData } from "../DataStructures/RowData.js";
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

    this.currRow = rowData.findRowByPixelY(e.clientY + scrollTop, rowData);
    this.currCol = colData.findColByPixelX(e.clientX + scrollLeft, colData);

    console.log(this.prevRow);
    

    this.top = rowData.get(this.currRow - 1).prefixHeight;
    this.left = colData.get(this.currCol - 1).prefixWidth;


    if (this.prevTop !== this.top || this.prevLeft !== this.left) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow, this.prevCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(this.currRow, this.currCol)) {
        this.inputDiv.value = cellData.get(this.currRow, this.currCol) || "";
      }
      this.inputDiv.style.display = "block";
      excelRenderer.render();

      this.prevRow = this.currRow;
      this.prevCol = this.currCol;
      this.prevTop = this.top;
      this.prevLeft = this.left;

    }
    this.inputDiv.style.height = `${rowData.get(this.currRow - 1).height - 6}px`
    this.inputDiv.style.width = `${colData.get(this.currCol - 1).width - 6}px`;
    this.inputDiv.style.top = `${this.top}px`;
    this.inputDiv.style.left = `${this.left}px`;
    this.inputDiv.focus();
  }

  private handleKeyDown(e: KeyboardEvent) {

    if (e.key === "Enter" || e.key === "ArrowDown") {

      if (this.inputDiv.value !== "") {
        cellData.set(this.currRow, this.currCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(this.currRow + 1, this.currCol)) {
        this.inputDiv.value = cellData.get(this.currRow + 1, this.currCol) || "";
      }
      this.currRow++;
    } else if (e.key === "ArrowUp") {
      
      if (this.currRow === 1) {
        return;
      }
      if (this.inputDiv.value !== "") {
        cellData.set(this.currRow, this.currCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(this.currRow - 1, this.currCol)) {
        this.inputDiv.value = cellData.get(this.currRow - 1, this.currCol) || "";
      }
      this.currRow--;
    } else if (e.key === "ArrowLeft") {

      if (this.currCol === 1) {
        return;
      }
      if (this.inputDiv.value !== "") {
        cellData.set(this.currRow, this.currCol, this.inputDiv.value);
        this.inputDiv.value = "";
        this.inputDiv.select();
      }
       if (cellData.has(this.currRow, this.currCol-1)) {
        this.inputDiv.value = cellData.get(this.currRow, this.currCol-1) || "";
      }
      this.currCol--;
    } else if (e.key === "ArrowRight") {

      if (this.inputDiv.value !== "") {
        cellData.set(this.currRow, this.currCol, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(this.currRow, this.currCol + 1)) {
        this.inputDiv.value = cellData.get(this.currRow, this.currCol + 1) || "";
      }

      this.currCol++;
    }

    this.inputDiv.style.height = `${rowData.get(this.currRow - 1).height - 6}px`;
    this.inputDiv.style.width = `${colData.get(this.currCol - 1).width - 6}px`;
    this.inputDiv.style.top = `${rowData.get(this.currRow - 1).prefixHeight}px`;
    this.inputDiv.style.left = `${colData.get(this.currCol - 1).prefixWidth}px`;
    excelRenderer.render();
  }
}

