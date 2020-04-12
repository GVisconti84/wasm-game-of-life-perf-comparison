import { RsRenderer2 } from 'wasm-game-of-life-perf-comparison';
import { Size } from '../common';
import { AbstractWASMRenderer } from './AbstractWASMRenderer';
import { Renderer } from './Renderer';


export class WASMRenderer2 extends AbstractWASMRenderer implements Renderer {
  constructor(canvas: HTMLCanvasElement, universeSize: Size) {
    super(canvas, universeSize, RsRenderer2.new(universeSize.width, universeSize.height));
  }
}
