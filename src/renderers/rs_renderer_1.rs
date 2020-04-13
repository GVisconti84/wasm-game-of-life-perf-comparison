use crate::universe::{RsUniverse, Cell};
use super::consts::*;
use super::RsRenderer;

pub trait RsRenderer1 {
    fn render(&mut self, universe: &RsUniverse);
}


impl RsRenderer1 for RsRenderer {
    fn render(&mut self, universe: &RsUniverse) {
        let fb_width = self.get_framebuffer_width();
        let pitch = BPP * fb_width;
        let cells = universe.get_cells();

        let mut row_offset = 0;
        // Draw the grid:  TODO: see if we can fill the array more elegantly.
        // We could fill the first row and then copy here too.
        // For now I don't bother implementing it since GRID_SIZE is usually 1.
        let grid_len = GRID_SIZE * pitch;
        for _i in 0..GRID_SIZE {
            for j in 0..fb_width {
                let idx = row_offset + j * BPP;
                self.framebuffer[idx..idx+BPP].copy_from_slice(GRID_COLOR);
            }
            row_offset += pitch;
        }

        for row in 0..self.height {
            let mut col_offset = 0;

            // Draw vertical grid line
            //  we cheat a little bit: we copy from the beginning of the framebuffer.
            let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
            r[0..GRID_SIZE *BPP].copy_from_slice(&l[0..GRID_SIZE *BPP]);

            col_offset += GRID_SIZE * BPP;

            // fill first row, and then copy over CELL_SIZE - 1 times.
            for col in 0..self.width {
                let idx = row_offset + col_offset;

                let cell_idx = universe.get_index(row, col);

                let mut byte_offset = 0;  // TODO: we probably don't need three different offsets.
                for _i in 0..CELL_SIZE {
                    self.framebuffer[idx+byte_offset..idx+byte_offset+BPP].copy_from_slice(
                        match cells[cell_idx] {
                            Cell::Dead  => DEAD_COLOR,
                            Cell::Alive => ALIVE_COLOR
                        }
                    );

                    byte_offset += BPP;
                }
                col_offset += CELL_SIZE * BPP;

                // Draw vertical grid line
                //  we cheat a little bit: we copy from the beginning of the framebuffer.
                let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
                r[0..GRID_SIZE *BPP].copy_from_slice(&l[0..GRID_SIZE *BPP]);
                col_offset += GRID_SIZE * BPP;
            }

            let block = &mut self.framebuffer[row_offset..row_offset+CELL_SIZE*pitch];
            let (l, r) = block.split_at_mut(pitch);
            for i in 1..CELL_SIZE {
                r[(i-1)*pitch..i*pitch].copy_from_slice(&l);
            }

            row_offset += CELL_SIZE * pitch;

            // Draw horizontal grid line:
            let (l, r) = self.framebuffer.split_at_mut(row_offset);
            r[0..grid_len].copy_from_slice(&l[0..grid_len]);
            row_offset += grid_len;
        }
    }
}
