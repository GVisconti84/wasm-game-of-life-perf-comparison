import { RsRenderer2 } from 'wasm-game-of-life-perf-comparison';
import { memory } from 'wasm-game-of-life-perf-comparison/wasm_game_of_life_perf_comparison_bg';
import { extendFromRust, Size, Position} from '../common';
import { Universe } from '../Universe';
import { CELL_SIZE, Renderer } from './Renderer';


export class WASMRenderer2 extends RsRenderer2 implements Renderer {
  private readonly ctx:       CanvasRenderingContext2D;
  private readonly imageData: ImageData;


  constructor(canvas: HTMLCanvasElement,
              private readonly universeSize: Size)
  {
    super();
    extendFromRust(this, RsRenderer2.new(universeSize.width, universeSize.height));
    super.setCanvasSize(canvas);
    this.ctx = canvas.getContext('2d');
    this.imageData = this.getImageData(canvas.width, canvas.height);
  }


  public render(universe: Universe): void {
    super.render(universe);
    this.ctx.putImageData(this.imageData, 0, 0);
  }


  // TODO: duplicated code.
  public getCellAt(x: number, y: number): Position {
    return {
      row: Math.min(Math.floor(y / (CELL_SIZE + 1)), this.universeSize.width - 1),
      col: Math.min(Math.floor(x / (CELL_SIZE + 1)), this.universeSize.height- 1),
    }
  }


  private getImageData(width: number, height: number): ImageData {
    let fbPtr  = super.getFramebuffer();

    return new ImageData(
        new Uint8ClampedArray(memory.buffer, fbPtr, width * height * 4),
        width,
        height
    );
  }


  destroy() {
    super.free();
  }
}
