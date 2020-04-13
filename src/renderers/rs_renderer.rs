use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;
use crate::renderers::consts::*;


#[wasm_bindgen]
pub struct RsRenderer {
    pub(super) width:  usize,
    pub(super) height: usize,
    pub(super) framebuffer: Vec<u8>
}


#[wasm_bindgen]
impl RsRenderer {
    pub fn new(width: usize, height: usize) -> RsRenderer {
        let mut r = RsRenderer {
            width, height,
            framebuffer: vec![]
        };

        r.framebuffer.resize(r.get_framebuffer_len(), 255);
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
}


impl RsRenderer {
    pub(super) fn get_framebuffer_len(&self) -> usize {
        self.get_framebuffer_width() * self.get_framebuffer_height() * 4
    }


    pub(super) fn get_framebuffer_width(&self) -> usize {
        self.width * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }


    pub(super) fn get_framebuffer_height(&self) -> usize {
        self.height * (CELL_SIZE + CELL_BORDER) + CELL_BORDER
    }
}


impl Drop for RsRenderer {
    fn drop(&mut self) {
        log!("Dropping RsRenderer1");
    }
}