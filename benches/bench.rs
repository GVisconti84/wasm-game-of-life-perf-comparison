#![feature(test)]

extern crate test;
extern crate wasm_game_of_life_perf_comparison;


#[bench]
fn universe_ticks(b: &mut test::Bencher) {
    let mut universe = wasm_game_of_life_perf_comparison::Universe::new();

    b.iter(|| {
        universe.tick();
    });
}
