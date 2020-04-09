import { FPS } from './FPS';
import { Game } from './Game';


const game = new Game();


const canvas = document.getElementById("game-of-life-canvas") as HTMLCanvasElement;
const cSize = game.getFrameSize();
canvas.width  = cSize.width;
canvas.height = cSize.height;

const ctx = canvas.getContext('2d');

const fpsDomElement = document.getElementById('fps');
const fps = new FPS(fpsDomElement);

let animationId = null;
const renderLoop = () => {
  fps.loopIterationStarted();
  // for (let i = 0; i < 9; i++) {
    game.tick()
  // }
  game.render(ctx);
  fps.loopIterationEnded();

  animationId = requestAnimationFrame(renderLoop);
};


const isPaused = () => {
  return animationId === null;
};


const playPauseButton = document.getElementById("play-pause");

const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
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

play();
