import { FPS } from './FPS';
import { Game } from './Game';
import { GameLoop } from './GameLoop';


const game = new Game();
const canvas = document.getElementById("game-of-life-canvas") as HTMLCanvasElement;
const cSize = game.getFrameSize();
canvas.width  = cSize.width;
canvas.height = cSize.height;
const ctx = canvas.getContext('2d');
const gLoop = new GameLoop(game, ctx);

const fpsDomElement = document.getElementById('fps');
const fps = new FPS(fpsDomElement);

gLoop.onLoopIterationStart = () => fps.loopIterationStarted();
gLoop.onLoopIterationEnd   = () => fps.loopIterationEnded();

const playPauseButton = document.getElementById("play-pause");

playPauseButton.addEventListener("click", event => {
  if (gLoop.isPaused()) {
    playPauseButton.textContent = "⏸";
    gLoop.play();
  } else {
    playPauseButton.textContent = "▶";
    gLoop.pause();
  }
});

canvas.addEventListener("click", event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  game.toggleCellAt(canvasLeft, canvasTop)

  game.render(ctx);
});

gLoop.play();
