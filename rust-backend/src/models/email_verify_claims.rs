use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailVerifyClaims {
    #[serde(with = "uuid::serde::compact")]
    pub user_id: Uuid,

    #[serde(rename = "exp", with = "chrono::naive::serde::ts_seconds")]
    pub expire_time: NaiveDateTime,
}
