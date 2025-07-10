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
#[derive(Serialize, Deserialize, Clone, Debug, ToSchema)]
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

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.username,
            &mut self.name,
            &mut self.last_name,
            &mut self.email,
            &mut self.password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Check for string emptiness
        let is_any_string_empty: bool = StringHelper::are_all_strings_full(string_vec);
        if is_any_string_empty == false {
            return false;
        }

        return true;
    }
}
