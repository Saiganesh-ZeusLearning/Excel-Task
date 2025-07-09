import { ExcelRenderer } from "./ExcelRenderer.js";
import { cellData, colData, rowData } from "../main.js";

type Command = {
    undo: () => void;
    redo: () => void;
};

export default class CommandManager {

    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

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
    }

    redo(): void {
        if (this.redoStack.length === 0) return;
        const command = this.redoStack.pop()!;
        command.redo();
        this.undoStack.push(command);
    }
}

