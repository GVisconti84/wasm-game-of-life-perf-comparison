use crate::universe::RsUniverse;
use crate::renderers::{RsRenderer};
use crate::renderers::consts::*;



pub trait RsDummyRendererFloat {
    fn render(&mut self, universe: &RsUniverse);
}


impl RsDummyRendererFloat for RsRenderer {
    fn render(&mut self, universe: &RsUniverse) {
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
