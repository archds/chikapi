use std::collections::HashMap;

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
pub struct RMResponseItem {
    pub value: Value,
    pub prefix: Option<String>,
    pub render_as: ResponseRenderAs,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RMArrayItem {
    pub data: Vec<RMResponseItem>,
    pub reference: Option<Vec<Value>>,
}

pub type ObjectData = HashMap<String, RMResponseItem>;
pub type ArrayData = Vec<RMArrayItem>;

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "renderAs", content = "data")]
pub enum RMResponse {
    Object(ObjectData),
    List(ArrayData),
    Table(ArrayData),
    Simple(RMResponseItem),
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
