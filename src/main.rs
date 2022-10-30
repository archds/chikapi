#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

pub mod api;
pub mod core;
pub mod errors;
pub mod schema;
pub mod utils;

use std::path::Path;

use crate::api::read_model::{
    static_rocket_route_info_for_get_read_models, static_rocket_route_info_for_read_model,
};
use crate::core::schema::load_schema;
use crate::schema::chikapi::Schema;
use rocket::http::Method;
use rocket::response::NamedFile;
use rocket::{get, routes};
use rocket_contrib::json::Json;
use rocket_contrib::serve::StaticFiles;
use rocket_cors::{AllowedHeaders, AllowedOrigins};

#[get("/schema")]
fn schema() -> Json<Schema> {
    return Json(load_schema().unwrap());
}

#[get("/")]
fn index() -> NamedFile {
    NamedFile::open(Path::new("app/dist/_app.html")).unwrap()
}

fn main() {
    let cors = rocket_cors::CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allowed_methods: vec![Method::Get, Method::Post, Method::Options]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .unwrap();

    rocket::ignite()
        .mount("/", routes![index, schema, read_model, get_read_models])
        .mount("/", StaticFiles::from("app/dist"))
        .attach(cors)
        .launch();
}
