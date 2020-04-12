import { DOMElements } from './common';
import { FPS } from './FPS';
import { Game } from './Game';
import '../style.less';


const KILL = false; // Whether to kill the app after 5 seconds.

const CANVAS_ID   = 'canvas';
const PLAY_BTN_ID = 'play-btn';
const PERF_ID     = 'perf';


function main() {
  const domElements = getDomElements();
  const game = new Game(domElements);

  const fps = new FPS(domElements.perf);
  game.setOnLoopStartEnd(
      () => fps.loopIterationStarted(),
      () => fps.loopIterationEnded()
  );
  game.play();

  if (KILL) setTimeout(() => {
    // This is mostly to test for memory leaks.
    // Apparently everything gets deallocated correctly.
    game.destroy();
  }, 5000);
}


function getDomElements(): DOMElements {
  const canvas  = document.getElementById(CANVAS_ID)   as HTMLCanvasElement;
  const playBtn = document.getElementById(PLAY_BTN_ID) as HTMLButtonElement;
  const perf    = document.getElementById(PERF_ID);

  return {canvas, playBtn, perf};
}


main();


