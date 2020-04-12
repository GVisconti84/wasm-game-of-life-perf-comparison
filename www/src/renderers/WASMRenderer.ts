import { RsRenderer } from 'wasm-game-of-life-perf-comparison';
import { memory } from 'wasm-game-of-life-perf-comparison/wasm_game_of_life_perf_comparison_bg';
import { extendFromRust, Size, Position} from '../common';
import { Universe } from '../Universe';
import { CELL_SIZE, Renderer } from './Renderer';


export class WASMRenderer extends RsRenderer implements Renderer{
  private readonly ctx:       CanvasRenderingContext2D;
  private readonly imageData: ImageData;


  constructor(canvas: HTMLCanvasElement,
              private readonly universeSize: Size)
  {
    super();
    extendFromRust(this, RsRenderer.new(universeSize.width, universeSize.height));
    canvas.width  = super.getFramebufferWidth();
    canvas.height = super.getFramebufferHeight();
    this.ctx = canvas.getContext('2d');
    this.imageData = this.getImageData();
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


  private getImageData(): ImageData {
    let fbSize = super.getFramebufferLen();
    let fbPtr  = super.getFramebuffer();
    let width  = super.getFramebufferWidth();
    let height = super.getFramebufferHeight();

    return new ImageData(
        new Uint8ClampedArray(memory.buffer, fbPtr, fbSize),
        width,
        height
    );
  }


  destroy() {
    super.free();
  }
}
