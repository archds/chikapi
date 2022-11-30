use serde_json::{Map, Value};

use crate::api::read_model::types::{
    ObjectData, RMArrayItem, RMResponse, RMResponseItem, ResponseRenderAs,
};
use crate::schema::chikapi::{ReadModel, ReadModelRef, ReferenceParameter};
use crate::utils::complex_map_get;

impl RMResponseItem {
    pub fn new(value: Value, prefix: Option<String>) -> Self {
        Self {
            value: value.clone(),
            prefix: prefix,
            render_as: match value {
                Value::Object(_) => ResponseRenderAs::Object,
                Value::Array(_) => ResponseRenderAs::List,
                _ => ResponseRenderAs::Simple,
            },
        }
    }
}

impl RMArrayItem {
    fn get_reference_value(param: &ReferenceParameter, data: &Map<String, Value>) -> Option<Value> {
        match param {
            ReferenceParameter::Body(_) => None,
            ReferenceParameter::Path(v) => Some(complex_map_get(v, &data)),
            ReferenceParameter::Query(v) => Some(complex_map_get(v, &data)),
        }
    }

    fn get_reference_data_from_rm_param(r: &ReadModelRef, data: &Map<String, Value>) -> Vec<Value> {
        return r
            .parameters
            .iter()
            .filter_map(|p| Self::get_reference_value(p, data))
            .collect();
    }

    fn get_reference_data_from_rm_ref(
        read_model: &ReadModel,
        data: &Map<String, Value>,
    ) -> Option<Vec<Value>> {
        return read_model
            .reference
            .as_ref()
            .map(|r| Self::get_reference_data_from_rm_param(r, data));
    }

    fn build_object_key_fields_as_vec(
        rm: &ReadModel,
        obj: &Map<String, Value>,
    ) -> Vec<RMResponseItem> {
        rm.key_fields
            .iter()
            .map(|kf| {
                let value = complex_map_get(&kf.key, &obj);

                RMResponseItem::new(value, kf.prefix.clone())
            })
            .collect()
    }

    pub fn new(v: &Value, read_model: &ReadModel) -> Self {
        match v {
            Value::Object(obj) => Self {
                data: Self::build_object_key_fields_as_vec(&read_model, &obj),
                reference: Self::get_reference_data_from_rm_ref(&read_model, &obj),
            },
            _ => Self {
                data: vec![RMResponseItem::new(v.clone(), None)],
                reference: None,
            },
        }
    }
}

impl RMResponse {
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

    pub fn new(v: Value, read_model: &ReadModel) -> Self {
        return match v {
            Value::Object(obj) => Self::Object(Self::build_object_key_fields(&read_model, &obj)),
            Value::Array(arr) => RMResponse::Table(
                arr.iter()
                    .map(|arr_item| RMArrayItem::new(arr_item, read_model))
                    .collect(),
            ),
            _ => Self::Simple(RMResponseItem::new(v, None)),
        };
    }
}
