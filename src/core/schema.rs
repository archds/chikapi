use std::fs::File;
use std::io::{BufReader, Write};
use std::path::PathBuf;

use crate::core::JSON_PATH;
use crate::schema::chikapi::Schema;
use crate::ApplicationError;

pub fn load_schema() -> Result<Schema, ApplicationError> {
    let path = PathBuf::from(JSON_PATH.to_string());
    let res: Result<Schema, &'static str> = File::open(path)
        .map(BufReader::new)
        .map_err(|_| "Failed to open schema!")
        .and_then(|r| serde_json::from_reader(r).map_err(|_| "Failed to parse schema!"));

    res.map_err(|e| ApplicationError::LoadSchemaError(e))
}

pub fn save_schema(schema: Schema) -> Result<(), ApplicationError> {
    let path = PathBuf::from(JSON_PATH.to_string());

    Ok(path)
        .and_then(File::create)
        .map_err(|_| "Failed to save schema!")
        .and_then(|file| {
            serde_json::to_string(&schema)
                .map_err(|_| "Failed to serialize schema!")
                .map(|raw| (raw, file))
        })
        .and_then(|(raw, mut file)| {
            file.write_all(raw.as_bytes())
                .map_err(|_| "failed to save schema!")
        })
        .map_err(|e| ApplicationError::SchemaPersistingError(e))
}
