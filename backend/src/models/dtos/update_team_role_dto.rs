// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct UpdateTeamRoleDTO {

    #[enum_name("Name")]
    #[validate(length(min = 1, max = 50))]
    pub name: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for UpdateTeamRoleDTO {

    type FieldNameEnums = UpdateTeamRoleDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {
        // Trim all strings
        self.name = self.name.trim().to_string();

        // Run validation
        return self.validate();
    }
}
