use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize)]pub struct Claims {
    #[serde(with = "uuid::serde::compact")]
    pub user_id: Uuid,

    #[serde(rename = "exp", with = "chrono::naive::serde::ts_seconds")]
    pub expire_time: NaiveDateTime,

    #[serde(with = "uuid::serde::compact")]
    pub jit: Uuid,
}
