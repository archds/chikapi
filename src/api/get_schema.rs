use rocket::serde::json::Json;

use crate::core::schema::load_schema;
use crate::schema::chikapi::Schema;
use crate::ApplicationError;

#[get("/schema")]
pub async fn schema() -> Result<Json<Schema>, ApplicationError> {
    load_schema().await.map(Json)
}
