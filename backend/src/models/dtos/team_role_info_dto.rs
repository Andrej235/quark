use serde::Serialize;
use utoipa::ToSchema;

use crate::types::aliases::TeamRoleId;

#[derive(Debug, Clone, ToSchema, Serialize)]
pub struct TeamRoleInfoDTO {
    pub id: TeamRoleId,
    pub name: String,
    pub permissions: i32,
}
