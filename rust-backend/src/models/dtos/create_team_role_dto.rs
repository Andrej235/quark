// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct CreateTeamRoleDTO {

    #[enum_name("Name")]
    #[validate(length(min = 1, max = 30))]
    pub name:       String,

    #[enum_name("TeamId")]
    pub team_id:    Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for CreateTeamRoleDTO {

    type FieldNameEnums = CreateTeamRoleDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {
        // Trim all strings
        self.name = self.name.trim().to_string();

        // Run validation
        return self.validate();
    }
}
