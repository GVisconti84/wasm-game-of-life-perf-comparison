import { Game } from './Game';


export class GameLoop {
  public onLoopIterationStart: () => any;
  public onLoopIterationEnd:   () => any;

  private readonly loop: () => {};
  private frameRequestId: number | null = null;


  constructor(private readonly game: Game,
              private readonly ctx: CanvasRenderingContext2D) {
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
    this.game.render(this.ctx);
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
    this.game.render(this.ctx);
    this.onLoopIterationEnd && this.onLoopIterationEnd();

    this.requestAnimationFrame();
  }
}
