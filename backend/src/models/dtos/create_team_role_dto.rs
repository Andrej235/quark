// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData,
    utils::string_helper::are_all_strings_full,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[derive(Serialize, Deserialize, Clone, Debug, ToSchema)]
#[rustfmt::skip]
pub struct CreateTeamRoleDTO {
    pub name:       String,
    pub team_id:    Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for CreateTeamRoleDTO {
    fn validate(&mut self) -> bool {
        // Trim all strings
        self.name = self.name.trim().to_string();

        // Check for string emptiness
        let is_any_string_empty: bool = are_all_strings_full(&[&self.name]);
        if is_any_string_empty == false {
            return false;
        }

        return true;
    }
}
