use std::collections::HashMap;

use rocket::http::Status;

use rocket_contrib::json::Json;

use serde_json::{Map, Value};

use crate::api::response::{RMResponse, RMSchemaResponse, ResponseRenderAs};
use crate::core::schema::load_schema;

use crate::schema::chikapi::{QueryParameter, ReadModel, ReadModelStyle};
use crate::utils::{complex_map_get, get_read_model_by_id};

fn get_data(
    rm: ReadModel,
    root_url: String,
    _headers: HashMap<String, String>,
    overwrite_params: Option<Vec<QueryParameter>>,
) -> Result<Value, String> {
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
    // let headers = {
    //     let h = Headers::new();

    //     for (k, v) in headers {
    //         h.set(k.as_str(), v.as_str())
    //     }

    //     h
    // };

    // req = req.headers(headers);

    // let resp = req.send().await.unwrap();

    match resp.json::<Value>() {
        Ok(val) => Ok(val),
        Err(_) => Err("Read model fetching error".to_string()),
    }
}

fn build_object_key_fields(rm: &ReadModel, obj: &Map<String, Value>) -> Value {
    rm.key_fields
        .iter()
        .map(|kf| {
            let mut res = Map::new();
            res.insert("value".to_string(), complex_map_get(&kf.key, &obj));
            res.insert(
                "prefix".to_string(),
                kf.prefix
                    .as_ref()
                    .map_or(Value::Null, |p| Value::String(p.clone())),
            );
            (kf.key.clone(), res)
        })
        .collect::<Value>()
}

#[get("/rm/<id>")]
pub fn read_model(id: String) -> Result<Json<RMResponse>, Status> {
    let schema = load_schema().unwrap();
    let read_model = get_read_model_by_id(&id, &schema.read_models).unwrap();

    let data = get_data(
        read_model.clone(),
        schema.url,
        schema.headers.unwrap_or_default(),
        None,
    )
    .unwrap();

    let response_data = match data {
        Value::Object(obj) => read_model
            .root_key
            .as_ref()
            .map(|k| complex_map_get(k, &obj))
            .unwrap_or(Value::Object(obj)),
        _ => data,
    };

    let response_data = match response_data {
        Value::Object(obj) => build_object_key_fields(&read_model, &obj),
        Value::Array(arr) => arr
            .iter()
            .map(|arr_item| match arr_item {
                Value::Object(obj) => build_object_key_fields(&read_model, &obj),
                _ => arr_item.clone(),
            })
            .collect(),
        _ => response_data,
    };

    let render_as = match response_data {
        Value::Object(_) => ResponseRenderAs::Object,
        Value::Array(_) => match read_model.style {
            Some(ReadModelStyle::LIST) => ResponseRenderAs::List,
            Some(ReadModelStyle::TABLE) => ResponseRenderAs::Table,
            None => ResponseRenderAs::List,
        },
        _ => ResponseRenderAs::Simple,
    };

    Ok(Json(RMResponse::new(response_data, render_as)))
}

#[get("/rms")]
pub fn get_read_models() -> Json<Vec<RMSchemaResponse>> {
    let schema = load_schema().unwrap();

    let response: Vec<RMSchemaResponse> = schema
        .read_models
        .iter()
        .map(|rm| RMSchemaResponse {
            id: rm.id.clone(),
            name: rm.name.clone(),
        })
        .collect();

    Json(response)
}
