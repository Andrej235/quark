// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper,
};
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct PasswordResetDTO {

    #[enum_name("OldPassword")]
    #[validate(length(min = 8))]
    pub old_password: String,

    #[enum_name("NewPassword")]
    #[validate(length(min = 8))]
    pub new_password: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for PasswordResetDTO {

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.old_password, 
            &mut self.new_password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Run validation
        return self.validate();
    }
}
