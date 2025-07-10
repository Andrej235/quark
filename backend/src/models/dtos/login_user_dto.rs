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
pub struct LoginUserDTO {
    pub email:      String,
    pub password:   String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl EndpointJsonBodyData for LoginUserDTO {
    fn validate(&mut self) -> bool {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.email, 
            &mut self.password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Make sure that all strings are not empty
        let is_any_string_empty: bool = StringHelper::are_all_strings_full(string_vec);
        if is_any_string_empty == false { return false; }

        return true;
    }
}
