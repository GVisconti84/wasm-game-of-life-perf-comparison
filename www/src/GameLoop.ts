import { Game } from './Game';
import { Renderer } from './renderers/Renderer';


export class GameLoop {
  public onLoopIterationStart: () => any;
  public onLoopIterationEnd:   () => any;

  private readonly loop: () => {};
  private frameRequestId: number | null = null;


  constructor(private readonly game: Game,
              private readonly renderer: Renderer) {
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
    this.renderer.render(this.game);
  }


  public play(): void {
    this.requestAnimationFrame();
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
    this.game.tick();
    this.renderer.render(this.game);
    this.onLoopIterationEnd && this.onLoopIterationEnd();

    this.requestAnimationFrame();
  }
}
