// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate)]
pub struct CreateTeamDTO {

    #[validate(length(min = 1, max = 150))]
    pub name:           String,

    pub description:    Option<String>
}

// ------------------------------------------------------------------------------------
// ENUM
// ------------------------------------------------------------------------------------
#[derive(Debug, Clone, Copy)]
pub enum CreateTeamDTOEnum {
    Name,
    Description,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for CreateTeamDTO {

    type StructFieldNamesEnum = CreateTeamDTOEnum;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        self.name = self.name.trim().to_string();

        // Apply custom validation
        Self::enforce_length_range_optional_string(CreateTeamDTOEnum::Description, &self.description, None, Some(400))
            .map_err(|errs| errs)?;

        // Run validation
        return self.validate();
    }
    
    fn get_field_name(enm: Self::StructFieldNamesEnum) -> &'static str {
        match enm {
            CreateTeamDTOEnum::Name => "name",
            CreateTeamDTOEnum::Description => "description",
        }
    }
}
