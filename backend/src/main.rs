use std::path::PathBuf;

use actix_files::NamedFile;
use actix_web::middleware::{DefaultHeaders, Logger};
use actix_web::{
    get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result as ActixResult,
};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn static_files(req: HttpRequest) -> ActixResult<NamedFile> {
    let static_path: PathBuf = PathBuf::from("../webapp/build");
    let path: PathBuf = req.match_info().query("filename").parse().unwrap();
    Ok(NamedFile::open(static_path.join(path))?)
}

async fn manual_hello() -> impl Responder {
    match NamedFile::open("../webapp/build/index.html") {
        Ok(f) => f,
        Err(_) => panic!(),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a %{User-Agent}i"))
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
            .route("/{filename:.*}", web::get().to(static_files))
            .wrap(DefaultHeaders::new().add(("X-Version", "0.2")))
            .wrap(Logger::new("%a %{User-Agent}i"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
