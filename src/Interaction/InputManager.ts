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
  /** Input box for editing cell content */
  public inputDiv: HTMLInputElement;

  /** Scroll container element */
  public scrollDiv: HTMLElement;

  /** Main Canvas container element */
  public mainCanvas: HTMLElement;

  /** Previously selected cell's top position */
  private prevTop: number = 0;

  /** Previously selected cell's left position */
  private prevLeft: number = 0;

  /** Previously selected row index */
  private prevRow: number = 0;

  /** Previously selected column index */
  private prevCol: number = 0;

  /** Default Row Height */
  private defaultRowHeight = 24;

  /** Default Width Height */
  private defaultColWidth = 100;

  public width;
  public height;

  public shiftRow;

  public shiftCol;


  /**
   * Initializes input manager and attaches event listeners.
   */
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

  /**
   * Attaches listeners for clicks and keyboard navigation.
   */
  private attachListeners() {
    this.mainCanvas.addEventListener("mousedown", this.handleClickEvent.bind(this));
    this.inputDiv.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

  public setInputLocation(setRow: number, setCol: number) {
    // === Calculate Column ===
    let cellLeft = 50;
    for (let i = 0; i < setCol; i++) {
      cellLeft += colData.get(i)?.width ?? 100;
    }


    // === Calculate Row ===
    let cellTop = 30;
    for (let i = 0; i < setRow; i++) {
      cellTop += rowData.get(i)?.height ?? 24;
    }
        // Save previous cell's data before moving
    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(setRow + 1, setCol + 1)) {
        this.inputDiv.value = cellData.get(setRow + 1, setCol + 1) || "";
      }

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

  /**
   * Handles click event to select and focus a cell.
   * Calculates row/col, positions input box, and handles data loading/saving.
   * @param {MouseEvent} e - Mouse click event
   */


  private handleClickEvent(e: MouseEvent) {
    e.preventDefault();
    const scrollLeft = this.scrollDiv.scrollLeft;
    const scrollTop = this.scrollDiv.scrollTop;

    const clientX = e.clientX + scrollLeft - 50; // offset for col label
    const clientY = e.clientY + scrollTop - 25; // offset for row label

    RowData.setSelectedRow(null);
    ColData.setSelectedCol(null);

    // === Calculate Column ===
    let x = 0, col = 0;
    let colWidth: number = 0;
    while (x <= clientX) {
      colWidth = colData.get(col)?.width ?? this.defaultColWidth;
      if (x + colWidth > clientX) break;
      x += colWidth;
      col++;
    }


    // === Calculate Row ===
    let y = 0, row = 0;
    while (y <= clientY) {
      const rowHeight = rowData.get(row)?.height ?? this.defaultRowHeight;
      if (y + rowHeight > clientY) break;
      y += rowHeight;
      row++;
    }

    // Set selected cell
    RowData.setSelectedCellRow(row);
    ColData.setSelectedCellCol(col);

    selectionManager.set(row, col, row, col, true)

    const cellTop = y + 25;   // + row label height
    const cellLeft = x + 50;  // + col label width

    // Save previous cell's data before moving
    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      if (this.inputDiv.value !== "") {
        cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
        this.inputDiv.value = "";
      }

      if (cellData.has(row + 1, col + 1)) {
        this.inputDiv.value = cellData.get(row + 1, col + 1) || "";
      }

      this.prevRow = row;
      this.prevCol = col;
      this.prevTop = cellTop;
      this.prevLeft = cellLeft;
    }

    this.setInputLocation(row, col);

    // Show and position input box
    this.inputDiv.style.display = "block";
    this.inputDiv.style.caretColor = "transparent";


    this.shiftRow = 0;
    this.shiftCol = 0;
    this.inputDiv.focus();
    excelRenderer.render();
  }

  /**
   * Handles key navigation (arrow keys, Enter) inside input box.
   * Updates selected cell, saves data, and repositions input.
   * @param {KeyboardEvent} e - Keydown event
   */
  private handleKeyDown(e: KeyboardEvent) {
    // Save current cell data
    if (this.inputDiv.value !== "") {
      cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
    }



    // === Move selection based on key ===

    if (e.shiftKey && e.key === 'ArrowDown') {
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow + ++this.shiftRow, this.prevCol + this.shiftCol, true)
    } else if (e.shiftKey && e.key === 'ArrowUp') {
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow + --this.shiftRow, this.prevCol + this.shiftCol, true)
    } else if (e.shiftKey && e.key === 'ArrowRight') {
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow + this.shiftRow, this.prevCol + ++this.shiftCol, true)
    } else if (e.shiftKey && e.key === 'ArrowLeft') {
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow + this.shiftRow, this.prevCol + --this.shiftCol, true)
    }

    if (e.key === "Enter" && e.shiftKey) {
      const aboveHeight = rowData.get(this.prevRow - 1)?.height ?? this.defaultRowHeight;
      this.inputDiv.select();
      this.prevTop -= aboveHeight;
      this.prevRow--;
      this.inputDiv.style.caretColor = "transparent";
      this.shiftRow = 0;
      this.shiftCol = 0;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true)
    }
    else if (e.key === "Enter" || e.key === "ArrowDown" && !e.shiftKey) {
      const currHeight = rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
      this.prevTop += currHeight;
      this.prevRow++;
      this.inputDiv.style.caretColor = "transparent";
      this.shiftRow = 0;
      this.shiftCol = 0;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true)
    }
    else if (e.key === "ArrowUp" && this.prevRow > 0 && !e.shiftKey) {
      const aboveHeight = rowData.get(this.prevRow - 1)?.height ?? this.defaultRowHeight;
      this.inputDiv.select();
      this.prevTop -= aboveHeight;
      this.prevRow--;
      this.inputDiv.style.caretColor = "transparent";
      this.shiftRow = 0;
      this.shiftCol = 0;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true)
    }

    else if (e.key === "ArrowRight" && !e.shiftKey) {
      const currWidth = colData.get(this.prevCol)?.width ?? this.defaultColWidth;
      this.prevLeft += currWidth;
      this.prevCol++;
      this.inputDiv.style.caretColor = "transparent";
      this.shiftRow = 0;
      this.shiftCol = 0;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true)
    }

    else if (e.key === "ArrowLeft" && this.prevCol > 0 && !e.shiftKey) {
      const leftWidth = colData.get(this.prevCol - 1)?.width ?? this.defaultColWidth;
      this.inputDiv.select();
      this.prevLeft -= leftWidth;
      this.prevCol--;
      this.inputDiv.style.caretColor = "transparent";
      this.shiftRow = 0;
      this.shiftCol = 0;
      selectionManager.set(this.prevRow, this.prevCol, this.prevRow, this.prevCol, true)
    } else {
      this.inputDiv.style.caretColor = "black";
    }


    let leftWidth = this.prevLeft + (colData.get(this.prevCol)?.width ?? this.defaultColWidth);
    let currSelectedCell = selectionManager.getCellSelection.endCol;
    let leftWidthCellSelected = 50;
    for (let i = 0; i < currSelectedCell; i++) {
      leftWidthCellSelected += colData.get(currSelectedCell)?.width ?? 100;
    }

    if (leftWidth > this.width + this.scrollDiv.scrollLeft
      || leftWidthCellSelected > this.width + this.scrollDiv.scrollLeft
    ) {
      this.scrollDiv.scrollLeft += colData.get(this.prevCol)?.width ?? this.defaultColWidth;
    } else if ((this.prevLeft < this.scrollDiv.scrollLeft
      || leftWidthCellSelected < this.scrollDiv.scrollLeft)
    ) {
      this.scrollDiv.scrollLeft -= colData.get(this.prevCol)?.width ?? this.defaultColWidth;
    }

    let topHeight = this.prevTop + (rowData.get(this.prevRow)?.height ?? this.defaultRowHeight);

    if (topHeight > this.height - 10 + this.scrollDiv.scrollTop) {
      this.scrollDiv.scrollTop += rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
    } else if (this.prevTop < this.scrollDiv.scrollTop + 20) {
      this.scrollDiv.scrollTop -= rowData.get(this.prevRow)?.height ?? this.defaultRowHeight;
    }

    // Load value into input
    const nextVal = cellData.get(this.prevRow + 1, this.prevCol + 1);
    this.inputDiv.value = nextVal ?? "";

      // Reposition input box
      this.inputDiv.style.height = `${(rowData.get(this.prevRow)?.height ?? 18) - 10}px`;
      this.inputDiv.style.width = `${(colData.get(this.prevCol)?.width ?? 100) - 8}px`;
      this.inputDiv.style.top = `${this.prevTop}px`;
      this.inputDiv.style.left = `${this.prevLeft}px`;
      this.inputDiv.focus();

    // Redraw grid to update highlights
    excelRenderer.render();
  }


}