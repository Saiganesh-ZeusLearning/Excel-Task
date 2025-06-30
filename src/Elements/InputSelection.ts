import { cellData } from "../DataStructures/CellData.js";
import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { excelRenderer } from "../main.js";

export class InputManager {
  public inputDiv: HTMLInputElement;
  public scrollDiv: HTMLElement;

  private prevTop: number = 0;
  private prevLeft: number = 0;
  private prevRow: number = 0;
  private prevCol: number = 0;


  constructor() {
    this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;

    this.attachListeners();
  }

  private attachListeners() {
    this.scrollDiv.addEventListener("click", this.handleClickEvent.bind(this));
    this.inputDiv.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleClickEvent(e: MouseEvent) {
    const scrollLeft = this.scrollDiv.scrollLeft;
    const scrollTop = this.scrollDiv.scrollTop;

    const clientX = e.clientX + scrollLeft - 50; // offset for col label
    const clientY = e.clientY + scrollTop - 25; // offset for row label
    RowData.setSelectedRow(null); 
    ColData.setSelectedCol(null); 
    if (clientX <= 0 || clientY <= 0) {
      return;
    }

    // === Calculate Column ===
    let x = 0;
    let col = 0;
    while (x <= clientX) {
      const colWidth = colData.get(col)?.width ?? 100;
      if (x + colWidth > clientX) break;
      x += colWidth;
      col++;
    }

    // === Calculate Row ===
    let y = 0;
    let row = 0;
    while (y <= clientY) {
      const rowHeight = rowData.get(row)?.height ?? 24;
      if (y + rowHeight > clientY) break;
      y += rowHeight;
      row++;
    }


    RowData.setSelectedCellRow(row);
    ColData.setSelectedCellCol(col);

    // === Compute Top and Left for Input ===
    const cellTop = y + 25;   // + row label height
    const cellLeft = x + 50;  // + col label width

    // === Save previous if changed ===
    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(row + 1, col + 1)) {
        this.inputDiv.value = cellData.get(row + 1, col + 1) || "";
      }

      excelRenderer.render();

      this.prevRow = row;
      this.prevCol = col;
      this.prevTop = cellTop;
      this.prevLeft = cellLeft;
    }
    this.inputDiv.style.display = "block"
    this.inputDiv.style.height = `${(rowData.get(row)?.height ?? 24) - 6}px`;
    this.inputDiv.style.width = `${(colData.get(col)?.width ?? 100) - 8}px`;
    this.inputDiv.style.top = `${cellTop}px`;
    this.inputDiv.style.left = `${cellLeft}px`;
    this.inputDiv.focus();
  }


  private handleKeyDown(e: KeyboardEvent) {
    const defaultRowHeight = 24;
    const defaultColWidth = 100;

    // Save current cell data
    if (this.inputDiv.value !== "") {
      cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
    }

    // === Move based on key ===
    if (e.key === "Enter" || e.key === "ArrowDown") {
      const currHeight = rowData.get(this.prevRow)?.height ?? defaultRowHeight;
      this.prevTop += currHeight;
      this.prevRow++;
    }

    if (e.key === "ArrowUp" && this.prevRow > 0) {
      const aboveHeight = rowData.get(this.prevRow - 1)?.height ?? defaultRowHeight;
      this.inputDiv.select();
      this.prevTop -= aboveHeight;
      this.prevRow--;
    }

    if (e.key === "ArrowRight") {
      const currWidth = colData.get(this.prevCol)?.width ?? defaultColWidth;
      this.prevLeft += currWidth;
      this.prevCol++;
    }

    if (e.key === "ArrowLeft" && this.prevCol > 0) {
      const leftWidth = colData.get(this.prevCol - 1)?.width ?? defaultColWidth;
      this.inputDiv.select();
      this.prevLeft -= leftWidth;
      this.prevCol--;
    }

    RowData.setSelectedCellRow(this.prevRow);
    ColData.setSelectedCellCol(this.prevCol);
    // === Load new cell value if exists ===
    const nextVal = cellData.get(this.prevRow + 1, this.prevCol + 1);
    this.inputDiv.value = nextVal ?? "";

    // === Update input box position ===
    this.inputDiv.style.height = `${(rowData.get(this.prevRow)?.height ?? 24) - 6}px`;
    this.inputDiv.style.width = `${(colData.get(this.prevCol)?.width ?? 100) - 8}px`;
    this.inputDiv.style.top = `${this.prevTop}px`;
    this.inputDiv.style.left = `${this.prevLeft}px`;
    this.inputDiv.focus();

    // === Redraw grid ===
    excelRenderer.render();
  }
}

