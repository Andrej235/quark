use actix::Message;
use serde::{Deserialize, Serialize};

#[derive(Message, Serialize, Deserialize, Debug, Clone)]
#[rtype(result = "()")]
pub struct NotificationMessage {
    pub message: String
}

impl NotificationMessage {
    pub fn new(message: String) -> NotificationMessage {
        NotificationMessage { message }
    }
}