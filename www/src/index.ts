import { DOMElements, EventHandlers } from './common';
import { FPS } from './FPS';
import { JSUniverse } from './JSUniverse';
import { GameLoop } from './GameLoop';
import { JSOptimizedRenderer } from './renderers/JSOptimizedRenderer';
import { Renderer } from './renderers/Renderer';


const KILL = false; // Whether to kill the app after 5 seconds.

const CANVAS_ID   = 'canvas';
const PLAY_BTN_ID = 'play-btn';
const PERF_ID     = 'perf';


function main() {
  const domElements = getDomElements();
  const universe = new JSUniverse();
  const fps      = new FPS(domElements.perf);
  const renderer = new JSOptimizedRenderer(domElements.canvas, universe.getSize());
  const gLoop    = new GameLoop(universe, renderer);

  const handlers = registerEventHandlers(domElements, universe, gLoop, renderer);

  gLoop.onLoopIterationStart = () => fps.loopIterationStarted();
  gLoop.onLoopIterationEnd   = () => fps.loopIterationEnded();
  gLoop.play();

  if (KILL) setTimeout(() => {
    // This is mostly to test for memory leaks.
    // Apparently everything gets deallocated correctly.
    unregisterEventHandlers(domElements, handlers);
    gLoop.pause();
    universe.destroy();
  }, 5000);
}


function registerEventHandlers(elems: DOMElements,
                               universe: JSUniverse,
                               gLoop: GameLoop,
                               renderer: Renderer): EventHandlers {
  let handlers: EventHandlers = {};
  let {canvas, playBtn} = elems;

  canvas.addEventListener('click', handlers.canvas = event => {
    if (!gLoop.isPaused()) return;

    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width  / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop  = (event.clientY - boundingRect.top)  * scaleY;

    const pos = renderer.getCellAt(canvasLeft, canvasTop)
    universe.toggleCell(pos.row, pos.col);
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


