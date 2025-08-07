use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;

#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct InviteTeamMemberDTO {
    #[enum_name("Email")]
    #[validate(email)]
    pub email: String,

    #[enum_name("TeamId")]
    pub team_id: Uuid,

    #[enum_name("TeamRoleId")]
    pub team_role_id: i64,
}

impl EndpointJsonBodyData for InviteTeamMemberDTO {
    type FieldNameEnums = InviteTeamMemberDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {
        self.email = self.email.trim().to_lowercase();
        self.validate()
    }
}
