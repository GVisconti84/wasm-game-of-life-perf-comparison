import { DOMElements, EventHandlers, Size } from './common';
import { FPS } from './FPS';
import { Game } from './Game';
import { GameLoop } from './GameLoop';
import { JSOptimizedRenderer } from './renderers/JSOptimizedRenderer';
import { Renderer } from './renderers/Renderer';


const KILL = false; // Whether to kill the app after 5 seconds.

const CANVAS_ID   = 'canvas';
const PLAY_BTN_ID = 'play-btn';
const PERF_ID     = 'perf';


function main() {
  const domElements = getDomElements();
  const game     = new Game();
  const fps      = new FPS(domElements.perf);
  const renderer = new JSOptimizedRenderer(domElements.canvas, game.getSize());
  const gLoop    = new GameLoop(game, renderer);

  const handlers = registerEventHandlers(domElements, game, gLoop, renderer);

  gLoop.onLoopIterationStart = () => fps.loopIterationStarted();
  gLoop.onLoopIterationEnd   = () => fps.loopIterationEnded();
  gLoop.play();

  if (KILL) setTimeout(() => {
    // This is mostly to test for memory leaks.
    // Apparently everything gets deallocated correctly.
    unregisterEventHandlers(domElements, handlers);
    gLoop.pause();
    game.destroy();
  }, 5000);
}


function registerEventHandlers(elems: DOMElements,
                               game: Game,
                               gLoop: GameLoop,
                               renderer: Renderer): EventHandlers {
  let handlers: EventHandlers = {};
  let {canvas, playBtn} = elems;

  canvas.addEventListener('click', handlers.canvas = event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width  / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop  = (event.clientY - boundingRect.top)  * scaleY;

    const pos = renderer.getCellAt(canvasLeft, canvasTop)
    game.toggleCell(pos.row, pos.col);
    gLoop.reRender();
  });

  playBtn.addEventListener('click', handlers.playBtn = event => {
    if (gLoop.isPaused()) {
      playBtn.textContent = '⏸';
      gLoop.play();
    } else {
      playBtn.textContent = '▶';
      gLoop.pause();
    }
  });

  return handlers;
}


function unregisterEventHandlers({canvas, playBtn}: DOMElements, handlers: EventHandlers): void {
  canvas.removeEventListener('click', handlers.canvas);
  playBtn.removeEventListener('click', handlers.playBtn);
}


function getDomElements(): DOMElements {
  const canvas  = document.getElementById(CANVAS_ID)   as HTMLCanvasElement;
  const playBtn = document.getElementById(PLAY_BTN_ID) as HTMLButtonElement;
  const perf    = document.getElementById(PERF_ID);

  return {canvas, playBtn, perf};
}


main();


