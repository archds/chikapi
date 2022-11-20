use std::collections::HashMap;

use rocket::http::Status;

use rocket_contrib::json::Json;

use serde_json::{Map, Value};

use crate::api::response::{ObjectData, RMArrayItem, RMResponse, RMResponseItem, RMSchemaResponse};
use crate::core::schema::{load_schema, save_schema};

use crate::schema::chikapi::{QueryParameter, ReadModel, ReferenceParameter};
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

    match resp.json::<Value>() {
        Ok(val) => Ok(val),
        Err(_) => Err("Read model fetching error".to_string()),
    }
}

fn build_object_key_fields_as_vec(rm: &ReadModel, obj: &Map<String, Value>) -> Vec<RMResponseItem> {
    rm.key_fields
        .iter()
        .map(|kf| {
            let value = complex_map_get(&kf.key, &obj);

            RMResponseItem::new(value, kf.prefix.clone())
        })
        .collect()
}

fn build_object_key_fields(rm: &ReadModel, obj: &Map<String, Value>) -> ObjectData {
    rm.key_fields
        .iter()
        .map(|kf| {
            let value = complex_map_get(&kf.key, &obj);

            let res = RMResponseItem::new(value, kf.prefix.clone());
            (kf.key.clone(), res)
        })
        .collect::<ObjectData>()
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

    let response = match response_data {
        Value::Object(obj) => RMResponse::Object(build_object_key_fields(&read_model, &obj)),
        Value::Array(arr) => RMResponse::Table(
            arr.iter()
                .map(|arr_item| match arr_item {
                    Value::Object(obj) => RMArrayItem {
                        data: build_object_key_fields_as_vec(&read_model, &obj),
                        reference: match &read_model.reference {
                            Some(references) => Some(
                                references
                                    .parameters
                                    .iter()
                                    .filter_map(|reference| match reference {
                                        ReferenceParameter::Body(_v) => None,
                                        ReferenceParameter::Path(v) => {
                                            Some(complex_map_get(v, &obj))
                                        }
                                        ReferenceParameter::Query(v) => {
                                            Some(complex_map_get(v, &obj))
                                        }
                                    })
                                    .collect(),
                            ),
                            None => None,
                        },
                    },
                    _ => RMArrayItem {
                        data: vec![RMResponseItem::new(arr_item.clone(), None)],
                        reference: None,
                    },
                })
                .collect(),
        ),
        _ => RMResponse::Simple(RMResponseItem::new(response_data, None)),
    };

    Ok(Json(response))
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

#[get("/translation")]
pub fn get_translation() -> Json<HashMap<String, String>> {
    let schema = load_schema().unwrap();

    Json(schema.translation)
}


#[post("/add_read_model", data = "<rm>")]
pub fn add_read_model(rm: Json<ReadModel>) -> Status {
    let mut schema = load_schema().unwrap();
    schema.read_models.push(rm.to_owned());

    save_schema(schema).unwrap();

    Status::Created
}