use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize)]
pub struct LogInResult {
    pub jwt_token:          String,
    pub refresh_token_id:   Uuid,
}
