use actix::Message;
use serde::{Deserialize, Serialize};

#[derive(Message, Serialize, Deserialize, Debug, Clone)]
#[rtype(result = "()")]
pub struct TeamInviteMessage {
    pub message: String,
}

impl TeamInviteMessage {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}