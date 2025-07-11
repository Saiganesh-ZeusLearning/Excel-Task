import { RowLabelCanvas } from "./Elements/RowLabelCanvas.js";
import { InputManager } from "./Core/InputManager.js";
import { AutoScroller } from "./Elements/AutoScroller.js";
import { LoadDataManager } from "./Utils/LoadData.js";
import CommandManager from "./Core/CommandManager.js";
import { Calculations } from "./Elements/Calculations.js";
import { ColumnLabelCanvas } from "./Elements/ColumnLabelCanvas.js";
import { ExcelRenderer } from "./Core/ExcelRenderer.js";
import { SelectionManager } from "./Core/SelectionManager.js";
import { GridCanvas } from "./Core/GridCanvas.js";
import { RowData } from "./DataStructures/RowData.js";
import { ColData } from "./DataStructures/ColData.js";
import { CellData } from "./DataStructures/CellData.js";
import { MasterInteraction } from "./Interaction/MasterInteraction.js";

const selectionManager = new SelectionManager();
const commandManager = new CommandManager();

export const rowData = new RowData();
export const colData = new ColData();
export const cellData = new CellData();



class ExcelApp {
    private rowObj: RowLabelCanvas;
    private colObj: ColumnLabelCanvas;
    private gridObj: GridCanvas;
    private inputManager: InputManager;
    private excelRenderer: ExcelRenderer;

    constructor() {
        this.rowObj = new RowLabelCanvas(selectionManager, commandManager);
        this.colObj = new ColumnLabelCanvas(selectionManager, commandManager);
        this.gridObj = new GridCanvas(selectionManager);

        this.inputManager = new InputManager(selectionManager, commandManager);
        this.excelRenderer = new ExcelRenderer(this.rowObj, this.colObj, this.gridObj);

        this.rowObj.intializeRender(this.inputManager);
        this.colObj.intializeRender(this.inputManager);

        new Calculations(selectionManager);
        new LoadDataManager(this.excelRenderer);
        new AutoScroller();


        new MasterInteraction(this.rowObj, this.colObj, this.gridObj, selectionManager);
        document.addEventListener("mousedown", () => {
            this.excelRenderer.render();
        })

        window.addEventListener("pointermove", () => {
            if (selectionManager.getCellSelection.selectionState || selectionManager.RowSelection.isRowResizing || selectionManager.ColSelection.isColResizing || selectionManager.RowSelection.selectionState) {
                this.excelRenderer.render();
            }
        })

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            // Ctrl+Z or Cmd+Z → Undo
            if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
                e.preventDefault();
                commandManager.undo();
            }
            // Ctrl+Shift+Z or Cmd+Shift+Z → Redo
            else if (e.ctrlKey && e.key.toLowerCase() === "z" && e.shiftKey) {
                e.preventDefault();
                commandManager.redo();
            }
            // Ctrl+Y → Redo (Windows fallback)
            else if (e.ctrlKey && e.key.toLowerCase() === "y") {
                e.preventDefault();
                commandManager.redo();
            }
            this.excelRenderer.render();
        });
    }

}

new ExcelApp;