import { Cell } from 'wasm-game-of-life-perf-comparison';
import { Game } from '../Game';
import { JSRenderer } from './JSRenderer';
import { ALIVE_COLOR, CELL_SIZE, DEAD_COLOR } from './Renderer';


export class JSOptimizedRenderer extends JSRenderer {
  protected drawCells(cells: Uint8Array[Cell], game: Game) {
    const ctx = this.ctx;

    ctx.beginPath();

    // Alive cells.
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = game.getCellIndex(row, col);
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
        const idx = game.getCellIndex(row, col);
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
}
