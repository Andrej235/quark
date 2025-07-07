// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
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
        self.trim_strings();

        // Check for string emptiness
        let is_any_string_empty: bool = self.check_if_all_strings_are_not_empty();
        if is_any_string_empty == false {
            return false;
        }

        return true;
    }
}

#[rustfmt::skip]
impl CreateTeamDTO {

    /*
        If any new strings are added to this struct make sure to add new check in function below
    */
    /// Makes sure that all strings in struct are not empty <br/>
    /// Returns true if all strings are not empty, otherwise returns false
    pub fn check_if_all_strings_are_not_empty(&self) -> bool {

        if  self.name.is_empty() == true
        {
            return  false;
        }

        return true;
    }

    /*
        If any new strings need to be trimmed in this struct (on function call) add them in function below
    */
    /// Removes empty spaces from start and end of strings
    pub fn trim_strings(&mut self) {
        self.name = self.name.trim().to_string();
        if self.description.is_some() {
            self.description = Some(self.description.clone().unwrap().trim().to_string());
        }
    }
}
