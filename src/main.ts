import { RowLabelCanvas } from "./Elements/RowLabelCanvas.js";
import { InputManager } from "./Interaction/InputManager.js";
import { AutoScroller } from "./Interaction/AutoScroller.js";
import { LoadDataManager } from "./Utils/LoadData.js";
import CommandManager from "./Interaction/CommandManager.js";
import { Calculations } from "./Interaction/Calculations.js";
import { ColumnLabelCanvas } from "./Elements/ColumnLabelCanvas.js";
import { ExcelRenderer } from "./Core/ExcelRenderer.js";
import { SelectionManager } from "./Interaction/SelectionManager.js";
import { GridCanvas } from "./Core/GridCanvas.js";

const selectionManager = new SelectionManager();

const rowObj = new RowLabelCanvas(selectionManager);

const colObj = new ColumnLabelCanvas(selectionManager);

const gridObj = new GridCanvas(selectionManager);


const excelRenderer = new ExcelRenderer(rowObj, colObj, gridObj);
const inputManager = new InputManager(excelRenderer, selectionManager);



export const commandManager = new CommandManager(excelRenderer);

rowObj.intializeRender(inputManager);
colObj.intializeRender(inputManager);

excelRenderer.render();

window.addEventListener("pointermove", () => {
    if(selectionManager.getCellSelection.selectionState){
        excelRenderer.render();
    }
})

new LoadDataManager(excelRenderer);
new AutoScroller();

const calculationsObj = new Calculations(selectionManager);
