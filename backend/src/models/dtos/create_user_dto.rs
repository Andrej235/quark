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
pub struct CreateUserDTO {

    #[enum_name("Username")]
    #[validate(length(min = 1, max = 50))]
    pub username:   String,

    #[enum_name("Name")]
    #[validate(length(min = 1, max = 40))]
    pub name:       String,
    
    #[enum_name("LastName")]
    #[validate(length(min = 1, max = 40))]
    pub last_name:  String,
    
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
impl EndpointJsonBodyData for CreateUserDTO {

    type FieldNameEnums = CreateUserDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {
        
        // Trim strings
        let mut string_vec: Vec<&mut String> = vec![
            &mut self.username,
            &mut self.name,
            &mut self.last_name,
            &mut self.email,
            &mut self.password
        ];

        StringHelper::trim_all_strings(&mut string_vec);

        // Run validation
        return self.validate();
    }
}
