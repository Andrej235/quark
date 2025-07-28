use serde::Serialize;

use crate::enums::type_of_notification::TypeOfNotification;

#[derive(Debug, Serialize)]
pub struct WebsocketMessageDto {
    pub type_of_notification: TypeOfNotification,
    pub message: String,
}

impl WebsocketMessageDto {
    pub fn new(type_of_notification: TypeOfNotification, message: String) -> WebsocketMessageDto {
        WebsocketMessageDto { type_of_notification, message }
    }
}
