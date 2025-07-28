use crate::{
    enums::type_of_notification::TypeOfNotification,
    models::dtos::websocket_message_dto::WebsocketMessageDto,
    types::aliases::{EmptyHttpResult, EndpointPathInfo, UserId},
    utils::http_helper::HttpHelper,
    ws::{
        messages::NotificationMessage,
        session::{WebSocketSession, WebsocketState},
    },
};

pub struct WebsocketHelper;

#[rustfmt::skip]
impl WebsocketHelper {

    pub async fn send_team_invitation_message(
        endpoint_path: EndpointPathInfo,
        websocket: &WebsocketState,
        team_name: &str,
        reciever_id: UserId,
        sender_name: &str,
    ) -> EmptyHttpResult {

        // Create json string from json object and handle possible errors
        let json_object: WebsocketMessageDto = WebsocketMessageDto::new(
            TypeOfNotification::InvitedToTeam,
            format!("U have been invited to join team: {} by {}", team_name, sender_name),
        );

        let json_string: String = match serde_json::to_string(&json_object) {
            Ok(json_string) => json_string,
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Serializing json", Box::new(err))),
        };

        let notification: NotificationMessage = NotificationMessage::new(json_string);

        // Obtain lock on sessions
        let sessions_lock = match websocket.sessions.lock() {
            Ok(sessions_lock) => sessions_lock,
            Err(err) => return Err(HttpHelper::log_internal_server_error_as_message(endpoint_path, "Locking sessions", err.to_string())),
        };

        let reciever_adress: &actix::Addr<WebSocketSession> = match sessions_lock.get(&reciever_id) {
            Some(g) => g,
            None => return Err(HttpHelper::log_internal_server_error_as_message(endpoint_path, "Getting session", "Session not found".to_string())),
        };

        // Send notification message and handle possible errors
        match reciever_adress.send(notification).await {
            Ok(_) => (),
            Err(err) => {
                match err {
                    actix::MailboxError::Closed => return Err(HttpHelper::log_internal_server_error_as_message(endpoint_path, "Sending message", "Session closed".to_string())),
                    actix::MailboxError::Timeout => return Err(HttpHelper::log_internal_server_error_as_message(endpoint_path, "Sending message", "Timeout".to_string())),
                }
            },
        };

        return Ok(());
    }
}
