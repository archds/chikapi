use serde_json::{Map, Value};

use crate::schema::chikapi::ReadModel;
use crate::ApplicationError;

pub fn get_read_model_by_id<'a>(
    id: &'a String,
    read_models: &'a Vec<ReadModel>,
) -> Result<ReadModel, ApplicationError> {
    let read_models = read_models
        .into_iter()
        .filter(|rm| &rm.id == id)
        .collect::<Vec<&ReadModel>>();

    if read_models.len() == 0 {
        return Err(ApplicationError::ReadModelNotFound(
            "No such read model in schema!",
        ));
    }

    Ok(read_models[0].clone())
}

pub fn complex_map_get<'a>(path: &'a String, data: &'a Map<String, Value>) -> Value {
    let mut obj = data.clone();
    for key in path.split(".") {
        match obj.get(key) {
            Some(v) => match v {
                Value::Object(v) => obj = v.clone(),
                Value::Null => return Value::Null,
                Value::Bool(v) => return Value::Bool(v.clone()),
                Value::Number(v) => return Value::Number(v.clone()),
                Value::String(v) => return Value::String(v.clone()),
                Value::Array(v) => return Value::Array(v.clone()),
            },
            None => return Value::Null,
        }
    }

    return Value::Object(obj);
}
