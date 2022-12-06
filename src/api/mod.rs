use std::path::Path;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::fs::{NamedFile, FileServer};
use rocket::http::{Method, Header};
use rocket::{Rocket, Request, Response, Build};

mod common;
mod get_schema;
mod read_model;

#[get("/")]
async fn index() -> NamedFile {
    NamedFile::open(Path::new("app/dist/_app.html")).await.unwrap()
}

#[catch(404)]
async fn not_found(_: &Request<'_>) -> NamedFile {
    NamedFile::open(Path::new("app/dist/_app.html")).await.unwrap()
}

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

pub fn get_app() -> Rocket<Build> {
    rocket::build()
        .mount(
            "/chikapi",
            routes![
                // index,
                read_model::get_read_models,
                read_model::get_read_model,
                read_model::add_read_model,
                common::get_translation,
                get_schema::schema
            ],
        )
        .mount("/", routes![index])
        .mount("/", FileServer::from("app/dist"))
        .register("/", catchers![not_found])
        .attach(CORS)
}
