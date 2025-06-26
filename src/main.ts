import { renderExcel } from "./Core/CanvasRenderer.js";
import { InputSelection } from "./Elements/InputSelection.js";
import { cellData } from "./DataStructures/CellData.js";

renderExcel();
InputSelection();

const inputDiv = document.querySelector(".input-selection") as HTMLInputElement;

// cellData["6_5"] = "hey";
// console.log(cellData["6_5"]);
