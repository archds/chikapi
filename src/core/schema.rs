use std::path::PathBuf;

use rocket::futures::TryFutureExt;
use rocket::tokio::fs::File;
use rocket::tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};

use crate::core::JSON_PATH;
use crate::schema::chikapi::Schema;
use crate::ApplicationError;

pub async fn load_schema() -> Result<Schema, ApplicationError> {
    let path = PathBuf::from(JSON_PATH.to_string());
    let res: Result<Schema, &'static str> = File::open(path)
        .await
        .map(|mut f| {
            let mut buffer = String::new();
            f.read_to_string(&mut buffer);
            buffer
        })
        .map_err(|_| "Failed to open schema!")
        .and_then(|buffer| {
            serde_json::from_str(buffer.as_ref()).map_err(|_| "Failed to parse schema!")
        });

    res.map_err(|e| ApplicationError::LoadSchemaError(e))
}

pub async fn save_schema(schema: Schema) -> Result<(), ApplicationError> {
    let path = PathBuf::from(JSON_PATH.to_string());
    let res = File::create(path)
        .map_err(|_| "Failed to save schema!")
        .await
        .and_then(|file| {
            serde_json::to_string(&schema)
                .map_err(|_| "Failed to serialize schema!")
                .map(|raw| (raw, file))
        })
        .map_err(|e| ApplicationError::SchemaPersistingError(e));

    match res {
        Ok((raw, mut file)) => file
            .write_all(raw.as_bytes())
            .await
            .map(|_| ())
            .map_err(|_| ApplicationError::SchemaPersistingError("Failed to save schema!")),
        Err(e) => Err(e),
    }
}
