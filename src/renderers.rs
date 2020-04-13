use wasm_bindgen::prelude::*;
use crate::universe::RsUniverse;

mod rs_renderer;
mod rs_dummy_renderer_float;
mod rs_renderer_1;
mod rs_renderer_2;

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
