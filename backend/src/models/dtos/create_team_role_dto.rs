// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::{Validate, ValidationErrors};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Deserialize, Validate)]
pub struct CreateTeamRoleDTO {

    #[validate(length(min = 1, max = 50))]
    pub name:       String,

    pub team_id:    Uuid,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
impl EndpointJsonBodyData for CreateTeamRoleDTO {

    type StructFieldNamesEnum = ();

    fn validate_data(&mut self) -> Result<(), ValidationErrors> {
        // Trim all strings
        self.name = self.name.trim().to_string();

        // Run validation
        return self.validate();
    }

    fn get_field_name(enm: Self::StructFieldNamesEnum) -> &'static str { todo!() }
}
