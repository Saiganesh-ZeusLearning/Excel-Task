import { excelRenderer } from "../Core/ExcelRenderer.js";
import { colData } from "../DataStructures/ColData.js";
import { rowData } from "../DataStructures/RowData.js";
import { cellHeight, cellWidth } from "../Utils/GlobalVariables.js";
import { selectionManager } from "./SelectionManager.js";

export class AutoScroller {
  private scrollableDiv: HTMLElement;
  private isSelecting: boolean = false;
  private pointerX: number = 0;
  private pointerY: number = 0;
  private scrollId: number | null = null;

  private readonly maxSpeed = 15;
  private readonly maxDistance = 100;

  constructor() {
    this.scrollableDiv = document.querySelector(".scrollable") as HTMLElement;
    this.attachEvents();
  }

  private calculateSpeed(distance: number): number {
    return Math.min(distance / this.maxDistance, 1) * this.maxSpeed;
  }

  private startAutoScroll(): void {
    if (this.scrollId !== null) return;

    const autoScroll = () => {
      if (!this.isSelecting) {
        this.scrollId = null;
        return;
      }

      const rect = this.scrollableDiv.getBoundingClientRect();
      let dx = 0, dy = 0;

      if (this.pointerY > rect.bottom) {
        dy = this.calculateSpeed(this.pointerY - rect.bottom);
      } else if (this.pointerY < rect.top) {
        dy = -this.calculateSpeed(rect.top - this.pointerY);
      }

      if (this.pointerX > rect.right) {
        dx = this.calculateSpeed(this.pointerX - rect.right);
      } else if (this.pointerX < rect.left) {
        dx = -this.calculateSpeed(rect.left - this.pointerX);
      }


      // // === Calculate Column ===
      // let x = 0, col = 0;
      // while (x <= selectionManager.clientX) {
      //   const colWidth = colData.get(col)?.width ?? cellWidth;
      //   if (x + colWidth > selectionManager.clientX) break;
      //   x += colWidth;
      //   col++;
      // }

      // // === Calculate Row ===
      // let y = 50, row = 0;
      // while (y <= selectionManager.clientY) {
      //   const rowHeight = rowData.get(row)?.height ?? cellHeight;
      //   if (y + rowHeight > selectionManager.clientY) break;
      //   y += rowHeight;
      //   row++;
      // }

      // selectionManager.getCellSelection.currRow = row;
      // selectionManager.getCellSelection.currCol = col;
      // console.log(row, col)
      // if (!selectionManager.selectingMultipleCells) return;
      // console.log(selectionManager.selectingMultipleCells)

      // selectionManager.getCellSelection.endRow = selectionManager.getCellSelection.currRow;
      // selectionManager.getCellSelection.endCol = selectionManager.getCellSelection.currCol;
      // excelRenderer.render();

      this.scrollableDiv.scrollBy(dx, dy);
      this.scrollId = requestAnimationFrame(autoScroll);
    };

    this.scrollId = requestAnimationFrame(autoScroll);
  }

  private attachEvents(): void {
    this.scrollableDiv.addEventListener('pointerdown', (e) => {
      this.isSelecting = true;
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;
      this.startAutoScroll();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isSelecting) return;
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
      this.isSelecting = false;
    });
  }
}
