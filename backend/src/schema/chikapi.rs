use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Command;
#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(untagged)]
pub enum Method {
    Get,
    Post,
    Put,
    Delete,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
pub struct KeyField {
    pub prefix: Option<String>,
    pub key: String,
    pub size: Option<u8>, // 1-7
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct PathParameter {
    pub value: String,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct Parameter {
    pub key: String,
    pub value: String,
}
#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(tag = "type")]
pub enum QueryParameter {
    Body(Parameter),
    Path(PathParameter),
    Query(Parameter),
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type", content = "key")]
pub enum ReferenceParameter {
    Body(String),
    Path(String),
    Query(String),
}

pub type ReferenceParameters = Vec<ReferenceParameter>;

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ReadModelRef {
    pub to: String,
    pub parameters: ReferenceParameters,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ReadModelStyle {
    LIST,
    TABLE,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ReadModel {
    pub path: String,
    pub name: String,
    pub id: String,
    pub key_fields: Vec<KeyField>, // must be maximum value
    pub include: Option<Vec<String>>,
    pub parameters: Vec<QueryParameter>,
    pub reference: Option<ReadModelRef>,
    pub root_key: Option<String>,
    pub style: Option<ReadModelStyle>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Schema {
    pub url: String,
    pub has_openapi: bool,
    pub headers: Option<HashMap<String, String>>,
    pub read_models: Vec<ReadModel>,
    pub commands: Vec<Command>,
    pub translation: HashMap<String, String>,
}

impl Parameter {
    pub fn new(k: String, v: String) -> Parameter {
        return Parameter { key: k, value: v };
    }
}

impl PathParameter {
    pub fn new(v: String) -> PathParameter {
        return PathParameter { value: v };
    }
}
