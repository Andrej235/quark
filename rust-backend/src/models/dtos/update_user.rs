// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct UpdateUserDTO {

    #[enum_name("Username")]
    pub username:   Option<String>,

    #[enum_name("Name")]
    pub name:       Option<String>,
    
    #[enum_name("LastName")]
    pub last_name:  Option<String>,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for UpdateUserDTO {

    type FieldNameEnums = UpdateUserDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Apply custom validation
        Self::enforce_length_range_optional_string(UpdateUserDTOField::Username, &self.username, Some(1), Some(50))
            .map_err(|errs| errs)?;

        Self::enforce_length_range_optional_string(UpdateUserDTOField::Name, &self.username, Some(1), Some(40))
            .map_err(|errs| errs)?;

        Self::enforce_length_range_optional_string(UpdateUserDTOField::LastName, &self.username, Some(1), Some(40))
            .map_err(|errs| errs)?;

        // Run validation
        return self.validate();
    }
}
