use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum NotificationStatus {
    SENT = 0,
    RECEIVED = 1,
    READ = 2,
    ARCHIVED = 3,
}
