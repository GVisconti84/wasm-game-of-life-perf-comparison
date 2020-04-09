const MAX_BUFFER_LEN = 100;

export class FPS {
  private fpsAveragingBuffer: number[] = [];
  private lastFrameTimestamp: number = performance.now();

  private loopDurationsAveragingBuffer: number[] = [];
  private loopStartTimestamp: number;



  constructor(private readonly  htmlElement: HTMLElement) {}


  public loopIterationEnded() {
    const now = performance.now();

    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const frameDuration = now - this.lastFrameTimestamp;
    const loopDuration  = now - this.loopStartTimestamp;
    this.lastFrameTimestamp = now;

    const fps = 1 / frameDuration * 1000;

    // Save only the latest 100 timings.
    this.fpsAveragingBuffer.push(fps);
    if (this.fpsAveragingBuffer.length > MAX_BUFFER_LEN) {
      this.fpsAveragingBuffer.shift();
    }

    this.loopDurationsAveragingBuffer.push(loopDuration);
    if (this.loopDurationsAveragingBuffer.length > MAX_BUFFER_LEN) {
      this.loopDurationsAveragingBuffer.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    const min = Math.min(...this.fpsAveragingBuffer);
    const max = Math.max(...this.fpsAveragingBuffer);
    const mean = this.fpsAveragingBuffer
            .reduce((memo, v) => memo + v, 0)
            / this.fpsAveragingBuffer.length;
    let avgLoopDuration = this.loopDurationsAveragingBuffer
            .reduce((memo, v) => memo + v, 0)
             / this.loopDurationsAveragingBuffer.length;

    // Render the statistics.
    this.htmlElement.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}

Game Loop Duration: ${avgLoopDuration.toFixed(2)}ms (≅ ${Math.round(1000 / avgLoopDuration)} fps)
`.trim();
  }


  public loopIterationStarted() {
    this.loopStartTimestamp = performance.now();
  }
}
