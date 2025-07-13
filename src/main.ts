import { RowLabelCanvas } from "./Elements/RowLabelCanvas.js";
import { InputManager } from "./Core/InputManager.js";
import { AutoScroller } from "./Elements/AutoScroller.js";
import { LoadDataManager } from "./Utils/LoadData.js";
import CommandManager from "./Core/CommandManager.js";
import { Calculations } from "./Elements/Calculations.js";
import { ColumnLabelCanvas } from "./Elements/ColumnLabelCanvas.js";
import { ExcelRenderer } from "./Core/ExcelRenderer.js";
import { CurrentCellPosition } from "./Elements/CurrentCellPosition.js";
import { GridCanvas } from "./Core/GridCanvas.js";
import { RowData } from "./DataStructures/RowData.js";
import { ColData } from "./DataStructures/ColData.js";
import { CellData } from "./DataStructures/CellData.js";
import { MasterInteraction } from "./Interaction/MasterInteraction.js";


/**
 * Entry point for the Excel-like spreadsheet application.
 * Initializes all components and renders the UI.
 */
class ExcelApp {
    /**@type {HTMLElement} Main scrollable container */
    private scrollable: HTMLElement;

    /**@type {HTMLElement} Fake content to enable scrolling */
    private fakeContent: HTMLElement;

    /**@type {HTMLInputElement} Input field for cell editing */
    private input: HTMLInputElement;

    /**@type {HTMLElement} Wrapper for the entire grid layout */
    private wrapper: HTMLElement;

    /**@type {HTMLElement} Top-left corner cell between row/column labels */
    private leftCorner: HTMLElement;

    /**@type {HTMLElement} Wrapper for row labels */
    private rowLabelWrapper: HTMLElement;

    /**@type {HTMLElement} Wrapper for column labels */
    private colLabelWrapper: HTMLElement;

    /**@type {HTMLElement} Wrapper for main grid canvas */
    private mainCanvasWrapper: HTMLElement;

    /**@type {RowLabelCanvas} Renders the row headers */
    private rowObj: RowLabelCanvas;

    /**@type {ColumnLabelCanvas} Renders the column headers */
    private colObj: ColumnLabelCanvas;

    /**@type {GridCanvas} Main grid canvas for cells */
    private gridObj: GridCanvas;

    /**@type {InputManager} Handles input box and keyboard/mouse interactions */
    private inputManager: InputManager;

    /**@type {ExcelRenderer} Coordinates rendering for all canvas layers */
    private excelRenderer: ExcelRenderer;

    /**@type {CurrentCellPosition} Utility to calculate active cell position */
    private currentCellPosition: CurrentCellPosition;

    /**@type {CommandManager} Manages undo/redo and command history */
    private commandManager: CommandManager;

    /**@type {RowData} Stores dynamic row info like height, selection */
    private rowData: RowData;

    /**@type {ColData} Stores dynamic column info like width, selection */
    private colData: ColData;

    /**@type {CellData} Stores cell content as key-value pairs */
    private cellData: CellData;

    /**
     * Initializes the Excel application.
     * Creates DOM elements, data structures, and logic handlers.
     */
    constructor() {
        // Create and style base DOM structure
        this.scrollable = document.createElement("div");
        this.scrollable.className = "scrollable";

        this.fakeContent = document.createElement("div");
        this.fakeContent.id = "fakeContent";

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.name = "input";
        this.input.className = "input-selection";
        this.input.autofocus = true;

        this.wrapper = document.createElement("div");
        this.wrapper.className = "wrapper";

        this.leftCorner = document.createElement("div");
        this.leftCorner.className = "left-corner";

        this.rowLabelWrapper = document.createElement("div");
        this.rowLabelWrapper.className = "row-label-wrapper";

        this.colLabelWrapper = document.createElement("div");
        this.colLabelWrapper.className = "col-label-wrapper";

        this.mainCanvasWrapper = document.createElement("div");
        this.mainCanvasWrapper.className = "main-canvas-wrapper";

        // Structure DOM hierarchy
        this.wrapper.appendChild(this.leftCorner);
        this.wrapper.appendChild(this.rowLabelWrapper);
        this.wrapper.appendChild(this.colLabelWrapper);
        this.wrapper.appendChild(this.mainCanvasWrapper);

        this.scrollable.appendChild(this.fakeContent);
        this.scrollable.appendChild(this.input);
        this.scrollable.appendChild(this.wrapper);

        // Append to document body
        document.body.appendChild(this.scrollable);

        // Initialize core data structures
        this.rowData = new RowData();
        this.colData = new ColData();
        this.cellData = new CellData();

        this.currentCellPosition = new CurrentCellPosition(this.rowData, this.colData);

        // Initialize canvas elements
        this.rowObj = new RowLabelCanvas(this.rowData, this.colData, this.cellData);
        this.colObj = new ColumnLabelCanvas(this.rowData, this.colData, this.cellData);
        this.gridObj = new GridCanvas(this.rowData, this.colData, this.cellData);

        // Initialize renderer and command system
        this.excelRenderer = new ExcelRenderer(this.rowObj, this.colObj, this.gridObj, this.rowData, this.colData);
        this.commandManager = new CommandManager(this.rowData, this.colData, this.cellData, this.excelRenderer);

        // Handle input and keyboard logic
        this.inputManager = new InputManager(
            this.currentCellPosition,
            this.commandManager,
            this.rowData,
            this.colData,
            this.cellData,
            this.excelRenderer
        );

        // Utility components
        new Calculations(this.rowData, this.colData, this.cellData);
        new LoadDataManager(this.excelRenderer, this.cellData);
        new AutoScroller(this.rowData, this.colData, this.cellData);
        new MasterInteraction(this.rowObj, this.colObj, this.gridObj, this.currentCellPosition, this.rowData, this.colData, this.cellData, this.excelRenderer);
    }
}

// Bootstrap the app
new ExcelApp();
