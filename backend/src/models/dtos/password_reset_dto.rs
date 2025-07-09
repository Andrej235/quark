// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData,
    utils::string_helper::are_all_strings_full,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct PasswordResetDTO {
    pub old_password: String,
    pub new_password: String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for PasswordResetDTO {
    fn validate(&mut self) -> bool {
        // Trim all strings
        self.old_password = self.old_password.trim().to_string();
        self.new_password = self.new_password.trim().to_string();

        // Check for string emptiness
        let is_any_string_empty: bool = are_all_strings_full(&[&self.old_password, &self.new_password]);
        if is_any_string_empty == false {
            return false;
        }

        return true;
    }
}
