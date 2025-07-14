// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper,
};
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct LoginUserDTO {

    #[enum_name("Email")]
    #[validate(email)]
    pub email:      String,

    #[enum_name("Password")]
    #[validate(length(min = 8))]
    pub password:   String,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for LoginUserDTO {

    type FieldNameEnums = LoginUserDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.email, 
            &mut self.password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Run validation
        return self.validate();
    }
}
