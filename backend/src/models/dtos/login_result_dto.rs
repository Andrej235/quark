// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LogInResultDTO {
    pub jwt_token:          String,
    pub refresh_token_id:   Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for LogInResultDTO {
    fn validate(&mut self) -> bool {

        // Trim strings
        self.jwt_token = self.jwt_token.trim().to_string();

        // Make sure that all strings are not empty
        let is_any_string_empty: bool = self.jwt_token.is_empty();
        if is_any_string_empty == false { return false; }

        return true;
    }
}
