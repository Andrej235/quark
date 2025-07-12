// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper,
};
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate)]
pub struct PasswordResetDTO {

    #[validate(length(min = 8))]
    pub old_password: String,

    #[validate(length(min = 8))]
    pub new_password: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
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
