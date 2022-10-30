use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppError {
    message: String,
}

impl AppError {
    pub fn new(message: String) -> Self {
        return Self { message: message };
    }

    pub fn unexpected() -> Self {
        return Self {
            message: "Unexpected error!".to_string(),
        };
    }
}

impl Default for AppError {
    fn default() -> Self {
        Self {
            message: "Application error!".to_string(),
        }
    }
}
