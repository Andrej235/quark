use serde::Serialize;

use crate::enums::notification_type::NotificationType;

#[derive(Debug, Serialize)]
pub struct WebsocketMessageDTO {
    pub type_of_notification: NotificationType,
    pub message: String,
}

impl WebsocketMessageDTO {
    pub fn new(type_of_notification: NotificationType, message: String) -> WebsocketMessageDTO {
        WebsocketMessageDTO {
            type_of_notification,
            message,
        }
    }
}
