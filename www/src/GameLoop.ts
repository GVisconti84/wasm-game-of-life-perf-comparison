import { JSUniverse } from './JSUniverse';
import { Renderer } from './renderers/Renderer';


export class GameLoop {
  public onLoopIterationStart: () => any;
  public onLoopIterationEnd:   () => any;

  private readonly loop: () => {};
  private frameRequestId: number | null = null;


  constructor(protected readonly universe: JSUniverse,
              protected readonly renderer: Renderer) {
    this.loop = this._loop.bind(this);
    this.reRender();  // To be sure to draw the first frame.
  }


  public isPaused(): boolean {
    return this.frameRequestId === null;
  }


  public pause(): void {
    this.cancelAnimationFrame();
  }


  public reRender(): void {
    this.renderer.render(this.universe);
  }


  public play(): void {
    this.requestAnimationFrame();
  }


  public setOnLoopStartEnd(start: () => any, end: () => any): void {
    this.onLoopIterationStart = start;
    this.onLoopIterationEnd   = end;
  }


  private cancelAnimationFrame() {
    window.cancelAnimationFrame(this.frameRequestId);
    this.frameRequestId = null;
  }


  private requestAnimationFrame() {
    this.frameRequestId = window.requestAnimationFrame(this.loop);
  }


  private _loop() {
    this.onLoopIterationStart && this.onLoopIterationStart();
    this.universe.tick();
    this.renderer.render(this.universe);
    this.onLoopIterationEnd && this.onLoopIterationEnd();

    this.requestAnimationFrame();
  }


  destroy() {
    this.pause();
    this.onLoopIterationStart = null;
    this.onLoopIterationEnd   = null;
  }
}
