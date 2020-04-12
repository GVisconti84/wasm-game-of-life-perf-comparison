import { Size, Position } from '../common';
import { Universe } from '../Universe';


export const CELL_SIZE   =  5; // px
export const GRID_COLOR  = '#CCCCCC';
export const DEAD_COLOR  = '#FFFFFF';
export const ALIVE_COLOR = '#000000';


export interface Renderer {
  getCellAt(x: number, y: number): Position;
  render(universe: Universe): void;
  destroy(): void;
}
