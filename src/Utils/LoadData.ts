import { ExcelRenderer } from "../Core/ExcelRenderer.js";
import { cellData } from "../main.js";

export class LoadDataManager {
    private fileInput: HTMLInputElement;
    private excelRenderer: ExcelRenderer;

    constructor(excelRenderer: ExcelRenderer) {
        this.excelRenderer = excelRenderer;
        this.fileInput = document.querySelector('.inputfile')!;
        this.initEvents();
    }

    private initEvents(): void {
        this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));
    }
    writeData(data: any) {
        let i = 1;
        for (const key in data[0]) {
            cellData.set(1, i, key);
            i++;
        }

        for (let i = 0; i < data.length; i++) {
            let j = 1;
            for (const key in data[0]) {
                cellData.set(i+1, j, data[i][key]);
                j++;
            }
        }
        this.excelRenderer.render();
    }

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

