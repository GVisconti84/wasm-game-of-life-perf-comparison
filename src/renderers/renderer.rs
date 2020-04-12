use wasm_bindgen::prelude::*;
use crate::universe::{RsUniverse, Cell};


const BPP: usize = 4;
// TODO: Can we centralize these constants between Js and Rs?
const CELL_SIZE: usize = 5;
const CELL_BORDER: usize = 1;
const GRID_COLOR:  &'static [u8] = &[204, 204, 204, 255];  // TODO: we might be able to optimize out the alpha channel
const DEAD_COLOR:  &'static [u8] = &[255, 255, 255, 255];
const ALIVE_COLOR: &'static [u8] = &[ 22,  22,  22, 255];


#[wasm_bindgen]
struct RsRenderer {
    width:  usize,
    height: usize,
    framebuffer: Vec<u8>
}


#[wasm_bindgen]
impl RsRenderer {
    pub fn new(width: usize, height: usize) -> RsRenderer {
        RsRenderer {
            width, height,
            framebuffer: vec![]
        }
    }


    #[wasm_bindgen(js_name = getFramebuffer)]
    pub fn get_framebuffer(&mut self) -> *const u8 {
        if self.framebuffer.len() == 0 {
            log!("Init framebuffer");
            self.framebuffer = vec![];
            self.framebuffer.resize(self.get_framebuffer_len(), 255);
            self.framebuffer[0] = 255;
            self.framebuffer[1] = 0;
            self.framebuffer[2] = 0;
            self.framebuffer[3] = 255;
        }

        return self.framebuffer.as_ptr();
    }


    #[wasm_bindgen(js_name = getFramebufferLen)]
    pub fn get_framebuffer_len(&self) -> usize {
        self.get_framebuffer_width() * self.get_framebuffer_height() * BPP
    }


    #[wasm_bindgen(js_name = getFramebufferWidth)]
    pub fn get_framebuffer_width(&self) -> usize {
        self.width * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }


    #[wasm_bindgen(js_name = getFramebufferHeight)]
    pub fn get_framebuffer_height(&self) -> usize {
        self.height * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    #[wasm_bindgen(js_name = setCanvasSize)]
    pub fn set_canvas_size(&self, canvas: HtmlCanvasElement) {
        canvas.set_width(self.width   as u32);
        canvas.set_height(self.height as u32);
    }


    pub fn render(&mut self, universe: &RsUniverse) {
        // log!("painting.");
        // let f_width = self.get_framebuffer_width();
        // let f_height = self.get_framebuffer_height();
        // let pitch = BPP * f_width;
        //
        // let h_factor = 255f64 / f_width  as f64;
        // let v_factor = 255f64 / f_height as f64;
        //
        // for row in 0..f_height {
        //     let row_offset = row * pitch;
        //
        //     for col in 0..f_width {
        //         let idx = row_offset + col * BPP;
        //
        //         // self.framebuffer[idx + 0] = (255 * col / f_width ) as u8;
        //         // self.framebuffer[idx + 1] = (255 * row / f_height) as u8;
        //         self.framebuffer[idx + 0] = 255;  // (col as f64 * h_factor ) as u8;
        //         self.framebuffer[idx + 1] = 255;  // (row as f64 * v_factor) as u8;
        //         self.framebuffer[idx + 2] = 0;
        //         self.framebuffer[idx + 3] = 255;
        //     }
        // }
        let cells = universe.get_cells();

        let pitch = BPP * self.get_framebuffer_width();

        let mut row_offset = 0;
        // Draw the border:  TODO: see if we can fill the array more elegantly.
        // We could fill the first row and then copy here too.
        // For now I don't bother implementing it since CELL_BORDER is usually 1.
        let border_len = CELL_BORDER * pitch;
        for _i in 0..CELL_BORDER {
            for j in 0..self.get_framebuffer_width() {
                let idx = row_offset + j * BPP;
                self.framebuffer[idx..idx+BPP].copy_from_slice(GRID_COLOR);
            }
            row_offset += pitch;
        }

        for row in 0..self.height {
            let mut col_offset = 0;

            // Draw vertical grid line
            //  we cheat a little bit: we copy from the beginning of the framebuffer.
            // let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
            // r[0..CELL_BORDER*BPP].copy_from_slice(&l[0..CELL_BORDER*BPP]);
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
                // let (l, r) = self.framebuffer.split_at_mut(row_offset+col_offset);
                // r[0..CELL_BORDER*BPP].copy_from_slice(&l[0..CELL_BORDER*BPP]);
                self.framebuffer.copy_within(0..CELL_BORDER*BPP, row_offset+col_offset);
                col_offset += CELL_BORDER * BPP;
            }

            // let block = &mut self.framebuffer[row_offset..row_offset+CELL_SIZE*pitch];
            // let (l, r) = block.split_at_mut(pitch);
            for i in 1..CELL_SIZE {
                // r[(i-1)*pitch..i*pitch].copy_from_slice(&l);
                self.framebuffer.copy_within(row_offset..row_offset+pitch, row_offset + i * pitch);
            }

            row_offset += CELL_SIZE * pitch;

            // Draw horizontal grid line:
            // let (l, r) = self.framebuffer.split_at_mut(row_offset);
            // r[0..border_len].copy_from_slice(&l[0..border_len]);
            self.framebuffer.copy_within(0..border_len, row_offset);
            row_offset += border_len;
        }
    }
}


impl Drop for RsRenderer {
    fn drop(&mut self) {
        log!("Dropping RsRenderer");
    }
}