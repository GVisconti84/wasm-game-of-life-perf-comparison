import { RsDummyRendererFloat } from 'wasm-game-of-life-perf-comparison';
import { Size } from '../common';
import { AbstractWASMRenderer } from './AbstractWASMRenderer';
import { Renderer } from './Renderer';


export class DummyRendererFloat extends AbstractWASMRenderer implements Renderer {
  constructor(canvas: HTMLCanvasElement, universeSize: Size) {
    super(canvas, universeSize, RsDummyRendererFloat.new(universeSize.width, universeSize.height));
  }
}
