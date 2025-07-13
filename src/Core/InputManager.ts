import { CellData } from "../DataStructures/CellData.js";
import { ColData } from "../DataStructures/ColData.js";
import { CurrentCellPosition } from "../Elements/CurrentCellPosition.js";
import { RowData } from "../DataStructures/RowData.js";
import { cellHeight, cellWidth, ColLabel, ExcelLeftOffset, ExcelTopOffset } from "../Utils/GlobalVariables.js";
import CommandManager from "./CommandManager.js";
import { ExcelRenderer } from "./ExcelRenderer.js";

/**
 * Manages input editing within the grid cells.
 * Handles click-based selection and keyboard navigation.
 */
export class InputManager {
  /** @type {HTMLInputElement} Input box for entering cell values */
  private inputDiv: HTMLInputElement;

  /** @type {HTMLInputElement} Navigation input box showing current cell address */
  private navRowCol: HTMLInputElement;

  /** @type {HTMLElement} Wrapper for scrollable content */
  private scrollDiv: HTMLElement;

  /** @type {HTMLElement} Canvas element where cell clicks are detected */
  private mainCanvas: HTMLElement;

  /** @type {CurrentCellPosition} Position calculator for mouse clicks to cell coordinates */
  private currentCellPosition: CurrentCellPosition;

  /** @type {CommandManager} Undo/redo command stack manager */
  private commandManager: CommandManager;

  /** @type {number} Last known top offset of selected cell */
  private prevTop: number = 0;

  /** @type {number} Last known left offset of selected cell */
  private prevLeft: number = 0;

  /** @type {number} Previously selected row */
  private prevRow: number = 0;

  /** @type {number} Previously selected column */
  private prevCol: number = 0;

  /** @type {RowData} Row metadata (height, selection) */
  private rowData: RowData;

  /** @type {ColData} Column metadata (width, selection) */
  private colData: ColData;

  /** @type {CellData} Cell content data */
  private cellData: CellData;

  /** @type {number} Current screen width */
  private width: number;

  /** @type {number} Current screen height */
  private height: number;

  /** @type {number} Shift row count for shift+arrow selection */
  private shiftRow: number;

  /** @type {number} Shift column count for shift+arrow selection */
  private shiftCol: number;

  /** @type {ExcelRenderer} Grid renderer */
  private excelRenderer: ExcelRenderer;

  /**
   * Initializes listeners, input controls, and dependencies.
   * @param {CurrentCellPosition} currentCellPosition Utility for cell position calculation
   * @param {CommandManager} commandManager Undo/redo command manager
   * @param {RowData} rowData Row data model
   * @param {ColData} colData Column data model
   * @param {CellData} cellData Cell data model
   * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
   */
  constructor(
    currentCellPosition: CurrentCellPosition,
    commandManager: CommandManager,
    rowData: RowData,
    colData: ColData,
    cellData: CellData,
    excelRenderer: ExcelRenderer
  ) {
    /** Store row, column, and cell data models */
    this.rowData = rowData;
    this.colData = colData;
    this.cellData = cellData;

    /** Store renderer */
    this.excelRenderer = excelRenderer;

    /** Get DOM elements for interaction */
    this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    this.mainCanvas = document.querySelector(".main-canvas") as HTMLElement;
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;
    this.navRowCol = document.querySelector(".nav-row-col") as HTMLInputElement;

    /** Store utilities */
    this.currentCellPosition = currentCellPosition;
    this.commandManager = commandManager;

    /** Store viewport size */
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    /** Initialize shift selection state */
    this.shiftRow = 0;
    this.shiftCol = 0;

    /** Attach event listeners */
    this.attachListeners();
  }

  /**
   * Adds mouse and keyboard listeners to input and canvas.
   */
  private attachListeners() {
    this.mainCanvas.addEventListener("mousedown", this.handleClickEvent.bind(this));
    this.inputDiv.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }

  /**
   * Adjusts input box position to align with a cell.
   * @param {number} setRow The row index to position the input box
   * @param {number} setCol The column index to position the input box
   */
  public setInputLocation(setRow: number, setCol: number) {
    let cellLeft = 50;
    for (let i = 0; i < setCol; i++) {
      cellLeft += this.colData.get(i)?.width ?? cellWidth;
    }

    let cellTop = 30;
    for (let i = 0; i < setRow; i++) {
      cellTop += this.rowData.get(i)?.height ?? cellHeight;
    }

    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      this.saveCurrentCellValue();
      this.inputDiv.value = this.cellData.get(setRow + 1, setCol + 1) ?? "";
      this.navRowCol.value = (ColLabel(setCol + 1) + (setRow + 1).toString()).toString();

      this.prevRow = setRow;
      this.prevCol = setCol;
      this.prevTop = cellTop;
      this.prevLeft = cellLeft;
    }

    this.inputDiv.style.height = `${(this.rowData.get(setRow)?.height ?? cellHeight) - 14}px`;
    this.inputDiv.style.width = `${(this.colData.get(setCol)?.width ?? cellWidth) - 12}px`;
    this.inputDiv.style.top = `${cellTop}px`;
    this.inputDiv.style.left = `${cellLeft + 3}px`;
    this.inputDiv.focus();
  }

  /**
   * Handles mouse click inside canvas and selects the clicked cell.
   * @param {MouseEvent} e Mouse event
   */
  private handleClickEvent(e: MouseEvent) {
    e.preventDefault();

    // Clear any active column or row selections
    this.colData.ColSelection = { ...this.colData.ColSelection, selectionState: false };
    this.rowData.RowSelection = { ...this.rowData.RowSelection, selectionState: false };

    // Get the clicked cell position
    const { row, col, x, y } = this.currentCellPosition.get(e);

    // Set cell selection
    this.cellData.setCellSelection = {
      startRow: row,
      endRow: row,
      startCol: col,
      endCol: col,
      selectionState: true
    };

    // Calculate cell position for input box
    const cellTop = y + ExcelTopOffset;
    const cellLeft = x + ExcelLeftOffset;

    if (this.prevTop !== cellTop || this.prevLeft !== cellLeft) {
      this.saveCurrentCellValue();
      this.inputDiv.value = this.cellData.get(row + 1, col + 1) ?? "";

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

    this.excelRenderer.render();
  }

  /**
   * Handles keyboard navigation and input inside the active cell.
   * @param {KeyboardEvent} e Keyboard event
   */
  private handleKeyDown(e: KeyboardEvent) {
    if (e.shiftKey) {
      // Handle shift+arrow for selection range
      switch (e.key) {
        case 'ArrowDown':
          this.shiftRow++;
          break;
        case 'ArrowUp':
          this.shiftRow--;
          break;
        case 'ArrowRight':
          this.shiftCol++;
          break;
        case 'ArrowLeft':
          this.shiftCol--;
          break;
      }

      this.cellData.setCellSelection = {
        startRow: this.prevRow,
        endRow: this.prevRow + this.shiftRow,
        startCol: this.prevCol,
        endCol: this.prevCol + this.shiftCol,
        selectionState: true
      };
      this.saveCurrentCellValue();
      return;
    }

    // Handle normal navigation and editing
    switch (e.key) {
      case 'Enter':
        if (e.shiftKey && this.prevRow > 0) {
          const above = this.rowData.get(this.prevRow - 1)?.height ?? cellHeight;
          this.saveCurrentCellValue();
          this.prevTop -= above;
          this.prevRow--;
        } else {
          const curr = this.rowData.get(this.prevRow)?.height ?? cellHeight;
          this.navRowCol.value = ColLabel(this.prevCol + 1) + (this.prevRow + 2);
          this.saveCurrentCellValue();
          this.prevTop += curr;
          this.prevRow++;
        }
        break;

      case 'ArrowDown':
        const down = this.rowData.get(this.prevRow)?.height ?? cellHeight;
        this.navRowCol.value = ColLabel(this.prevCol + 1) + (this.prevRow + 2);
        this.saveCurrentCellValue();
        this.prevTop += down;
        this.prevRow++;
        break;

      case 'ArrowUp':
        if (this.prevRow > 0) {
          const up = this.rowData.get(this.prevRow - 1)?.height ?? cellHeight;
          this.saveCurrentCellValue();
          this.navRowCol.value = ColLabel(this.prevCol + 1) + (this.prevRow);
          this.prevTop -= up;
          this.prevRow--;
        }
        break;

      case 'ArrowRight':
        const right = this.colData.get(this.prevCol)?.width ?? cellWidth;
        this.saveCurrentCellValue();
        this.navRowCol.value = ColLabel(this.prevCol + 2) + (this.prevRow + 1);
        this.prevLeft += right;
        this.prevCol++;
        break;

      case 'ArrowLeft':
        if (this.prevCol > 0) {
          const left = this.colData.get(this.prevCol - 1)?.width ?? cellWidth;
          this.saveCurrentCellValue();
          this.prevLeft -= left;
          this.prevCol--;
        }
        break;

      default:
        this.inputDiv.style.caretColor = "black";
        return;
    }

    this.resetShift();
    this.inputDiv.style.caretColor = "transparent";

    this.rowData.RowSelection = { ...this.rowData.RowSelection, selectionState: false };
    this.colData.ColSelection = { ...this.colData.ColSelection, selectionState: false };
    this.cellData.setCellSelection = {
      startRow: this.prevRow,
      endRow: this.prevRow,
      startCol: this.prevCol,
      endCol: this.prevCol,
      selectionState: true
    };

    this.updateScrollIfNeeded();
    this.updateInputBoxPosition();
    this.excelRenderer.render();
  }

  /**
   * Saves the current value in the input box to the cell data model.
   */
  private saveCurrentCellValue() {
    if (this.inputDiv.value !== "") {
      this.commandManager.pushCellEditCommand(
        this.inputDiv.value,
        this.cellData.get(this.prevRow + 1, this.prevCol + 1) ?? "",
        this.prevRow + 1,
        this.prevCol + 1
      );
      this.cellData.set(this.prevRow + 1, this.prevCol + 1, this.inputDiv.value);
    }
  }

  /**
   * Updates the position and size of the input box to match the selected cell.
   */
  private updateInputBoxPosition() {
    this.inputDiv.style.height = `${(this.rowData.get(this.prevRow)?.height ?? 18) - 10}px`;
    this.inputDiv.style.width = `${(this.colData.get(this.prevCol)?.width ?? 100) - 12}px`;
    this.inputDiv.style.top = `${this.prevTop}px`;
    this.inputDiv.style.left = `${this.prevLeft + 3}px`;
    this.inputDiv.focus();

    const nextVal = this.cellData.get(this.prevRow + 1, this.prevCol + 1);
    this.inputDiv.value = nextVal ?? "";
  }

  /**
   * Scrolls the grid if the selected cell is out of view.
   */
  private updateScrollIfNeeded() {
    let rightEdge = this.prevLeft + (this.colData.get(this.prevCol)?.width ?? cellWidth);
    let bottomEdge = this.prevTop + (this.rowData.get(this.prevRow)?.height ?? cellHeight);

    if (rightEdge > this.width + this.scrollDiv.scrollLeft) {
      this.scrollDiv.scrollLeft += this.colData.get(this.prevCol)?.width ?? cellWidth;
    } else if (this.prevLeft < this.scrollDiv.scrollLeft) {
      this.scrollDiv.scrollLeft -= this.colData.get(this.prevCol)?.width ?? cellWidth;
    }

    if (bottomEdge > this.height - 60 + this.scrollDiv.scrollTop) {
      this.scrollDiv.scrollTop += this.rowData.get(this.prevRow)?.height ?? cellHeight;
    } else if (this.prevTop < this.scrollDiv.scrollTop + 20) {
      this.scrollDiv.scrollTop -= this.rowData.get(this.prevRow)?.height ?? cellHeight;
    }
  }

  /**
   * Resets the shift selection state for shift+arrow navigation.
   */
  private resetShift() {
    this.shiftRow = 0;
    this.shiftCol = 0;
  }
}
