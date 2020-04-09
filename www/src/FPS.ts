export class FPS {
  private fps: HTMLElement;
  private frames: number[] = [];
  private lastFrameTimeStamp: number = performance.now();

  private loopDurationsAveragingBuffer: number[] = [];
  private loopStartTimeStamp: number;


  constructor() {
    this.fps = document.getElementById("fps");


    this.loopDurationsAveragingBuffer = [];
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let loopDuration = now - this.loopStartTimeStamp;
    this.loopDurationsAveragingBuffer.push(loopDuration);
    if (this.loopDurationsAveragingBuffer.length > 100) {
      this.loopDurationsAveragingBuffer.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    let avgLoopDuration = this.loopDurationsAveragingBuffer
            .reduce((memo, t) => memo + t, 0)
        / this.loopDurationsAveragingBuffer.length;

    // Render the statistics.
    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}

Game Loop Duration: ${avgLoopDuration.toFixed(2)}ms (≅ ${Math.round(1000 / avgLoopDuration)} fps)
`.trim();
  }

  loopIterationStarted() {
    this.loopStartTimeStamp = performance.now();
  }
}
