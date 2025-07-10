// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct PasswordResetDTO {
    pub old_password: String,
    pub new_password: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for PasswordResetDTO {
    fn validate(&mut self) -> bool {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.old_password, 
            &mut self.new_password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Make sure that all strings are not empty
        let is_any_string_empty: bool = StringHelper::are_all_strings_full(string_vec);
        if is_any_string_empty == false { return false; }

        return true;
    }
}
