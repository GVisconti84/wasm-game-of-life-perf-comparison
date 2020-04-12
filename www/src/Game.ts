import { DOMElements, EventHandlers } from './common';
import { GameLoop } from './GameLoop';
import { JSUniverse } from './JSUniverse';
import { JSOptimizedRenderer } from './renderers/JSOptimizedRenderer';


export class Game extends GameLoop {
  private readonly domElements: DOMElements
  private readonly handlers:    EventHandlers;


  constructor(domElements: DOMElements) {
    const universe = new JSUniverse();
    const renderer = new JSOptimizedRenderer(domElements.canvas, universe.getSize());
    super(universe, renderer);

    this.domElements = domElements;
    this.handlers    = {};
    this.registerEventHandlers();
  }


  private registerEventHandlers() {
    let {canvas, playBtn} = this.domElements;

    canvas.addEventListener('click', this.handlers.canvas = event => {
      if (!this.isPaused()) return;

      const boundingRect = canvas.getBoundingClientRect();

      const scaleX = canvas.width  / boundingRect.width;
      const scaleY = canvas.height / boundingRect.height;

      const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
      const canvasTop  = (event.clientY - boundingRect.top)  * scaleY;

      const pos = this.renderer.getCellAt(canvasLeft, canvasTop)
      this.universe.toggleCell(pos.row, pos.col);
      this.reRender();
    });

    playBtn.addEventListener('click', this.handlers.playBtn = event => {
      if (this.isPaused()) {
        playBtn.textContent = '⏸';
        this.play();
      } else {
        playBtn.textContent = '▶';
        this.pause();
      }
    });
  }


  private unregisterEventHandlers(): void {
    this.domElements.canvas.removeEventListener('click',  this.handlers.canvas);
    this.domElements.playBtn.removeEventListener('click', this.handlers.playBtn);
  }


  destroy() {
    this.unregisterEventHandlers();
    this.universe.destroy();
    this.renderer.destroy();
    super.destroy();
  }
}
