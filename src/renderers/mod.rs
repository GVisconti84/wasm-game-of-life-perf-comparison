use wasm_bindgen::prelude::*;
use crate::universe::RsUniverse;

mod renderer;
mod dummyrendererfloat;
mod renderer1;
mod renderer2;

pub mod consts;
pub use renderer::*;


#[wasm_bindgen(js_name = dummyRenderFloat)]
pub fn dummy_render_float(r: &mut RsRenderer, u: &RsUniverse) {
    use dummyrendererfloat::*;
    r.render(u);
}

#[wasm_bindgen]
pub fn render1(r: &mut RsRenderer, u: &RsUniverse) {
    use renderer1::*;
    r.render(u);
}

#[wasm_bindgen]
pub fn render2(r: &mut RsRenderer, u: &RsUniverse) {
    use renderer2::*;
    r.render(u);
}
