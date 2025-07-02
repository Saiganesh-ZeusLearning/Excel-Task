import { InputManager } from "./Interaction/InputManager.js";
import { ExcelRenderer } from "./Core/ExcelRenderer.js";
import { AutoScroller } from "./Interaction/AutoScroller.js";

const requestAnimationFrame = new AutoScroller();
export const inputManager = new InputManager();
export const excelRenderer = new ExcelRenderer();