use serde::Serialize;
use utoipa::ToSchema;

#[derive(Debug, Clone, ToSchema, Serialize)]
pub struct TeamRoleInfoDTO {
    pub name: String,
    pub permissions: i32,
}
