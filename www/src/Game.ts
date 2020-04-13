import { DOMElements, EventHandlers } from './common';
import { GameLoop } from './GameLoop';
import {
  WASMDummyRendererFloat,
  WASMNoBorderRenderer,
  WASMNoBorderU32Renderer,
  WASMRenderer1,
  WASMRenderer2
} from './renderers/WASMRenderers';
import { Universe } from './Universe';
import { JSRenderer } from './renderers/JSRenderer';
import { JSOptimizedRenderer } from './renderers/JSOptimizedRenderer';


const RendererClass = {
  'WASMNoBorderU32Renderer': WASMNoBorderU32Renderer,
  'WASMNoBorderRenderer':    WASMNoBorderRenderer,
  'WASMRenderer2':           WASMRenderer2,
  'WASMRenderer1':           WASMRenderer1,
  'WASMDummyRendererFloat':  WASMDummyRendererFloat,
  'JSOptimizedRenderer':     JSOptimizedRenderer,
  'JSRenderer':              JSRenderer,
}


export class Game extends GameLoop {
  private readonly domElements: DOMElements
  private readonly handlers:    EventHandlers;


  constructor(domElements: DOMElements) {
    const universe = new Universe();

    let form = domElements.form;
    const Renderer = RendererClass[Game.getFormValue(form, 'renderer')];
    const renderer = new Renderer(domElements.canvas, universe.getSize());

    super(universe, renderer);

    this.domElements = domElements;
    this.handlers    = {};
    this.registerEventHandlers();
  }


  private static getFormValue(form, fieldName) {
    let formData = new FormData(form);
    return formData.get(fieldName) as string;
  }


  private onRendererChanged(newRenderer) {
    this.renderer.destroy();
    const Renderer = RendererClass[newRenderer];
    this.renderer = new Renderer(this.domElements.canvas, this.universe.getSize())
  }


  private registerEventHandlers() {
    let {canvas, playBtn, form} = this.domElements;

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

    form.addEventListener('change', this.handlers.form = event => {
      let changedField = event.target.name;
      let newValue     = Game.getFormValue(form, changedField);
      switch (event.target.name) {
        case 'renderer':
          this.onRendererChanged(newValue);
      }
    });
  }


  private unregisterEventHandlers(): void {
    this.domElements.canvas .removeEventListener('click', this.handlers.canvas);
    this.domElements.playBtn.removeEventListener('click', this.handlers.playBtn);
    this.domElements.form   .removeEventListener('click', this.handlers.form);
  }


  destroy() {
    this.unregisterEventHandlers();
    this.universe.destroy();
    this.renderer.destroy();
    super.destroy();
  }
}
