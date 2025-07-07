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
pub struct CreateUserDTO {
    pub username:   String,
    pub name:       String,
    pub last_name:  String,
    pub email:      String,
    pub password:   String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for CreateUserDTO {
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
impl CreateUserDTO {

    /*
        If any new strings are added to this struct make sure to add new check in function below
    */
    /// Makes sure that all strings in struct are not empty <br/>
    /// Returns true if all strings are not empty, otherwise returns false
    pub fn check_if_all_strings_are_not_empty(&self) -> bool {
        
        if  self.username.is_empty()    == true ||
            self.name.is_empty()        == true ||
            self.last_name.is_empty()   == true ||
            self.email.is_empty()       == true ||
            self.password.is_empty()    == true
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
        self.username   = self.username.trim().to_string();
        self.name       = self.name.trim().to_string();
        self.last_name  = self.last_name.trim().to_string();
        self.email      = self.email.trim().to_string();
        self.password   = self.password.trim().to_string();
    }
}
