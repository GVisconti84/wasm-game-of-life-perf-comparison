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
  form:    HTMLFormElement
};

export type EventHandlers = {
  [key in keyof DOMElements]?: (Event) => any
};

export function extendFromRust(child: any, parent: any) {
  // TODO: add some checks.
  child.ptr = parent.ptr;
}

