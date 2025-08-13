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

        let notification: NotificationMessage = match Self::create_websocket_notification_message(WebsocketMessageDTO::new(
            TypeOfNotification::InvitedToTeam,
            format!("U have been invited to join team: {} by {}", team_name, sender_name),
        )) {
            Ok(notification) => notification,
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Creating notification message", Box::new(err))),
        };

        let addr: Addr<WebsocketSession> = match Self::get_websocket_addr(websocket, reciever_id).await {
            Some(addr) => addr,
            None => return Ok(()), // TODO handle address not found
        };

        addr.do_send(notification);

        return Ok(());
    }

    pub async fn send_team_role_changed_notification(
        endpoint_path: EndpointPathInfo,
        websocket: &WebsocketState,
        reciever_id: UserId,
        team_name: &str,
    ) -> EmptyHttpResult {
        
        let notification: NotificationMessage = match Self::create_websocket_notification_message(WebsocketMessageDTO::new(
            TypeOfNotification::TeamRoleChanged,
            format!("Your role in team: {} has been changed", team_name),
        )) {
            Ok(notification) => notification,
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Creating notification message", Box::new(err))),
        };

        let addr: Addr<WebsocketSession> = match Self::get_websocket_addr(websocket, reciever_id).await {
            Some(addr) => addr,
            None => return Ok(()), // TODO handle address not found
        };

        addr.do_send(notification);

        return Ok(());
    }

    /// Creates notification message
    pub fn create_websocket_notification_message(
        message: WebsocketMessageDTO,
    ) -> Result<NotificationMessage, serde_json::Error> {
        
        let json_string: String = match serde_json::to_string(&message) {
            Ok(json_string) => json_string,
            Err(err) => return Err(err),
        };

        return Ok(NotificationMessage::new(json_string));
    }

    /// Returns address of user in websocket sessions
    pub async fn get_websocket_addr(
        websocket: &WebsocketState,
        user_id: UserId,
    ) -> Option<Addr<WebsocketSession>> {
        let sessions_lock = websocket.sessions.lock().await;
        sessions_lock.get(&user_id).cloned()
    }

    /// Inserts user into websocket sessions <br/>
    /// **NOTE: Uses actix::spawn() in background for obtaining lock on sessions and to not block main thread**
    pub fn insert_into_session(state: &WebsocketState, user_id: UserId, addr: Addr<WebsocketSession>) {
        let sessions_clone = Arc::clone(&state.sessions);

        actix::spawn(async move { // Spawns new thread to insert user into sessions
            let mut sessions = sessions_clone.lock().await;
            sessions.insert(user_id, addr);
        });
    }

    /// Removes user from websocket sessions <br/>
    /// **NOTE: Uses actix::spawn() in background for obtaining lock on sessions and to not block main thread**
    pub fn remove_user_from_session(state: &WebsocketState, user_id: UserId) {
        let sessions_clone = Arc::clone(&state.sessions);

        actix::spawn(async move { // Spawns new thread to remove user from sessions
            let mut sessions = sessions_clone.lock().await;
            sessions.remove(&user_id);
        });
    }    
}
