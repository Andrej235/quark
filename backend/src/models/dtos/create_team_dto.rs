// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use macros::GenerateFieldEnum;
use once_cell::sync::Lazy;
use regex::Regex;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STATICS
// ------------------------------------------------------------------------------------
static NAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"^[A-Za-z0-9\-]+$").unwrap());

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct CreateTeamDTO {

    #[enum_name("Name")]
    #[validate(regex(path = "*NAME_REGEX"))]
    #[validate(length(min = 1, max = 150))]
    pub name:           String,

    #[enum_name("Description")]
    pub description:    Option<String>
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for CreateTeamDTO {

    type FieldNameEnums = CreateTeamDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.name = self.name.trim().to_string();

        // Apply custom validation
        Self::enforce_length_range_optional_string(CreateTeamDTOField::Description, &self.description, Some(1), Some(400))
            .map_err(|errs| errs)?;

        // Run validation
        return self.validate();
    }
}
