import { ExcelRenderer } from "../Core/ExcelRenderer.js";
import { cellData } from "../DataStructures/CellData.js";
import { colData } from "../DataStructures/ColData.js";
import { InputManager } from "../Interaction/InputManager.js";
import { SelectionManager } from "../Interaction/SelectionManager.js";
import { commandManager} from "../main.js";
import { CanvasTopOffset, cellWidth, ColLabel, totalVisibleCols } from "../Utils/GlobalVariables.js";

/**
 * Class responsible for rendering and interacting with the column label canvas (A, B, C...).
 */
export class ColumnLabelCanvas {
  /** @type {HTMLCanvasElement} Canvas element for column labels */
  private canvas: HTMLCanvasElement;
  private inputDiv: HTMLInputElement;
  private scrollDiv: HTMLElement;
  private selectionManager: SelectionManager | null;
  private inputManager: InputManager | null;

  /** @type {HTMLElement} Wrapper for column label canvas */
  private colWrapper: HTMLElement;

  /** @type {number} Starting column index for rendering */
  private startCol: number;

  /** @type {number} Height of the label area */
  private height = 24;

  /** @type {number} Total canvas width based on totalCols and cellWidth */
  private width = totalVisibleCols * cellWidth + 1;

  /** @type {boolean} Whether column resizing is in progress */
  private isResizing = false;

  /** @type {number} X coordinate where resize started */
  private resizeStartX = 0;

  /** @type {number} Index of the column being resized */
  private targetCol = -1;

  /** @type {boolean} Prevents click action immediately after resize */
  private skipClick: boolean;

  private oldValue: number;
  private newValue: number;

  private isSelectingCol: boolean;

  /**
   * Initializes the ColumnLabelCanvas instance.
   * @param {number} colId - Column index to start drawing from.
   */
  constructor(selectionManager: SelectionManager) {
    this.colWrapper = document.querySelector(".col-label-wrapper") as HTMLElement;
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("col-label");
    this.inputDiv = document.querySelector(".input-selection") as HTMLInputElement;
    this.selectionManager = selectionManager;
    this.inputManager = null;
    this.scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    this.colWrapper.appendChild(this.canvas);
    this.startCol = 0;
    this.oldValue = 0;
    this.newValue = 0;
    this.isSelectingCol = false;
    this.skipClick = false;

    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initCanvas(ctx);
    this.drawColumns(ctx, 0);

    // Attach event listeners
    this.canvas.addEventListener("mousedown", this.handleMouseDownResizing.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDownSelection.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  intializeRender(inputManager: InputManager) {
    this.inputManager = inputManager;
  }

  /**
   * Getter to access the column canvas.
   * @returns {HTMLCanvasElement} Canvas element.
   */
  get getColCanvas() {
    return this.canvas;
  }

  /**
   * Initializes the canvas size and scales it for high-DPI screens.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   */
  private initCanvas(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    ctx.scale(dpr, dpr);
  }

  /**
   * Draws the column headers and vertical grid lines.
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   * @param {number} startCol - Column index to start drawing from.
   */
  drawColumns(ctx: CanvasRenderingContext2D, startCol: number): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let x = -0.5;

    for (let col = startCol; col <= startCol + totalVisibleCols; col++) {
      this.startCol = startCol;
      const colInfo = colData.get(col);
      const nxtWidth = colInfo ? colInfo.width : cellWidth;
      if (this.selectionManager === null) return;
      const selectedCells = this.selectionManager.getCellSelection;

      let startColIndex = selectedCells.startCol;
      let endColIndex = selectedCells.endCol;
      let selectionState = selectedCells.selectionState;

      if (startColIndex > endColIndex) {
        [startColIndex, endColIndex] = [endColIndex, startColIndex]
      }
      if (this.selectionManager === null) return;
      let startMin = Math.min(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);
      let startMax = Math.max(this.selectionManager.ColSelection.startCol, this.selectionManager.ColSelection.endCol);
      let colSelectionState = this.selectionManager.ColSelection.selectionState;
      // Highlight logic
      if ((colSelectionState && startMin <= col && startMax >= col)) {
        ctx.fillStyle = "#107C41";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";

        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(x, 23);
        ctx.lineTo(x + nxtWidth, 23);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.strokeStyle = "#A0D8B9";

        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, -1.5);
        ctx.lineTo(x, this.canvas.height - 1.5);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if ((this.selectionManager.RowSelection.selectionState) || (selectionState && startColIndex <= col && endColIndex >= col)) {
        ctx.fillStyle = "#CAEAD8";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "green";
        ctx.font = "12px sans-serif";


        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 22);
        ctx.strokeStyle = "#A0D8B9";
        ctx.lineWidth = 1;
        ctx.stroke();


        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(x, 23);
        ctx.lineTo(x + nxtWidth + 1, 23);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "green";
        ctx.stroke();
      } else {
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(x, 0, nxtWidth, 24);
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";

        // Draw horizontal line
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(x, 23.5);
        ctx.lineTo(x + nxtWidth, 23.5);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();

        if (endColIndex == col - 1) {
          ctx.strokeStyle = "#A0D8B9";
        } else {
          ctx.strokeStyle = "#ddd";
        }

        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0.5);
        ctx.lineTo(x, this.canvas.height + 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw label
      const label = ColLabel(1 + col);
      ctx.fillText(label, x + nxtWidth / 2 - 5, 16);

      x += nxtWidth;
    }

  }

  /**
   * Handles column click event to select column.
   * @param {MouseEvent} e - Mouse click event.
   */
  private handleMouseDownSelection(e: MouseEvent) {
    e.preventDefault();
    if (this.skipClick) return;
    let x = 0.5;
    let offsetX = e.offsetX;

    for (let i = 0; i < totalVisibleCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? cellWidth;

      if (offsetX >= x + 4 && offsetX <= x + width) {
        this.inputDiv.style.left = `${CanvasTopOffset}px`;
        this.isSelectingCol = true;
        if (this.selectionManager === null) return;
        this.selectionManager.RowSelection = { ...this.selectionManager.RowSelection, selectionState: false };
        this.selectionManager.ColSelection = { ...this.selectionManager.ColSelection, startCol: this.selectionManager.getCellSelection.currCol, endCol: this.selectionManager.getCellSelection.currCol, selectionState: true };
        this.selectionManager.set(0, this.selectionManager.ColSelection.startCol, 0, this.selectionManager.ColSelection.startCol, true);
        if(this.inputManager === null) return;
        this.inputManager.setInputLocation(0, this.selectionManager.ColSelection.startCol);
        this.inputDiv.style.caretColor = "transparent";
        return;
      }
      x += width;
    }
  }

  /**
   * Handles mouse down event to initiate column resizing.
   * @param {MouseEvent} e - Mouse down event.
   */
  private handleMouseDownResizing(e: MouseEvent) {
    const offsetX = e.offsetX;
    const offsetY = e.offsetY
    let x = 0;

    this.skipClick = false;

    if(this.selectionManager === null) return;
    this.selectionManager.set(-100, -100, -100, -100, false);

    for (let i = 0; i < totalVisibleCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? cellWidth;

      if (Math.abs(offsetX - (x + width)) <= 4 && offsetY > 9) {
        this.isResizing = true;
        this.resizeStartX = offsetX;
        this.targetCol = col;
        this.oldValue = colData.get(this.targetCol)?.width ?? 100;

        this.skipClick = true;
        break;
      }
      if (Math.abs(offsetX - (x + width)) <= 4 && offsetY < 9) {
        this.skipClick = true;
        cellData.insertColumnAt(col + 2);
        colData.insertColumnAt(col + 1);
        if (this.selectionManager === null) return;
        this.selectionManager.set(0, col + 1, 0, col + 1, true);
        this.selectionManager.ColSelection = { endCol: col + 1, startCol: col + 1, selectionState: true }
        if(this.inputManager === null) return;
        this.inputManager.setInputLocation(0, col + 1);
        break;
      }

      x += width;
    }
  }

  /**
   * Handles mouse move event for column resizing and cursor feedback.
   * @param {MouseEvent} e - Mouse move event.
   */
  private handleMouseMove(e: MouseEvent) {
    const offsetX = e.offsetX;
    const offsetY = e.offsetY
    let x = 0;
    let found = false;
    let isColAdd = false;

    for (let i = 0; i < totalVisibleCols; i++) {
      const col = this.startCol + i;
      const width = colData.get(col)?.width ?? cellWidth;

      if (Math.abs(offsetX - (x + width)) <= 4 && offsetY > 9) {
        this.canvas.style.cursor = "w-resize";
        found = true;
        break;
      }
      if (Math.abs(offsetX - (x + width)) <= 4 && offsetY < 9) {
        this.canvas.style.cursor = "copy";
        found = true;
        isColAdd = true;
        break;
      }

      x += width;
    }


    if (this.isSelectingCol) {
      if (this.selectionManager === null) return;
      this.selectionManager.ColSelection = { ...this.selectionManager.ColSelection, endCol: this.selectionManager.getCellSelection.currCol };
    }

    if (!found && !this.isResizing) {
      this.canvas.style.cursor = "url('../../build/style/cursor-down.png') 12 12, auto";
    }

    if (this.isResizing && this.targetCol !== -1) {
      const diff = offsetX - this.resizeStartX;
      const currentWidth = colData.get(this.targetCol)?.width ?? cellWidth;
      const newWidth = Math.max(30, currentWidth + diff);
      this.newValue = newWidth;
      colData.set(this.targetCol, newWidth);
      this.resizeStartX = offsetX;

    }
  }

  /**
   * Handles mouse up event to finalize column resizing.
   */
  private handleMouseUp() {
    this.isResizing = false;
    this.isSelectingCol = false;
    if (this.oldValue !== this.newValue) {
      commandManager.pushColResizeCommand(this.newValue, this.oldValue, this.targetCol);
      this.oldValue = 0;
      this.newValue = 0;
    }
    this.targetCol = -1;
    this.scrollDiv.style.cursor = "cell";
  }
}
