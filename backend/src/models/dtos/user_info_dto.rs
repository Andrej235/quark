// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::models::dtos::team_info_dto::TeamInfoDTO;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, ToSchema, Serialize)]
pub struct UserInfoDTO {
    pub username:           String,
    pub name:               String,
    pub last_name:          String,
    pub email:              String,
    pub profile_picture:    Option<String>,
    
    pub is_email_verified:  bool,

    pub default_team_id:    Option<Uuid>,
    pub teams_info:         Vec<TeamInfoDTO>,
}
