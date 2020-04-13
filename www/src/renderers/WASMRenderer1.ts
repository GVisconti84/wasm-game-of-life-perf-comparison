import { RsRenderer1 } from 'wasm-game-of-life-perf-comparison';
import { Size } from '../common';
import { AbstractWASMRenderer } from './AbstractWASMRenderer';
import { Renderer } from './Renderer';


export class WASMRenderer1 extends AbstractWASMRenderer implements Renderer {
  constructor(canvas: HTMLCanvasElement, universeSize: Size) {
    super(canvas, universeSize, RsRenderer1.new(universeSize.width, universeSize.height));
  }
}
