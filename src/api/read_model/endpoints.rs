use std::collections::HashMap;

use rocket::http::Status;

use rocket::serde::json::Json;
use serde_json::Value;

use crate::core::schema::{load_schema, save_schema};
use crate::ApplicationError;

use crate::schema::chikapi::{QueryParameter, ReadModel};
use crate::utils::{complex_map_get, get_read_model_by_id};

use super::types::{RMResponse, RMSchemaResponse};

fn get_data(
    rm: ReadModel,
    root_url: String,
    _headers: HashMap<String, String>,
    overwrite_params: Option<Vec<QueryParameter>>,
) -> Result<Value, ApplicationError> {
    let path = {
        let mut path = String::from(rm.path);
        let mut path_parameters = String::new();
        let actual_parameters = overwrite_params.unwrap_or(rm.parameters);
        for param in actual_parameters {
            match param {
                QueryParameter::Path(v) => path.push_str(format!("/{}", v.value).as_str()),
                QueryParameter::Query(v) => {
                    path_parameters.push_str(format!("{}={}&", v.key, v.value).as_str())
                }
                QueryParameter::Body(_) => {}
            }
        }
        format!(
            "{}?{}",
            path,
            path_parameters.strip_suffix("&").unwrap_or("")
        )
    };

    let resp = reqwest::blocking::get(format!("{}/{}", &root_url, &path).as_str()).unwrap();

    match resp.json::<Value>() {
        Ok(val) => Ok(val),
        Err(_) => Err(ApplicationError::DataLoadingError("Failed to load data!")),
    }
}

#[get("/rm/<id>")]
pub async fn get_read_model(id: String) -> Result<Json<RMResponse>, ApplicationError> {
    load_schema()
        .await
        .and_then(|schema| get_read_model_by_id(&id, &schema.read_models).map(|v| (v, schema)))
        .and_then(|(read_model, schema)| {
            get_data(
                read_model.clone(),
                schema.url,
                schema.headers.unwrap_or_default(),
                None,
            )
            .map(|v| (v, read_model))
        })
        .map(|(data, read_model)| {
            let data = match data {
                Value::Object(obj) => read_model
                    .root_key
                    .as_ref()
                    .map(|k| complex_map_get(k, &obj))
                    .unwrap_or(Value::Object(obj)),
                _ => data,
            };

            (data, read_model)
        })
        .map(|(data, read_model)| RMResponse::new(data, &read_model))
        .map(Json)
}

#[get("/rms")]
pub async fn get_read_models() -> Result<Json<Vec<RMSchemaResponse>>, ApplicationError> {
    load_schema()
        .await
        .map(|schema| {
            schema
                .read_models
                .iter()
                .map(|rm| RMSchemaResponse {
                    id: rm.id.clone(),
                    name: rm.name.clone(),
                })
                .collect()
        })
        .map(Json)
}

#[post("/add_read_model", data = "<rm>")]
pub async fn add_read_model(rm: Json<ReadModel>) -> Result<Status, ApplicationError> {
    load_schema()
        .map(|mut schema| {
            schema.read_models.push(rm.into_inner());
            schema
        })
        .and_then(save_schema)
        .map(|_| Status::Accepted)
}
