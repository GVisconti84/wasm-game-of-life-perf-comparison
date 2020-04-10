import { Cell } from 'wasm-game-of-life-perf-comparison';
import { Size, Position } from '../common';
import { Game } from '../Game';
import { ALIVE_COLOR, CELL_SIZE, DEAD_COLOR, GRID_COLOR, Renderer } from './Renderer';


export class JSRenderer implements Renderer {
  protected readonly width:  number;
  protected readonly height: number;
  protected readonly ctx: CanvasRenderingContext2D


  constructor(canvas: HTMLCanvasElement, gameSize: Size) {
    this.width    = gameSize.width;
    this.height   = gameSize.height;

    const frameSize = this.getFrameSize();
    canvas.width  = frameSize.width;
    canvas.height = frameSize.height;

    this.ctx = canvas.getContext('2d');
  }


  public getCellAt(x: number, y: number): Position {
    return {
      row: Math.min(Math.floor(y / (CELL_SIZE + 1)), this.height - 1),
      col: Math.min(Math.floor(x / (CELL_SIZE + 1)), this.width  - 1),
    }
  }


  public getFrameSize(): Size {
    return {
      width:  (CELL_SIZE + 1) * this.width  + 1,
      height: (CELL_SIZE + 1) * this.height + 1,
    };
  }


  public render(game: Game): void {
    this.drawGrid();
    this.drawCells(game.getCells(), game);
  }


  protected drawCells(cells: Uint8Array[Cell], game: Game) {
    const ctx = this.ctx;
    ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = game.getCellIndex(row, col);

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


  private drawGrid() {
    const ctx = this.ctx;

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
}
