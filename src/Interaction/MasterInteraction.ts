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

        /** Sets the currently active feature handler to null */
        this.currFeature = null;

        /** Collects all feature handlers for event delegation */
        this.totalFeatures.push(
            new RowResizingHandler( rowObj, rowData, excelRenderer ),
            new ColResizingHandler( colObj, colData, excelRenderer ),
            new RowAddingHandler( rowObj, rowData, cellData, excelRenderer),
            new ColAddingHandler( colObj, colData, cellData, excelRenderer ),
            new RowSelectionHandler( currentCellPosition, rowObj, rowData, colData, cellData, excelRenderer ),
            new ColSelectionHandler( currentCellPosition, colObj, rowData, colData, cellData, excelRenderer),
            new CellSelectionHandler( currentCellPosition, gridObj, cellData, excelRenderer ),
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
                this.currFeature.handlePointerDownEvent(e);
                break;
            }
        }
    }

    /**
     * Handles pointer move events and delegates to the active feature handler.
     * @param {MouseEvent} e Mouse event
     */
    private handlePointerMove(e: MouseEvent) {
        if (this.currFeature !== null) {
            this.currFeature.handlePointerMoveEvent(e);
        } else {
            for (const feature of this.totalFeatures) {
                if (feature.getCursor(e)) {
                    break;
                }
            }
        }
    }

    /**
     * Handles pointer up events and notifies the active feature handler.
     * @param {MouseEvent} e Mouse event
     */
    private handlePointerUp(e: MouseEvent) {
        if (this.currFeature === null) return;
        this.currFeature.handlePointerUpEvent(e);
        this.currFeature = null;
    }

}
