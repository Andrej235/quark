use macros::GenerateFieldEnum;
// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct TeamInvitationDTO {
    
    #[enum_name("TeamId")]
    pub team_id: Uuid,

    #[enum_name("Email")]
    #[validate(email)]
    pub email: String
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for TeamInvitationDTO {

    type FieldNameEnums = TeamInvitationDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.email = self.email.trim().to_string();

        // Run validation
        return self.validate();
    }
}
