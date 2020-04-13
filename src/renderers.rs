use wasm_bindgen::prelude::*;
use crate::universe::RsUniverse;

mod rs_renderer;
mod rs_dummy_renderer_float;
mod rs_renderer_1;
mod rs_renderer_2;
mod rs_no_border_renderer;
mod rs_no_border_u32_renderer;

pub mod consts;
pub use rs_renderer::*;


#[wasm_bindgen(js_name = dummyRenderFloat)]
pub fn dummy_render_float(r: &mut RsRenderer, u: &RsUniverse) {
    use rs_dummy_renderer_float::*;
    r.render(u);
}

#[wasm_bindgen]
pub fn render1(r: &mut RsRenderer, u: &RsUniverse) {
    use rs_renderer_1::*;
    r.render(u);
}

#[wasm_bindgen]
pub fn render2(r: &mut RsRenderer, u: &RsUniverse) {
    use rs_renderer_2::*;
    r.render(u);
}

#[wasm_bindgen(js_name = noBorderNew)]
pub fn no_border_new(width: usize, height: usize) -> RsRenderer {
    use rs_no_border_renderer::*;
    RsRenderer::new_filled(width, height)
}

#[wasm_bindgen(js_name = noBorderRender)]
pub fn no_border_render(r: &mut RsRenderer, u: &RsUniverse) {
    use rs_no_border_renderer::*;
    r.render(u);
}

#[wasm_bindgen(js_name = noBorderU32New)]
pub fn no_border_u32_new(width: usize, height: usize) -> RsRenderer {
    use rs_no_border_u32_renderer::*;
    RsRenderer::new_filled(width, height)
}

#[wasm_bindgen(js_name = noBorderU32Render)]
pub fn no_border_u32_render(r: &mut RsRenderer, u: &RsUniverse) {
    use rs_no_border_u32_renderer::*;
    r.render(u);
}
