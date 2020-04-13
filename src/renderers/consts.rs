pub const BPP: usize = 4;
// TODO: Can we centralize these constants between Js and Rs?
pub const CELL_SIZE:   usize = 5;
pub const CELL_BORDER: usize = 1;
pub const GRID_COLOR:  &'static [u8] = &[204, 204, 204, 255];  // TODO: we might be able to optimize out the alpha channel
pub const DEAD_COLOR:  &'static [u8] = &[255, 255, 255, 255];
pub const ALIVE_COLOR: &'static [u8] = &[ 22,  22,  22, 255];