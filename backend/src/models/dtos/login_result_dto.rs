use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LogInResultDTO {
    pub jwt_token:          String,
    pub refresh_token_id:   Uuid,
}
