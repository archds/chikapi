use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;

use crate::core::JSON_PATH;
use crate::schema::chikapi::Schema;

pub fn load_schema() -> Result<Schema, String> {
    let path = PathBuf::from(JSON_PATH.to_string());
    let res: Result<Schema, String> = File::open(path)
        .map(BufReader::new)
        .map_err(|_| "Failed to open schema file!".to_string())
        .and_then(|r| {
            serde_json::from_reader(r).map_err(|_| "Failed to parse schema!".to_string())
        });

    res
}

// pub fn save_schema(schema: Schema) -> Result<_, &'static str> {
//     let path = PathBuf::from(JSON_PATH.to_string());
// }