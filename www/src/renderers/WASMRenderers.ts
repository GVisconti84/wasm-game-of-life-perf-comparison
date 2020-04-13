import {
  dummyRenderFloat,
  noGridNew,
  noGridRender,
  noGridU32New,
  noGridU32Render,
  render1,
  render2
} from 'wasm-game-of-life-perf-comparison';
import { Size } from '../common';
import { Universe } from '../Universe';
import { AbstractWASMRenderer } from './AbstractWASMRenderer';


export class WASMDummyRendererFloat extends AbstractWASMRenderer  {
  protected invokeRenderFunction(universe: Universe): void { dummyRenderFloat(this, universe); }
}

export class WASMRenderer1 extends AbstractWASMRenderer  {
  protected invokeRenderFunction(universe: Universe): void { render1(this, universe); }
}

export class WASMRenderer2 extends AbstractWASMRenderer  {
  protected invokeRenderFunction(universe: Universe): void { render2(this, universe); }
}

export class WASMNoGridRenderer extends AbstractWASMRenderer  {
  constructor(canvas: HTMLCanvasElement, universeSize: Size) {
    super(canvas, universeSize, noGridNew(universeSize.width, universeSize.height));
  }
  protected invokeRenderFunction(universe: Universe): void { noGridRender(this, universe); }
}

export class WASMNoGridU32Renderer extends AbstractWASMRenderer  {
  constructor(canvas: HTMLCanvasElement, universeSize: Size) {
    super(canvas, universeSize, noGridU32New(universeSize.width, universeSize.height));
  }
  protected invokeRenderFunction(universe: Universe): void { noGridU32Render(this, universe); }
}
