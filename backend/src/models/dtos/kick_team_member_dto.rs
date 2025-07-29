// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData,
    utils::{
        constants::{
            TEAM_NAME_MAX_LENGTH, TEAM_NAME_MIN_LENGTH, USER_USERNAME_MAX_LENGTH,
            USER_USERNAME_MIN_LENGTH,
        },
        string_helper::StringHelper,
    },
};
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
pub struct KickTeamMemberDTO {
    
    #[enum_name("TeamId")]
    pub team_id: Uuid,

    #[enum_name("TeamName")]
    #[validate(length(min = TEAM_NAME_MIN_LENGTH, max = TEAM_NAME_MAX_LENGTH))]
    pub team_name: String,

    #[enum_name("Username")]
    #[validate(length(min = USER_USERNAME_MIN_LENGTH, max = USER_USERNAME_MAX_LENGTH))]
    pub username: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for KickTeamMemberDTO {

    type FieldNameEnums = KickTeamMemberDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.team_name,
            &mut self.username,
        ];

        StringHelper::trim_all_strings(&mut string_vec);
        
        // Run validation
        return self.validate();
    }
}
