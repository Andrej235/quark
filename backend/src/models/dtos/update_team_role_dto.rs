// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper};
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
pub struct UpdateTeamRoleDTO {

    #[enum_name("OldName")]
    #[validate(length(min = 1, max = 40))]
    pub old_name: String,

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
#[allow(unused_variables)]
impl EndpointJsonBodyData for UpdateTeamRoleDTO {

    type FieldNameEnums = UpdateTeamRoleDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.old_name,
            &mut self.name,
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Run validation
        return self.validate();
    }
}
