use rocket::response::Responder;

pub type ErrText = &'static str;

#[derive(Responder, Debug)]
pub enum ApplicationError {
    #[response(status = 500)]
    LoadSchemaError(ErrText),
    ReadModelNotFound(ErrText),
    DataLoadingError(ErrText),
    SchemaPersistingError(ErrText),
}
