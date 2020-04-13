import { dummyRenderFloat, render1, render2 } from 'wasm-game-of-life-perf-comparison';
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
