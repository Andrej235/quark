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

        // Trim strings
        self.name = self.name.trim().to_string();

        StringHelper::trim_string_if_some(&mut self.description);

        // Make sure that all strings are not empty
        let is_any_string_empty: bool = !self.name.is_empty() && StringHelper::is_some_and_not_empty(self.description.clone());
        if is_any_string_empty == false { return false; }

        return true;
    }
}
