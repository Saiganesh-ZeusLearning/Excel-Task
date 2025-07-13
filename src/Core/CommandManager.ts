import { ExcelRenderer } from "./ExcelRenderer.js";
import { RowData } from "../DataStructures/RowData.js";
import { ColData } from "../DataStructures/ColData.js";
import { CellData } from "../DataStructures/CellData.js";

/**
 * Type representing an undoable/redoable command.
 */
type Command = {
  /** Action to undo the command */
  undo: () => void;
  /** Action to redo the command */
  redo: () => void;
};

/**
 * Class to manage undo/redo commands for cell edits, row/column resizes.
 */
export default class CommandManager {
  /** @type {RowData} Reference to row data object */
  private rowData: RowData;

  /** @type {ColData} Reference to column data object */
  private colData: ColData;

  /** @type {CellData} Reference to cell data object */
  private cellData: CellData;

  /** @type {ExcelRenderer} Renderer used to trigger re-rendering after command */
  private excelRenderer: ExcelRenderer;

  /** @type {Command[]} Stack storing undo commands */
  private undoStack: Command[] = [];

  /** @type {Command[]} Stack storing redo commands */
  private redoStack: Command[] = [];

  /**
   * Initializes the CommandManager with necessary data and renderer references.
   * @param {RowData} rowData - Row data manager.
   * @param {ColData} colData - Column data manager.
   * @param {CellData} cellData - Cell data manager.
   * @param {ExcelRenderer} excelRenderer - Renderer to reflect command changes.
   */
  constructor(
    rowData: RowData,
    colData: ColData,
    cellData: CellData,
    excelRenderer: ExcelRenderer,
  ) {
    this.rowData = rowData;
    this.colData = colData;
    this.cellData = cellData;
    this.excelRenderer = excelRenderer;
  }

  /**
   * Attaches keyboard listeners for undo/redo commands (Ctrl+Z, Ctrl+Y).
   */
  attachEventListeners() {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if (e.ctrlKey && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        this.redo();
      } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
      }
      this.excelRenderer.render();
    });
  }

  /**
   * Adds a new cell edit command to the undo stack.
   * @param {any} newValue - New value after edit.
   * @param {any} oldValue - Previous value before edit.
   * @param {number} row - Row index of cell.
   * @param {number} col - Column index of cell.
   */
  pushCellEditCommand(newValue: any, oldValue: any, row: number, col: number): void {
    const command: Command = {
      undo: () => {
        this.cellData.set(row, col, oldValue);
      },
      redo: () => {
        this.cellData.set(row, col, newValue);
      }
    };
    this.undoStack.push(command);
  }

  /**
   * Adds a new row resize command to the undo stack.
   * @param {any} newValue - New height value.
   * @param {any} oldValue - Previous height value.
   * @param {number} row - Row index.
   */
  pushRowResizeCommand(newValue: any, oldValue: any, row: number): void {
    const command: Command = {
      undo: () => {
        this.rowData.set(row, oldValue);
      },
      redo: () => {
        this.rowData.set(row, newValue);
      }
    };
    this.undoStack.push(command);
  }

  /**
   * Adds a new column resize command to the undo stack.
   * @param {any} newValue - New width value.
   * @param {any} oldValue - Previous width value.
   * @param {number} col - Column index.
   */
  pushColResizeCommand(newValue: any, oldValue: any, col: number): void {
    const command: Command = {
      undo: () => {
        this.colData.set(col, oldValue);
      },
      redo: () => {
        this.colData.set(col, newValue);
      }
    };
    this.undoStack.push(command);
  }

  /**
   * Performs the last undo operation.
   */
  undo(): void {
    if (this.undoStack.length === 0) return;
    const command = this.undoStack.pop()!;
    command.undo();
    this.redoStack.push(command);
  }

  /**
   * Performs the last redo operation.
   */
  redo(): void {
    if (this.redoStack.length === 0) return;
    const command = this.redoStack.pop()!;
    command.redo();
    this.undoStack.push(command);
  }
}
