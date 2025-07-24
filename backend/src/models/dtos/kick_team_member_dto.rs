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
pub struct KickTeamMemberDTO {
    
    #[enum_name("Username")]
    #[validate(length(min = 1, max = 50))]
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
        self.username = self.username.trim().to_string();
        
        // Run validation
        return self.validate();
    }
}
