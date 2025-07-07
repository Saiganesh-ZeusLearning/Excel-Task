import { InputManager } from "./Interaction/InputManager.js";
import { AutoScroller } from "./Interaction/AutoScroller.js";
import { LoadDataManager } from "./Utils/LoadData.js";
import CommandManager from "./Interaction/CommandManager.js";
import { Calculations } from "./Interaction/Calculations.js";

new LoadDataManager();
new AutoScroller();
export const inputManager = new InputManager();

const calculationsObj = new Calculations();
export const commandManager = new CommandManager();
