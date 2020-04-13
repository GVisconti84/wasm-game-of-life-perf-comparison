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
struct RsRenderer1 {
    width:  usize,
    height: usize,
    framebuffer: Vec<u8>
}


#[wasm_bindgen]
impl RsRenderer1 {
    pub fn new(width: usize, height: usize) -> RsRenderer1 {
        let mut r = RsRenderer1 {
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
            let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
            r[0..CELL_BORDER*BPP].copy_from_slice(&l[0..CELL_BORDER*BPP]);

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
                let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
                r[0..CELL_BORDER*BPP].copy_from_slice(&l[0..CELL_BORDER*BPP]);
                col_offset += CELL_BORDER * BPP;
            }

            let block = &mut self.framebuffer[row_offset..row_offset+CELL_SIZE*pitch];
            let (l, r) = block.split_at_mut(pitch);
            for i in 1..CELL_SIZE {
                r[(i-1)*pitch..i*pitch].copy_from_slice(&l);
            }

            row_offset += CELL_SIZE * pitch;

            // Draw horizontal grid line:
            let (l, r) = self.framebuffer.split_at_mut(row_offset);
            r[0..border_len].copy_from_slice(&l[0..border_len]);
            row_offset += border_len;
        }
    }
}


impl RsRenderer1 {
    fn get_framebuffer_width(&self) -> usize {
        self.width * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }


    fn get_framebuffer_height(&self) -> usize {
        self.height * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }
}


impl Drop for RsRenderer1 {
    fn drop(&mut self) {
        log!("Dropping RsRenderer1");
    }
}