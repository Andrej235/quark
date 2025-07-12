// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[derive(Debug, Clone, ToSchema, Deserialize, Validate)]
#[rustfmt::skip]
pub struct UpdateTeamDTO{

    #[validate(length(min = 1, max = 150))]
    pub name:           String,

    pub description:    Option<String>
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for UpdateTeamDTO {
    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.name = self.name.trim().to_string();

        // Run validation
        return self.validate();
    }
}
