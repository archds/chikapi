#[macro_use]
extern crate rocket;

mod api;
pub mod core;
mod errors;
pub mod schema;
pub mod utils;

pub use errors::ApplicationError;

use self::api::get_app;

#[launch]
fn rocket() -> _ {
    get_app()
}
