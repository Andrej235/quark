use serde::Serialize;

use crate::enums::type_of_notification::TypeOfNotification;

#[derive(Debug, Serialize)]
pub struct WebsocketMessageDTO {
    pub type_of_notification: TypeOfNotification,
    pub message: String,
}

impl WebsocketMessageDTO {
    pub fn new(type_of_notification: TypeOfNotification, message: String) -> WebsocketMessageDTO {
        WebsocketMessageDTO { type_of_notification, message }
    }
}
