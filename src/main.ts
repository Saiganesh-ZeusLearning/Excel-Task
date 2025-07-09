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
export const rowData = new RowData();
export const colData = new ColData();
export const cellData = new CellData();


const rowObj = new RowLabelCanvas(selectionManager);

const colObj = new ColumnLabelCanvas(selectionManager);

const gridObj = new GridCanvas(selectionManager);

const inputManager = new InputManager(selectionManager);

const excelRenderer = new ExcelRenderer(rowObj, colObj, gridObj);

export const commandManager = new CommandManager();

rowObj.intializeRender(inputManager);
colObj.intializeRender(inputManager);

const calculationsObj = new Calculations(selectionManager);
new LoadDataManager(excelRenderer);
new AutoScroller();



const masterInteraction = new MasterInteraction(rowObj, colObj, gridObj);



document.addEventListener("mousedown", () => {
    excelRenderer.render();
})

window.addEventListener("pointermove", () => {
    if(selectionManager.getCellSelection.selectionState || selectionManager.RowSelection.isRowResizing || selectionManager.ColSelection.isColResizing){
        excelRenderer.render();              
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
        excelRenderer.render();
});