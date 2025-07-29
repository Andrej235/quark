// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{traits::endpoint_json_body_data::EndpointJsonBodyData, utils::constants::TEAM_NAME_MAX_LENGTH};
use crate::utils::constants::{TEAM_NAME_MIN_LENGTH, TEAM_NAME_REGEX};
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct CreateTeamDTO {

    #[enum_name("Name")]
    #[validate(regex(path = "*TEAM_NAME_REGEX"))]
    #[validate(length(min = TEAM_NAME_MIN_LENGTH, max = TEAM_NAME_MAX_LENGTH))]
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
