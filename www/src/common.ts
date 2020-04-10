export type Size = {
  width:  number,
  height: number,
};

export type Position = {
  row: number,
  col: number
}

export type DOMElements = {
  canvas:  HTMLCanvasElement,
  playBtn: HTMLButtonElement,
  perf:    HTMLElement,
};

export type EventHandlers = {
  [key in keyof DOMElements]?: (Event) => any
};

