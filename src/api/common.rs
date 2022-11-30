use std::collections::HashMap;

use rocket_contrib::json::Json;

use crate::core::schema::load_schema;

#[get("/translation")]
pub fn get_translation() -> Json<HashMap<String, String>> {
    let schema = load_schema().unwrap();

    Json(schema.translation)
}
