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
// STRUCT
// ------------------------------------------------------------------------------------
#[derive(Serialize, Deserialize, Clone, Debug, ToSchema)]
#[rustfmt::skip]
pub struct CreateTeamDTO {
    pub name:           String,
    pub description:    Option<String>
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for CreateTeamDTO {
    fn validate(&mut self) -> bool {
        // Trim all strings
        self.name = self.name.trim().to_string();

       if let Some(desc) = &self.description {
            let trimmed = desc.trim().to_string();
            // If after trimming, it's empty, treat as invalid
            if trimmed.is_empty() {
                return false;
            }
            self.description = Some(trimmed);
        }

        // Check for string emptiness
        let is_any_string_empty: bool = are_all_strings_full(&[&self.name]);
        if is_any_string_empty == false {
            return false;
        }

        return true;
    }
}
