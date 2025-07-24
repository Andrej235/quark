// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct DeleteTeamRoleDTO {
    #[enum_name("Name")]
    #[validate(length(min = 1, max = 40))]
    pub name: String,

    #[enum_name("TeamId")]
    pub team_id: Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for DeleteTeamRoleDTO {

    type FieldNameEnums = DeleteTeamRoleDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.name = self.name.trim().to_string();

        // Run validation
        return self.validate();
    }
}
