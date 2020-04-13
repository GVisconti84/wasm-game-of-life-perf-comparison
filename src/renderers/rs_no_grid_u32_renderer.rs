use crate::universe::{RsUniverse, Cell};
use super::RsRenderer;
use super::consts::*;


const DEAD_COLOR_U32:  u32 =
        ((DEAD_COLOR [3] as u32) << 24) +
        ((DEAD_COLOR [2] as u32) << 16) +
        ((DEAD_COLOR [1] as u32) <<  8) +
        ((DEAD_COLOR [0] as u32) <<  0);
const ALIVE_COLOR_U32: u32 =
        ((ALIVE_COLOR[3] as u32) << 24) +
        ((ALIVE_COLOR[2] as u32) << 16) +
        ((ALIVE_COLOR[1] as u32) <<  8) +
        ((ALIVE_COLOR[0] as u32) <<  0);


pub trait RsNoGridU32Renderer {
    fn new_filled(width: usize, height: usize) -> Self;
    fn render(&mut self, universe: &RsUniverse);
}


impl RsNoGridU32Renderer for RsRenderer {
    fn new_filled(width: usize, height: usize) -> RsRenderer {
        let mut r = RsRenderer::new(width, height);

        let mut idx = 0;
        for _i in 0..r.get_framebuffer_len() / BPP {
            r.framebuffer[idx + 0] = GRID_COLOR[0];
            r.framebuffer[idx + 1] = GRID_COLOR[1];
            r.framebuffer[idx + 2] = GRID_COLOR[2];
            r.framebuffer[idx + 3] = GRID_COLOR[3];
            idx += BPP;
        }

        r
    }


    fn render(&mut self, universe: &RsUniverse) {
        let cells = universe.get_cells();
        let pitch = self.get_framebuffer_width();

        let framebuffer;
        unsafe {
            let (_, f, _) = self.framebuffer.align_to_mut::<u32>();
            framebuffer = f;
        }

        let mut cell_offset = GRID_SIZE * pitch;

        for row in 0..self.height {
            cell_offset += GRID_SIZE;

            for col in 0..self.width {
                let color = match cells[universe.get_index(row, col)] {
                    Cell::Dead  => DEAD_COLOR_U32,
                    Cell::Alive => ALIVE_COLOR_U32,
                };

                for i in 0..CELL_SIZE {
                    framebuffer[cell_offset + i] = color;
                }

                for i in 1..CELL_SIZE {
                    framebuffer.copy_within(
                        cell_offset..cell_offset + CELL_SIZE,
                        cell_offset + i * pitch
                    );
                }


                cell_offset += CELL_SIZE + GRID_SIZE;
            }

            cell_offset += (CELL_SIZE-1 + GRID_SIZE) * pitch;
        }

        // let cells = universe.get_cells();
        // let fb_width  = self.get_framebuffer_width();
        // let fb_height = self.get_framebuffer_height();
        // let pitch     = fb_width * BPP;
        //
        // let mut row = 0;
        // let mut drawn_rows = 0;
        //
        // let mut cell_offset = GRID_SIZE * pitch;
        //
        // for y in 0..fb_height-((self.height + 1) * GRID_SIZE) {
        //     cell_offset += GRID_SIZE * BPP;
        //
        //     for col in 0..self.width {
        //         let color = match cells[self.width * row + col] {
        //             Cell::Dead  => DEAD_COLOR,
        //             Cell::Alive => ALIVE_COLOR,
        //         };
        //
        //         for i in 0..CELL_SIZE {
        //             self.framebuffer[cell_offset + i * BPP + 0] = color[0];
        //             self.framebuffer[cell_offset + i * BPP + 1] = color[1];
        //             self.framebuffer[cell_offset + i * BPP + 2] = color[2];
        //             // Skip the alpha channel, it's always 255.
        //         }
        //
        //
        //         cell_offset += (CELL_SIZE + GRID_SIZE) * BPP;
        //     }
        //
        //     drawn_rows += 1;
        //     if drawn_rows == CELL_SIZE {
        //         row += 1;
        //         drawn_rows = 0;
        //         cell_offset += GRID_SIZE * pitch;
        //     }
        // }
    }
}