import { ExcelRenderer } from "../Core/ExcelRenderer.js";
import { CellData } from "../DataStructures/CellData.js";

/**
 * Manages loading data from a file input and populating the grid's cell data.
 */
export class LoadDataManager {

    /** @type {HTMLInputElement} Reference to the file input element */
    private fileInput: HTMLInputElement;

    /** @type {ExcelRenderer} Used to trigger re-rendering after loading data */
    private excelRenderer: ExcelRenderer;

    /** @type {CellData} Cell data model for populating cell values */
    private cellData: CellData;

    /**
     * Initializes the LoadDataManager.
     * @param {ExcelRenderer} excelRenderer Responsible for rendering updates
     * @param {CellData} cellData Cell data model
     */
    constructor(excelRenderer: ExcelRenderer, cellData: CellData) {
        /** Stores the cell data model */
        this.cellData = cellData;

        /** Stores the Excel renderer for re-rendering */
        this.excelRenderer = excelRenderer;

        /** Gets the file input element from the DOM */
        this.fileInput = document.querySelector('.inputfile')!;

        /** Initializes the file input event listeners */
        this.initEvents();
    }

    /**
     * Initializes event listeners for the file input.
     */
    private initEvents(): void {
        this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));
    }

    /**
     * Writes data to the cell data model and triggers a render.
     * Assumes the first row of data is used for headers.
     * @param {any} data The data array loaded from file
     */
    writeData(data: any) {
        // Write headers to the first row
        let i = 1;
        for (const key in data[0]) {
            this.cellData.set(1, i, key);
            i++;
        }

        // Write data rows
        for (let i = 0; i < data.length; i++) {
            let j = 1;
            for (const key in data[0]) {
                this.cellData.set(i + 1, j, data[i][key]);
                j++;
            }
        }
        // Trigger re-render
        this.excelRenderer.render();
    }

    /**
     * Handles the file input change event, reads the file, and loads the data.
     * @param {Event} event The file input change event
     */
    private handleFileInput(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                this.writeData(json);
            } catch (err) {
                console.log(err);
            }
        };
        reader.readAsText(file);
    }
}
