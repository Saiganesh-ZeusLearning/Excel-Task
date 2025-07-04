import { cellData } from "../DataStructures/CellData.js";
import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";
import { excelRenderer } from "../main.js";
import { selectionManager } from "./SelectionManager.js";

/**
 * Manages input editing within the grid cells.
 * Handles click-based selection and keyboard navigation.
 */
export class InputManager {
  public inputDiv: HTMLInputElement;
  public scrollDiv: HTMLElement;
  public mainCanvas: HTMLElement;

  private prevTop: number = 0;
  private prevLeft: number = 0;
  private prevRow: number = 0;
  private prevCol: number = 0;

  private defaultRowHeight = 24;
  private defaultColWidth = 100;

  public width;
  public height;
  public shiftRow;
  public shiftCol;

  constructor() {
    this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    this.mainCanvas = document.querySelector(".main-canvas") as HTMLElement;
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.shiftRow = 0;
    this.shiftCol = 0;

    this.attachListeners();
  }

  private attachListeners() {
    this.mainCanvas.addEventListener("mousedown", this.handleClickEvent.bind(this));
    this.inputDiv.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

  public setInputLocation(setRow: number, setCol: number) {
    let cellLeft = 50;
    for (let i = 0; i < setCol; i++) {
      cellLeft += colData.get(i)?.width ?? 100;
    }

    let cellTop = 30;
    for (let i = 0; i < setRow; i++) {
      cellTop += rowData.get(i)?.height ?? 24;
    }

    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      this.saveCurrentCellValue();
      this.inputDiv.value = cellData.get(setRow + 1, setCol + 1) ?? "";

      this.prevRow = setRow;
      this.prevCol = setCol;
      this.prevTop = cellTop;
      this.prevLeft = cellLeft;
    }

    RowData.setSelectedCellRow(setRow);
    ColData.setSelectedCellCol(setCol);

    this.inputDiv.style.height = `${(rowData.get(setRow)?.height ?? 18) - 10}px`;
    this.inputDiv.style.width = `${(colData.get(setCol)?.width ?? 100) - 8}px`;
    this.inputDiv.style.top = `${cellTop}px`;
    this.inputDiv.style.left = `${cellLeft}px`;
    this.inputDiv.focus();
  }

  private handleClickEvent(e: MouseEvent) {
    e.preventDefault();
    const scrollLeft = this.scrollDiv.scrollLeft;
    const scrollTop = this.scrollDiv.scrollTop;

    const clientX = e.clientX + scrollLeft - 50;
    const clientY = e.clientY + scrollTop - 25;

    RowData.setSelectedRow(null);
    ColData.setSelectedCol(null);

    let x = 0, col = 0;
    let colWidth: number = 0;
    while (x <= clientX) {
      colWidth = colData.get(col)?.width ?? this.defaultColWidth;
      if (x + colWidth > clientX) break;
      x += colWidth;
      col++;
    }

    let y = 0, row = 0;
    while (y <= clientY) {
      const rowHeight = rowData.get(row)?.height ?? this.defaultRowHeight;
      if (y + rowHeight > clientY) break;
      y += rowHeight;
      row++;
    }

    RowData.setSelectedCellRow(row);
    ColData.setSelectedCellCol(col);
    selectionManager.set(row, col, row, col, true);

    const cellTop = y + 25;
    const cellLeft = x + 50;

    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      this.saveCurrentCellValue();
      this.inputDiv.value = cellData.get(row + 1, col + 1) ?? "";

      this.prevRow = row;
      this.prevCol = col;
      this.prevTop = cellTop;
      this.prevLeft = cellLeft;
    }

    this.setInputLocation(row, col);

    this.inputDiv.style.display = "block";
    this.inputDiv.style.caretColor = "transparent";
    this.shiftRow = 0;
    this.shiftCol = 0;
    this.inputDiv.focus();
    excelRenderer.render();
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.saveCurrentCellValue();

    if (e.shiftKey) {
      if (e.key === 'ArrowDown') this.shiftRow++;
      else if (e.key === 'ArrowUp') this.shiftRow--;
      else if (e.key === 'ArrowRight') this.shiftCol++;
      else if (e.key === 'ArrowLeft') this.shiftCol--;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow + this.shiftRow, this.prevCol + this.shiftCol, true);
      RowData.setSelectedCellRow(this.prevRow + this.shiftRow);
      excelRenderer.render();
      return;
    }

    if (e.key === 'Enter' && e.shiftKey && this.prevRow > 0) {
      const above = rowData.get(this.prevRow - 1)?.height ?? this.defaultRowHeight;
      this.prevTop -= above;
      this.prevRow--;
    } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
      const curr = rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
      this.prevTop += curr;
      this.prevRow++;
    } else if (e.key === 'ArrowUp' && this.prevRow > 0) {
      const above = rowData.get(this.prevRow - 1)?.height ?? this.defaultRowHeight;
      this.prevTop -= above;
      this.prevRow--;
    } else if (e.key === 'ArrowRight') {
      const curr = colData.get(this.prevCol)?.width ?? this.defaultColWidth;
      this.prevLeft += curr;
      this.prevCol++;
    } else if (e.key === 'ArrowLeft' && this.prevCol > 0) {
      const left = colData.get(this.prevCol - 1)?.width ?? this.defaultColWidth;
      this.prevLeft -= left;
      this.prevCol--;
    } else {
      this.inputDiv.style.caretColor = "black";
      return;
    }

    this.resetShift();
    this.inputDiv.style.caretColor = "transparent";
    
    selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true);
    RowData.setSelectedCellRow(this.prevRow);

    this.updateScrollIfNeeded();
    this.updateInputBoxPosition();
    excelRenderer.render();
  }

  private saveCurrentCellValue() {
    if (this.inputDiv.value !== "") {
      cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
    }
  }

  private updateInputBoxPosition() {
    this.inputDiv.style.height = `${(rowData.get(this.prevRow)?.height ?? 18) - 10}px`;
    this.inputDiv.style.width = `${(colData.get(this.prevCol)?.width ?? 100) - 8}px`;
    this.inputDiv.style.top = `${this.prevTop}px`;
    this.inputDiv.style.left = `${this.prevLeft}px`;
    this.inputDiv.focus();

    const nextVal = cellData.get(this.prevRow + 1, this.prevCol + 1);
    this.inputDiv.value = nextVal ?? "";
  }

  private updateScrollIfNeeded() {
    let rightEdge = this.prevLeft + (colData.get(this.prevCol)?.width ?? this.defaultColWidth);
    let bottomEdge = this.prevTop + (rowData.get(this.prevRow)?.height ?? this.defaultRowHeight);

    if (rightEdge > this.width + this.scrollDiv.scrollLeft) {
      this.scrollDiv.scrollLeft += colData.get(this.prevCol)?.width ?? this.defaultColWidth;
    } else if (this.prevLeft < this.scrollDiv.scrollLeft) {
      this.scrollDiv.scrollLeft -= colData.get(this.prevCol)?.width ?? this.defaultColWidth;
    }

    if (bottomEdge > this.height - 10 + this.scrollDiv.scrollTop) {
      this.scrollDiv.scrollTop += rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
    } else if (this.prevTop < this.scrollDiv.scrollTop + 20) {
      this.scrollDiv.scrollTop -= rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
    }
  }

  private resetShift() {
    this.shiftRow = 0;
    this.shiftCol = 0;
  }
}
