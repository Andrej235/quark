// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct LogInResultDTO {

    #[validate(length(min = 200))]
    pub jwt_token:          String,

    pub refresh_token_id:   Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for LogInResultDTO {
    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.jwt_token = self.jwt_token.trim().to_string();

        // Run validation
        return self.validate();
    }
}
