// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData,
    types::aliases::TeamRoleId,
    utils::constants::{USER_USERNAME_MAX_LENGTH, USER_USERNAME_MIN_LENGTH},
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
pub struct ChangeUserRoleDTO {

    #[enum_name("TeamId")]
    pub team_id: Uuid,

    #[enum_name("RoleId")]
    pub role_id: TeamRoleId,

    #[enum_name("UserUsername")]
    #[validate(length(min = USER_USERNAME_MIN_LENGTH, max = USER_USERNAME_MAX_LENGTH))]
    pub user_username: String
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for ChangeUserRoleDTO {

    type FieldNameEnums = ChangeUserRoleDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.user_username = self.user_username.trim().to_string();

        // Run validation
        return self.validate();
    }
}
