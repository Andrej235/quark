// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use macros::GenerateFieldEnum;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate, GenerateFieldEnum)]
pub struct LogInResultDTO {

    #[enum_name("JWTToken")]
    #[validate(length(min = 200))]
    pub jwt_token:          String,

    #[enum_name("RefreshTokenId")]
    pub refresh_token_id:   Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl LogInResultDTO {
    pub fn new(jwt_token: String, refresh_token_id: Uuid) -> LogInResultDTO {
        Self {
            jwt_token,
            refresh_token_id
        }        
    }
}

#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for LogInResultDTO {

    type FieldNameEnums = LogInResultDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.jwt_token = self.jwt_token.trim().to_string();

        // Run validation
        return self.validate();
    }
}
