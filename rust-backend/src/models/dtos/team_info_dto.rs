use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct TeamInfoDTO {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,

    pub role_name: String,
    pub permissions: i32,
}
