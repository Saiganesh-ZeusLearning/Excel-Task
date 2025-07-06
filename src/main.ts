import { InputManager } from "./Interaction/InputManager.js";
import { AutoScroller } from "./Interaction/AutoScroller.js";
import { LoadDataManager } from "./Utils/LoadData.js";

new LoadDataManager();
new AutoScroller();
export const inputManager = new InputManager();

