use rocket::http::Method;
use rocket::Rocket;
use rocket_contrib::serve::StaticFiles;
use rocket_cors::{AllowedHeaders, AllowedOrigins};

mod common;
mod get_schema;
mod read_model;

// #[get("/")]
// fn index() -> NamedFile {
//     NamedFile::open(Path::new("app/dist/_app.html")).unwrap()
// }

pub fn get_app() -> Rocket {
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
        .mount("/", StaticFiles::from("app/dist"))
        .attach(cors)
}
