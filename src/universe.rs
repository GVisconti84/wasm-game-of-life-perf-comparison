use wasm_bindgen::prelude::*;
use crate::utils;


#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead  = 0,
    Alive = 1,
}


impl Cell {
    fn toggle(&mut self) {
        *self = match *self {
            Cell::Dead => Cell::Alive,
            Cell::Alive => Cell::Dead,
        };
    }
}




#[wasm_bindgen]
pub struct RsUniverse {
    width:  usize,
    height: usize,
    cells: Vec<Cell>,
}


impl RsUniverse {
    pub fn get_index(&self, row: usize, column: usize) -> usize {
        row * self.width + column
    }


    fn live_neighbor_count(&self, row: usize, column: usize) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }


    fn live_neighbor_count_optimized(&self, row: usize, column: usize) -> u8 {
        let mut count = 0;

        let north = if row == 0 {
            self.height - 1
        } else {
            row - 1
        };

        let south = if row == self.height - 1 {
            0
        } else {
            row + 1
        };

        let west = if column == 0 {
            self.width - 1
        } else {
            column - 1
        };

        let east = if column == self.width - 1 {
            0
        } else {
            column + 1
        };

        let nw = self.get_index(north, west);
        count += self.cells[nw] as u8;

        let n = self.get_index(north, column);
        count += self.cells[n] as u8;

        let ne = self.get_index(north, east);
        count += self.cells[ne] as u8;

        let w = self.get_index(row, west);
        count += self.cells[w] as u8;

        let e = self.get_index(row, east);
        count += self.cells[e] as u8;

        let sw = self.get_index(south, west);
        count += self.cells[sw] as u8;

        let s = self.get_index(south, column);
        count += self.cells[s] as u8;

        let se = self.get_index(south, east);
        count += self.cells[se] as u8;

        count
    }
}


/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl RsUniverse {
    pub fn new() -> RsUniverse {
        utils::set_panic_hook();

        let width = 128;
        let height = 128;

        let cells = (0..width * height)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        RsUniverse {
            width,
            height,
            cells,
        }
    }


    #[wasm_bindgen(js_name = getCells)]
    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }


    pub fn height(&self) -> usize {
        self.height
    }


    pub fn render(&self) -> String {
        self.to_string()
    }


    /// Set the height of the universe.
    ///
    /// Resets all cells to the dead state.
    #[wasm_bindgen(js_name = setHeight)]
    pub fn set_height(&mut self, height: usize) {
        self.height = height;
        self.cells = (0..self.width * height).map(|_i| Cell::Dead).collect();
    }


    /// Set the width of the universe.
    ///
    /// Resets all cells to the dead state.
    pub fn set_width(&mut self, width: usize) {
        self.width = width;
        self.cells = (0..width * self.height).map(|_i| Cell::Dead).collect();
    }


    pub fn tick(&mut self) {
        // let _timer = Timer::new("Universe::tick");
        let mut next = {
            // let _timer = Timer::new("allocate next cells");
            self.cells.clone()
        };

        {
            // let _timer = Timer::new("new generation");
            for row in 0..self.height {
                for col in 0..self.width {
                    let idx = self.get_index(row, col);
                    let cell = self.cells[idx];
                    let live_neighbors = self.live_neighbor_count_optimized(row, col);

                    /*log!(
                        "cell[{}, {}] is initially {:?} and has {} live neighbors",
                        row,
                        col,
                        cell,
                        live_neighbors
                    );*/

                    let next_cell = match (cell, live_neighbors) {
                        // Rule 1: Any live cell with fewer than two live neighbours
                        // dies, as if caused by underpopulation.
                        (Cell::Alive, x) if x < 2 => Cell::Dead,
                        // Rule 2: Any live cell with two or three live neighbours
                        // lives on to the next generation.
                        (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                        // Rule 3: Any live cell with more than three live
                        // neighbours dies, as if by overpopulation.
                        (Cell::Alive, x) if x > 3 => Cell::Dead,
                        // Rule 4: Any dead cell with exactly three live neighbours
                        // becomes a live cell, as if by reproduction.
                        (Cell::Dead, 3) => Cell::Alive,
                        // All other cells remain in the same state.
                        (otherwise, _) => otherwise,
                    };

                    // log!("    it becomes {:?}", next_cell);

                    next[idx] = next_cell;
                }
            }
        }

        // let _timer = Timer::new("free old cells");
        self.cells = next;
    }


    #[wasm_bindgen(js_name = toggleCell)]
    pub fn toggle_cell(&mut self, row: usize, column: usize) {
        let idx = self.get_index(row, column);
        self.cells[idx].toggle();
    }


    pub fn width(&self) -> usize {
        self.width
    }
}


impl RsUniverse {
    /// Get the dead and alive values of the entire universe.
    pub fn get_cells(&self) -> &[Cell] {
        &self.cells
    }


    /// Set cells to be alive in a universe by passing the row and column
    /// of each cell as an array.
    pub fn set_cells(&mut self, cells: &[(usize, usize)]) {
        for (row, col) in cells.iter().cloned() {
            let idx = self.get_index(row, col);
            self.cells[idx] = Cell::Alive;
        }
    }
}


impl Drop for RsUniverse {
    fn drop(&mut self) {
        log!("Dropping RsUniverse");
    }
}


use std::fmt;
impl fmt::Display for RsUniverse {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width) {
            for &cell in line {
                let symbol = if cell == Cell::Dead { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
