import { excelRenderer } from "../Core/ExcelRenderer.js";
import { cellData } from "../DataStructures/CellData.js";
import { User } from "./GenerateData.js";

export class LoadDataManager {
    private navInput: HTMLInputElement;
    private fileInput: HTMLInputElement;

    constructor() {
        this.navInput = document.querySelector('.nav-row-col')!;
        this.fileInput = document.querySelector('.inputfile')!;

        this.initEvents();
    }

    private initEvents(): void {
        this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));
    }
    writeData(data: User[]) {
        let i = 1;
        for (const key in data[0]) {
            cellData.set(1, i, key);
            i++;
        }
        console.log(data.length);

        for (let i = 0; i <= data.length; i++) {
            Object.keys(data).forEach((key: any) => {
                console.log(key, data[key]);
            });
        }
        console.log("done")
        excelRenderer.render();
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

