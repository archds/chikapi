use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ResponseRenderAs {
    Object,
    List,
    Table,
    Simple,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RMResponse {
    data: Value,
    render_as: ResponseRenderAs,
}

impl RMResponse {
    pub fn new(data: Value, render_as: ResponseRenderAs) -> Self {
        Self {
            data: data,
            render_as: render_as,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RMSchemaResponse {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ResponseItem {
    pub prefix: String,
    pub value: Value,
}
