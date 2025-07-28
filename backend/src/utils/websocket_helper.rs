use std::sync::Arc;

use actix::Addr;

use crate::{
    enums::type_of_notification::TypeOfNotification,
    models::dtos::websocket_message_dto::WebsocketMessageDTO,
    types::aliases::{EmptyHttpResult, EndpointPathInfo, UserId},
    utils::http_helper::HttpHelper,
    ws::{
        messages::NotificationMessage,
        session::{WebsocketSession, WebsocketState},
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
        let json_object: WebsocketMessageDTO = WebsocketMessageDTO::new(
            TypeOfNotification::InvitedToTeam,
            format!("U have been invited to join team: {} by {}", team_name, sender_name),
        );

        let json_string: String = match serde_json::to_string(&json_object) {
            Ok(json_string) => json_string,
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Serializing json", Box::new(err))),
        };

        let notification: NotificationMessage = NotificationMessage::new(json_string);

        // Obtain lock on sessions
        let sessions_lock = websocket.sessions.lock().await;

        let reciever_adress: &actix::Addr<WebsocketSession> = match sessions_lock.get(&reciever_id) {
            Some(result) => result,
            None => return Err(HttpHelper::log_internal_server_error_plain(endpoint_path, "Getting session")),
        };

        // Send notification message and handle possible errors
        reciever_adress.do_send(notification);

        return Ok(());
    }

    pub fn insert_into_session(state: &WebsocketState, user_id: UserId, addr: Addr<WebsocketSession>) {
        let sessions_clone = Arc::clone(&state.sessions);

        actix::spawn(async move { // Spawns new thread to insert user into sessions
            let mut sessions = sessions_clone.lock().await;
            sessions.insert(user_id, addr);
        });
    }

    pub fn remove_user_from_session(state: &WebsocketState, user_id: UserId) {
        let sessions_clone = Arc::clone(&state.sessions);

        actix::spawn(async move { // Spawns new thread to remove user from sessions
            let mut sessions = sessions_clone.lock().await;
            sessions.remove(&user_id);
        });
    }    
}
