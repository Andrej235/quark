use chrono::naive::NaiveDateTime;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct TeamMemberInfo {
    pub username: String,
    pub profile_pictire: Option<String>,
    pub email: String,
    pub role_name: String,
    pub joined_at: NaiveDateTime,
}
