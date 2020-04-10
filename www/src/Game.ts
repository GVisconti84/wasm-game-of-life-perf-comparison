import { Cell, Universe } from 'wasm-game-of-life-perf-comparison';
import { memory } from 'wasm-game-of-life-perf-comparison/wasm_game_of_life_perf_comparison_bg';
import { Size } from './common';


export class Game {
  private universe: Universe;
  private readonly width:  number;
  private readonly height: number;


  constructor() {
    this.universe = Universe.new();
    this.width  = this.universe.width();
    this.height = this.universe.height();
  }


  public getCellIndex(row: number, col: number): number {
    return row * this.width + col;
  }


  public getCells(): Uint8Array[Cell] {
    const cellsPtr = this.universe.cells();
    return new Uint8Array(memory.buffer, cellsPtr, this.width * this.height) as unknown as Uint8Array[Cell];
  }


  public getSize(): Size {
    return {
      width:  this.width,
      height: this.height
    };
  }


  public tick():void {
    this.universe.tick();
  }


  public toggleCell(row: number, col: number): void {
    this.universe.toggle_cell(row, col);
  }


  public destroy() {
    this.universe.free();
  }
}
