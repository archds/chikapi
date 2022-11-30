#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use]
extern crate rocket;

mod api;
pub mod core;
mod errors;
pub mod schema;
pub mod utils;

pub use errors::ApplicationError;

use self::api::get_app;

fn main() {
    get_app().launch();
}
