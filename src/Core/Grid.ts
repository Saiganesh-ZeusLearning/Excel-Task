import { cellData } from "../DataStructures/CellData.js";
import { ColData, colData } from "../DataStructures/ColData.js";
import { RowData, rowData } from "../DataStructures/RowData.js";

export class GridCanvas {
  canvas: HTMLCanvasElement;
  cellWidth: number = 100;
  cellHeight: number = 24;
  totalCols: number = 20;
  totalRows: number = 100;
  width: number;
  height: number;
  mainCanvasWrapper: HTMLElement;

  constructor() {
    this.mainCanvasWrapper = document.querySelector(".main-canvas-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.classList.add("main-canvas");
    this.mainCanvasWrapper.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.cellWidth = this.cellWidth;
    this.cellHeight = this.cellHeight;
    this.totalCols = this.totalCols;
    this.totalRows = this.totalRows;
    this.height = this.cellHeight * this.totalRows;
    this.width = this.cellWidth * this.totalCols;

    this.initCanvas(ctx);
    this.drawGrid(ctx, 0, 0);
  }


  get getGridCanvas() {
    return this.canvas;
  }


  private initCanvas(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    ctx.scale(dpr, dpr);
  }

  drawVerticalGridLines(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {
    // === Draw Vertical Grid Lines ===
    let x = 0.5;
    for (let col = startCol; col <= startCol + this.totalCols; col++) {
      const colWidth = colData.get(col)?.width ?? this.cellWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      if (ColData.getSelectedCol() == col || ColData.getSelectedCol() == col - 1) {
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      x += colWidth;
    }
  }

  drawHorizontalGridLines(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {

    // === Draw Horizontal Grid Lines ===

    let y = 0.5;
    for (let row = startRow; row <= startRow + this.totalRows; row++) {
      const rowHeight = rowData.get(row)?.height ?? this.cellHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      if (RowData.getSelectedRow() == row || RowData.getSelectedRow() == row - 1) {
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      y += rowHeight;
    }
  }

  drawCellData(ctx: CanvasRenderingContext2D, startRow: number, startCol: number){
    
    // === Draw Cell Data ===
    let yPos = 0;
    for (let r = 0; r < this.totalRows; r++) {
      const rowIndex = startRow + r;
      const rowHeight = rowData.get(rowIndex)?.height ?? this.cellHeight;

      let xPos = 0;
      for (let c = 0; c < this.totalCols; c++) {
        const colIndex = startCol + c;
        const colWidth = colData.get(colIndex)?.width ?? this.cellWidth;

        if (cellData.has(rowIndex + 1, colIndex + 1)) {
          const text = `${cellData.get(rowIndex + 1, colIndex + 1)}`;
          ctx.font = "12px Arial";
          ctx.fillStyle = "#000";
          ctx.fillText(text, xPos + 5, yPos + rowHeight / 2 + 4); // adjust +4 for vertical alignment
        }
        if ((RowData.getSelectedRow() === rowIndex && colIndex !== 0) || (ColData.getSelectedCol() === colIndex && rowIndex !== 0)) {
          ctx.fillStyle = "#E8F2EC";
          ctx.fillRect(xPos, yPos, colWidth, rowHeight);
        }
        
        xPos += colWidth;
      }

      yPos += rowHeight;
    }
  }

  drawGrid(ctx: CanvasRenderingContext2D, startRow: number, startCol: number) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCellData(ctx,startRow, startCol);
    if (RowData.getSelectedRow() !== null) {
      this.drawVerticalGridLines(ctx, startRow, startCol);
      this.drawHorizontalGridLines(ctx, startRow, startCol);
    } else {
      this.drawHorizontalGridLines(ctx, startRow, startCol);
      this.drawVerticalGridLines(ctx, startRow, startCol);
    }

  }

}

export const gridObj = new GridCanvas();
