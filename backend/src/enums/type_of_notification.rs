use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum TypeOfNotification {
    InvitedToTeam = 0,
    KickedOut = 1
}