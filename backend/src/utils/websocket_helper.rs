use crate::{
    entity::notifications::{
        Column as NotificationColumn, Entity as NotificationEntity, Model as Notification,
    },
    enums::notification_status::NotificationStatus,
    models::dtos::websocket_message_dto::WebsocketMessageDTO,
    types::aliases::{NotificationStatusAsNumber, TeamId, UserId},
    utils::{logger::Logger, websocket_messages::WebsocketMessages},
    ws::{
        messages::NotificationMessage,
        session::{WebsocketSession, WebsocketState},
    },
};
use actix::{Addr, MailboxError};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde_json::Error as SerdeError;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use uuid::Uuid;

pub struct WebsocketHelper;

#[rustfmt::skip]
impl WebsocketHelper {

    /// Creates notification message
    pub fn create_websocket_notification_message(message: WebsocketMessageDTO) -> Result<NotificationMessage, SerdeError> {
        
        let json_string: String = match serde_json::to_string(&message) {
            Ok(json_string) => json_string,
            Err(err) => return Err(err),
        };

        return Ok(NotificationMessage::new(json_string));
    }

    /// Send untracked notification to user <br/>
    /// **NOTE: 'untracked' means that it doesnt wait for response when sending message**
    pub async fn send_untracked_notification(websocket: &WebsocketState, notification: NotificationMessage, reciever_id: UserId) {
        
        let addr: Addr<WebsocketSession> = match WebsocketHelper::get_websocket_addr(websocket, reciever_id).await {
            Some(addr) => addr,
            None => return,
        };

        addr.do_send(notification);
    }

    /// Send tracked notification to user <br/>
    /// **NOTE: 'tracked' means that it waits for response when sending message**
    pub async fn send_tracked_notification(websocket: &WebsocketState, notification: NotificationMessage, reciever_id: UserId) -> Result<(), MailboxError> { 
        
        let addr: Addr<WebsocketSession> = match WebsocketHelper::get_websocket_addr(websocket, reciever_id).await {
            Some(addr) => addr,
            None => return Err(MailboxError::Closed),
        };

        addr.send(notification).await
    }

    /// Returns address of user in websocket sessions
    pub async fn get_websocket_addr(websocket: &WebsocketState, user_id: UserId) -> Option<Addr<WebsocketSession>> {
        let sessions_lock = websocket.sessions.lock().await;
        sessions_lock.get(&user_id).cloned()
    }

    /// Initializes websocket session <br/>
    /// **NOTE: Uses actix::spawn() in background for obtaining lock on sessions and to not block main thread**
    pub fn initialize_websocket_session(db: &DatabaseConnection, state: &WebsocketState, user_id: UserId, default_team_id: Option<TeamId>, addr: Addr<WebsocketSession>) {
        
        // Get references to sessions and groups
        // These references are cheap to clone
        let sessions_clone: Arc<Mutex<HashMap<UserId, Addr<WebsocketSession>>>> = Arc::clone(&state.sessions);
        let groups_clone: Arc<Mutex<HashMap<TeamId, HashMap<UserId, Addr<WebsocketSession>>>>> = Arc::clone(&state.groups);

        let db_clone = db.clone();

        actix::spawn(async move { // Spawns new thread to insert user into sessions
            let mut sessions = sessions_clone.lock().await;
            let mut groups = groups_clone.lock().await; 

            // Insert user into coresponding group if default team is set
            if default_team_id.is_some() {
                let team_id: TeamId = default_team_id.unwrap();
                let group_map: &mut HashMap<TeamId, Addr<WebsocketSession>> = groups.entry(team_id).or_insert_with(HashMap::new);
                group_map.insert(user_id, addr.clone());
            }
            
            // Insert user into sessions
            sessions.insert(user_id, addr.clone());

            // Release locks because we no longer need them
            drop(sessions);
            drop(groups);

            // Send undelivered notifications to user
            let undelivered_notifications: Vec<Notification> = match NotificationEntity::find()
                .filter(NotificationColumn::UserId.eq(user_id))
                .filter(NotificationColumn::Status.eq(NotificationStatus::SENT as NotificationStatusAsNumber))
                .all(&db_clone).await 
            {
                Ok(notifications) => notifications,
                Err(err) => {
                    Logger::error_detailed("Failed to get undelivered notifications", Box::new(err));
                    return;
                },
            };

            WebsocketMessages::bulk_tracked_send(&db_clone, &addr, undelivered_notifications).await;

            dev_log!("UserId: {} connected to websocket, default_team_id: {}", user_id, default_team_id.unwrap_or(Uuid::nil()));
        });
    }

    /// Drops user from websocket session <br/>
    /// **NOTE: Uses actix::spawn() in background for obtaining lock on sessions and to not block main thread**
    pub fn drop_websocket_session(state: &WebsocketState, user_id: UserId) {
        let sessions_clone: Arc<Mutex<HashMap<UserId, Addr<WebsocketSession>>>> = Arc::clone(&state.sessions);
        let groups_clone: Arc<Mutex<HashMap<TeamId, HashMap<UserId, Addr<WebsocketSession>>>>> = Arc::clone(&state.groups);

        actix::spawn(async move { // Spawns new thread to remove user from sessions
            let mut sessions = sessions_clone.lock().await;
            let mut groups = groups_clone.lock().await;
            
            // Remove user from all groups
            groups.retain(|_team_id, group_map| {
                group_map.remove(&user_id);
                !group_map.is_empty() // retain group only if it's not empty after removal
            });

            // Remove user from sessions
            sessions.remove(&user_id);
        });
    }    
}
