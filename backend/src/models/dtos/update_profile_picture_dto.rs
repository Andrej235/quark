// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{traits::endpoint_json_body_data::EndpointJsonBodyData, utils::string_helper::StringHelper};
use macros::GenerateFieldEnum;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate, GenerateFieldEnum)]
pub struct UpdateProfilePictureDTO {

    #[enum_name("ProfilePicture")]
    pub profile_picture:    Option<String>,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for UpdateProfilePictureDTO {

    type FieldNameEnums = UpdateProfilePictureDTOField;

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {

        // Trim strings
        StringHelper::trim_string_if_some(&mut self.profile_picture);

        // Apply custom validation
        Self::enforce_length_range_optional_string(UpdateProfilePictureDTOField::ProfilePicture, &self.profile_picture, Some(6_000), None)
            .map_err(|errs| errs)?;

        // Run validation
        return self.validate();
    }
}
