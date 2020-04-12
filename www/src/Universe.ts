import { Cell, RsUniverse } from 'wasm-game-of-life-perf-comparison';
import { memory } from 'wasm-game-of-life-perf-comparison/wasm_game_of_life_perf_comparison_bg';
import { extendFromRust, Size } from './common';


export class Universe extends RsUniverse {
  private readonly w: number;
  private readonly h: number;


  constructor() {
    super();
    extendFromRust(this, RsUniverse.new());
    this.w = super.width();
    this.h = super.height();
  }


  // It doesn't make sense to go into wasm for such a small function (Overhead kills the perf gain).
  public getCellIndex(row: number, col: number): number {
    return row * this.w + col;
  }


  public getCells(): Uint8Array[Cell] {
    const cellsPtr = super.getCells();
    return new Uint8Array(memory.buffer, cellsPtr, this.w * this.h) as unknown as Uint8Array[Cell];
  }


  public getSize(): Size {
    return {
      width:  this.w,
      height: this.h
    };
  }


  destroy() {
    super.free();
  }
}
