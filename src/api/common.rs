use std::collections::HashMap;

use rocket::serde::json::Json;

use crate::core::schema::load_schema;

#[get("/translation")]
pub async fn get_translation() -> Json<HashMap<String, String>> {
    let schema = load_schema().await.unwrap();

    Json(schema.translation)
}
