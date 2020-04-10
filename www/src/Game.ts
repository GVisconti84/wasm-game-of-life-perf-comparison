import { Cell, Universe } from 'wasm-game-of-life-perf-comparison';
import { memory } from 'wasm-game-of-life-perf-comparison/wasm_game_of_life_perf_comparison_bg';
import { Size } from './common';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';


export class Game {
  private universe: Universe;
  private readonly width:  number;
  private readonly height: number;


  constructor() {
    this.universe = Universe.new();
    this.width  = this.universe.width();
    this.height = this.universe.height();
  }


  // TODO: Move.
  public getFrameSize(): Size {
    return {
      width:  (CELL_SIZE + 1) * this.width  + 1,
      height: (CELL_SIZE + 1) * this.height + 1,
    };
  }


  // TODO: Move.
  public render(ctx: CanvasRenderingContext2D): void {
    this.drawGrid(ctx);
    // this.drawCells(ctx);
    this.drawCellsOptimized(ctx);
  }


  public tick():void {
    this.universe.tick();
  }


  public toggleCellAt(x: number, y: number): void {
    const row = Math.min(Math.floor(y / (CELL_SIZE + 1)), this.height - 1);
    const col = Math.min(Math.floor(x / (CELL_SIZE + 1)), this.width  - 1);

    this.universe.toggle_cell(row, col);
  }


  // TODO: Move.
  private drawCells(ctx: CanvasRenderingContext2D) {
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);

    ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);

        ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

        ctx.fillRect(
            col * (CELL_SIZE + 1) + 1,
            row * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );
      }
    }

    ctx.stroke();
  }


  // TODO: Move.
  private drawCellsOptimized(ctx: CanvasRenderingContext2D) {
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);

    ctx.beginPath();

    // Alive cells.
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (cells[idx] !== Cell.Alive) {
          continue;
        }

        ctx.fillRect(
            col * (CELL_SIZE + 1) + 1,
            row * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );
      }
    }

    // Dead cells.
    ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (cells[idx] !== Cell.Dead) {
          continue;
        }

        ctx.fillRect(
            col * (CELL_SIZE + 1) + 1,
            row * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );
      }
    }
  }


  // TODO: Move.
  private drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      ctx.moveTo(0,                                j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * this.width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
  }


  private getIndex(row, column) {
    return row * this.width + column;
  }


  public destroy() {
    this.universe.free();
  }
}
