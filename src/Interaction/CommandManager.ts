import { ExcelRenderer } from "../Core/ExcelRenderer.js";
import { cellData } from "../DataStructures/CellData.js";
import { colData } from "../DataStructures/ColData.js";
import { rowData } from "../DataStructures/RowData.js";

type Command = {
    undo: () => void;
    redo: () => void;
};

export default class CommandManager {

    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private excelRenderer: ExcelRenderer;


    constructor(excelRenderer: ExcelRenderer) {
        this.excelRenderer = excelRenderer;
        this.attachEventlistners();
    }

    private attachEventlistners() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private handleKeyDown(e: KeyboardEvent) {
        // Ctrl+Z or Cmd+Z → Undo
        if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
            e.preventDefault();
            this.undo();
        }
        // Ctrl+Shift+Z or Cmd+Shift+Z → Redo
        else if (e.ctrlKey && e.key.toLowerCase() === "z" && e.shiftKey) {
            e.preventDefault();
            this.redo();
        }
        // Ctrl+Y → Redo (Windows fallback)
        else if (e.ctrlKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            this.redo();
        }
    }

    pushCellEditCommand(newValue: any, oldValue: any, row: number, col: number): void {
        const command: Command = {
            undo: () => {
                cellData.set(row, col, oldValue);
            },
            redo: () => {
                cellData.set(row, col, newValue);
            }
        };
        this.undoStack.push(command);
    }
    pushRowResizeCommand(newValue: any, oldValue: any, row: number): void {
        const command: Command = {
            undo: () => {
                rowData.set(row, oldValue);
            },
            redo: () => {
                rowData.set(row, newValue);
            }
        };
        this.undoStack.push(command);
    }

    pushColResizeCommand(newValue: any, oldValue: any, col: number): void {
        const command: Command = {
            undo: () => {
                colData.set(col, oldValue);
            },
            redo: () => {
                colData.set(col, newValue);
            }
        };
        this.undoStack.push(command);
    }


    undo(): void {
        if (this.undoStack.length === 0) return;
        const command = this.undoStack.pop()!;
        command.undo();
        this.redoStack.push(command);
        this.excelRenderer.render();
    }

    redo(): void {
        if (this.redoStack.length === 0) return;
        const command = this.redoStack.pop()!;
        command.redo();
        this.undoStack.push(command);
        this.excelRenderer.render();
    }
}

