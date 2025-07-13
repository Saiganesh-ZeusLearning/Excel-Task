import { CellData } from "../DataStructures/CellData";
import { ColData } from "../DataStructures/ColData";
import { RowData } from "../DataStructures/RowData";

export class AutoScroller {
  private scrollableDiv: HTMLElement;
  private isSelecting: boolean = false;
  private pointerX: number = 0;
  private pointerY: number = 0;
  private scrollId: number | null = null;

  private readonly maxSpeed = 15;
  private readonly maxDistance = 100;

  private rowData: RowData;
  private colData: ColData;
  private cellData: CellData;

  constructor(rowData: RowData, colData: ColData, cellData: CellData) {
    this.rowData = rowData;
    this.colData = colData;
    this.cellData = cellData;

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

      // if(this.rowData.RowSelection.selectionState){
      //   console.log(this.pointerX, this.pointerY)
      // }

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
