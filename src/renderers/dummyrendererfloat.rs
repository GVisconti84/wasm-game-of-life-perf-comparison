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
struct RsDummyRendererFloat {
    width:  usize,
    height: usize,
    framebuffer: Vec<u8>
}


#[wasm_bindgen]
impl RsDummyRendererFloat {
    pub fn new(width: usize, height: usize) -> RsDummyRendererFloat {
        let mut r = RsDummyRendererFloat {
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
        let fb_height = self.get_framebuffer_height();
        let pitch = BPP * fb_width;

        let h_factor = 255f64 / fb_width as f64;
        let v_factor = 255f64 / fb_height as f64;


        for row in 0..fb_height {
            let row_offset = row * pitch;

            for col in 0..fb_width {
                let idx = row_offset + col * BPP;

                // self.framebuffer[idx + 0] = (255 * col / fb_width ) as u8;
                // self.framebuffer[idx + 1] = (255 * row / fb_height) as u8;
                self.framebuffer[idx + 0] = (col as f64 * h_factor) as u8;
                self.framebuffer[idx + 1] = (row as f64 * v_factor) as u8;
                self.framebuffer[idx + 2] = 0;
                self.framebuffer[idx + 3] = 255;
            }
        }
    }
}


impl RsDummyRendererFloat {
    fn get_framebuffer_width(&self) -> usize {
        self.width * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }


    fn get_framebuffer_height(&self) -> usize {
        self.height * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }
}


impl Drop for RsDummyRendererFloat {
    fn drop(&mut self) {
        log!("Dropping RsDummyRendererFloat");
    }
}