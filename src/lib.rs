// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[macro_use]  // <-- unneeded, but makes CLion happy 🤷‍♂️
mod utils;
pub mod universe;
pub mod renderers;


