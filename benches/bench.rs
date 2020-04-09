#![feature(test)]

extern crate test;
extern crate wasm_game_of_life_perf_comparison;

/** To open the profile directly in XCode's Instruments, run:
        cargo +nightly instruments  --bench bench --open -- --bench

    - +nightly: because we require the "test" feature in #![feature(test)]
    - instruments: this is a tool contained in the cargo-instruments crate
    - --bench: run a benchmark
    - bench: the name of this file
    - --open: to launch Instruments immediately
    - -- to start the list of arguments to pass to the executable
    - --bench to actually run the benchmark, it needs this param.

    add --release to profile optimized build

    to obtain source mapping, adding the following to cargo.toml seems to help:
    (this should apply only to --release?)
        [profile.bench]
        opt-level=0
        debug=true
**/


#[bench]
fn universe_ticks(b: &mut test::Bencher) {
    let mut universe = wasm_game_of_life_perf_comparison::Universe::new();

    b.iter(|| {
        universe.tick();
    });
}
