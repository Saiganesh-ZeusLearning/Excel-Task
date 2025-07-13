import { GridCanvas } from "../Core/GridCanvas.js";
import { CellData } from "../DataStructures/CellData.js";
import { ColData } from "../DataStructures/ColData.js";
import { RowData } from "../DataStructures/RowData.js";
import { ColumnLabelCanvas } from "../Elements/ColumnLabelCanvas.js";
import { RowLabelCanvas } from "../Elements/RowLabelCanvas.js";
import { ColAddingHandler } from "./ColInteraction/ColAddingHandler.js";
import { ColResizingHandler } from "./ColInteraction/ColResizingHandler.js";
import { ColSelectionHandler } from "./ColInteraction/ColSelectionHandler.js";
import { RowAddingHandler } from "./RowInteraction/RowAddingHandler.js";
import { RowResizingHandler } from "./RowInteraction/RowResizingHandler.js";
import { RowSelectionHandler } from "./RowInteraction/RowSelectionHandler.js";
import { CellSelectionHandler } from "./GridInteraction/CellSelectionHandler.js";
import { CurrentCellPosition } from "../Elements/CurrentCellPosition.js";
import { ExcelRenderer } from "../Core/ExcelRenderer.js";

/**
 * MasterInteraction manages all user interaction handlers for the grid.
 * It delegates pointer events to the appropriate feature handler.
 */
export class MasterInteraction {

    /** @type {RowSelectionHandler} Handles row selection interactions */
    private rowSelectionHandler: RowSelectionHandler;

    /** @type {RowResizingHandler} Handles row resizing interactions */
    private rowResizingHandler: RowResizingHandler;

    /** @type {RowAddingHandler} Handles adding new rows */
    private rowAddingHandler: RowAddingHandler;

    /** @type {ColSelectionHandler} Handles column selection interactions */
    private colSelectionHandler: ColSelectionHandler;

    /** @type {ColResizingHandler} Handles column resizing interactions */
    private colResizingHandler: ColResizingHandler;

    /** @type {ColAddingHandler} Handles adding new columns */
    private colAddingHandler: ColAddingHandler;

    /** @type {CellSelectionHandler} Handles cell selection interactions */
    private cellSelectionHandler: CellSelectionHandler;

    /** @type {any} Stores the currently active feature handler */
    private currFeature: any;

    /** @type {any[]} Stores all feature handlers for event delegation */
    private totalFeatures: any[] = [];

    /**
     * Initializes the MasterInteraction and all feature handlers.
     * @param {RowLabelCanvas} rowObj Row label canvas instance
     * @param {ColumnLabelCanvas} colObj Column label canvas instance
     * @param {GridCanvas} gridObj Main grid canvas instance
     * @param {CurrentCellPosition} currentCellPosition Utility for cell position calculation
     * @param {RowData} rowData Row data model
     * @param {ColData} colData Column data model
     * @param {CellData} cellData Cell data model
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     */
    constructor(
        rowObj: RowLabelCanvas,
        colObj: ColumnLabelCanvas,
        gridObj: GridCanvas,
        currentCellPosition: CurrentCellPosition,
        rowData: RowData,
        colData: ColData,
        cellData: CellData,
        excelRenderer: ExcelRenderer,
    ) {
        /** Initializes row selection handler */
        this.rowSelectionHandler = new RowSelectionHandler(
            currentCellPosition,
            rowObj,
            rowData,
            colData,
            cellData,
            excelRenderer,
        );

        /** Initializes row resizing handler */
        this.rowResizingHandler = new RowResizingHandler(
            rowObj,
            rowData,
            excelRenderer,
        );

        /** Initializes row adding handler */
        this.rowAddingHandler = new RowAddingHandler(
            rowObj,
            rowData,
            cellData,
            excelRenderer
        );

        /** Initializes column selection handler */
        this.colSelectionHandler = new ColSelectionHandler(
            currentCellPosition,
            colObj,
            rowData,
            colData,
            cellData,
            excelRenderer,
        );

        /** Initializes column resizing handler */
        this.colResizingHandler = new ColResizingHandler(
            colObj,
            colData,
            excelRenderer,
        );

        /** Initializes column adding handler */
        this.colAddingHandler = new ColAddingHandler(
            colObj,
            rowData,
            colData,
            cellData,
            excelRenderer,
        );

        /** Initializes cell selection handler */
        this.cellSelectionHandler = new CellSelectionHandler(
            currentCellPosition,
            gridObj,
            cellData,
            excelRenderer,
        );

        /** Sets the currently active feature handler to null */
        this.currFeature = null;

        /** Collects all feature handlers for event delegation */
        this.totalFeatures.push(
            this.rowSelectionHandler,
            this.rowResizingHandler,
            this.rowAddingHandler,
            this.colSelectionHandler,
            this.colResizingHandler,
            this.colAddingHandler,
            this.cellSelectionHandler
        );

        /** Attaches global pointer event listeners */
        this.attachEventListeners();
    }

    /**
     * Attaches pointer event listeners to the window.
     */
    private attachEventListeners() {
        window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
        window.addEventListener("pointermove", this.handlePointerMove.bind(this));
        window.addEventListener("pointerup", this.handlePointerUp.bind(this));
    }

    /**
     * Handles pointer down events and sets the active feature handler.
     * @param {MouseEvent} e Mouse event
     */
    private handlePointerDown(e: MouseEvent) {
        for (const feature of this.totalFeatures) {
            if (feature.hitTest(e)) {
                this.currFeature = feature;
                break;
            }
        }
    }

    /**
     * Handles pointer move events and delegates to the active feature handler.
     * @param {MouseEvent} e Mouse event
     */
    private handlePointerMove(e: MouseEvent) {
        if (this.currFeature === null) return;
        this.currFeature.handlePointerMoveEvent(e);
    }

    /**
     * Handles pointer up events and notifies the active feature handler.
     * @param {MouseEvent} e Mouse event
     */
    private handlePointerUp(e: MouseEvent) {
        if (this.currFeature === null) return;
        this.currFeature.handlePointerUpEvent(e);
    }

}
