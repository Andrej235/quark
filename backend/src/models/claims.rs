use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub user_id:        Uuid, // User ID (UUID)
    pub expire_time:    NaiveDateTime,  // Expiry time (Unix timestamp)
    pub jit:            Uuid, // Unique ID for this token session
}
