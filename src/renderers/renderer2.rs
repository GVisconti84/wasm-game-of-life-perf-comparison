use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;
use crate::universe::{RsUniverse, Cell};


const BPP: usize = 4;
// TODO: Can we centralize these constants between Js and Rs?
const CELL_SIZE: usize = 5;
const CELL_BORDER: usize = 1;
const GRID_COLOR:  &'static [u8] = &[204, 204, 204, 255];  // TODO: we might be able to optimize out the alpha channel
const DEAD_COLOR:  &'static [u8] = &[255, 255, 255, 255];
const ALIVE_COLOR: &'static [u8] = &[ 22,  22,  22, 255];


#[wasm_bindgen]
struct RsRenderer2 {
    width:  usize,
    height: usize,
    framebuffer: Vec<u8>
}


#[wasm_bindgen]
impl RsRenderer2 {
    pub fn new(width: usize, height: usize) -> RsRenderer2 {
        let mut r = RsRenderer2 {
            width, height,
            framebuffer: vec![]
        };

        r.framebuffer.resize(
            r.get_framebuffer_width() * r.get_framebuffer_height() * 4,
            255
        );

        r
    }


    #[wasm_bindgen(js_name = getFramebuffer)]
    pub fn get_framebuffer(&mut self) -> *const u8 {
        return self.framebuffer.as_ptr();
    }


    #[wasm_bindgen(js_name = setCanvasSize)]
    pub fn set_canvas_size(&self, canvas: HtmlCanvasElement) {
        canvas.set_width (self.get_framebuffer_width()  as u32);
        canvas.set_height(self.get_framebuffer_height() as u32);
    }


    pub fn render(&mut self, universe: &RsUniverse) {
        let fb_width = self.get_framebuffer_width();
        let pitch = BPP * fb_width;
        let cells = universe.get_cells();

        let mut row_offset = 0;
        // Draw the border:  TODO: see if we can fill the array more elegantly.
        // We could fill the first row and then copy here too.
        // For now I don't bother implementing it since CELL_BORDER is usually 1.
        let border_len = CELL_BORDER * pitch;
        for _i in 0..CELL_BORDER {
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
            self.framebuffer.copy_within(0..CELL_BORDER*BPP, row_offset+col_offset);

            col_offset += CELL_BORDER * BPP;

            // fill first row, and then copy over CELL_SIZE - 1 times.
            for col in 0..self.width {
                let idx = row_offset + col_offset;

                let cell_idx = universe.get_index(row as u32, col as u32);

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
                self.framebuffer.copy_within(0..CELL_BORDER*BPP, row_offset+col_offset);
                col_offset += CELL_BORDER * BPP;
            }

            for i in 1..CELL_SIZE {
                self.framebuffer.copy_within(row_offset..row_offset+pitch, row_offset + i * pitch);
            }

            row_offset += CELL_SIZE * pitch;

            // Draw horizontal grid line:
            self.framebuffer.copy_within(0..border_len, row_offset);
            row_offset += border_len;
        }
    }
}


impl RsRenderer2 {
    fn get_framebuffer_width(&self) -> usize {
        self.width * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }


    fn get_framebuffer_height(&self) -> usize {
        self.height * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }
}


impl Drop for RsRenderer2 {
    fn drop(&mut self) {
        log!("Dropping RsRenderer2");
    }
}