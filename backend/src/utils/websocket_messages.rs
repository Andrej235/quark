use crate::{
    entity::notifications::{
        Column as NotificationColumn, Entity as NotificationEntity, Model as Notification,
    },
    enums::{notification_status::NotificationStatus, notification_type::NotificationType},
    models::dtos::websocket_message_dto::WebsocketMessageDTO,
    repositories::notification_repository::NotificationRepository,
    types::aliases::{
        EmptyHttpResult, EndpointPathInfo, NotificationId, NotificationStatusAsNumber,
        NotificationTypeAsNumber, UserId,
    },
    utils::{http_helper::HttpHelper, logger::Logger, websocket_helper::WebsocketHelper},
    ws::{
        messages::NotificationMessage,
        session::{WebsocketSession, WebsocketState},
    },
};
use actix::Addr;
use sea_orm::{prelude::Expr, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

pub struct WebsocketMessages;

#[rustfmt::skip]
impl WebsocketMessages {

    /// Sends tracked notification to user, while saving it to database <br/>
    /// **NOTE: 'tracked' means that it waits for response when sending message**
    pub async fn internal_tracked_send(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        websocket: &WebsocketState,
        reciever_id: UserId,
        message: String, 
        notification_type: NotificationType
    ) -> EmptyHttpResult {
        
        let notification: NotificationMessage = WebsocketHelper::create_websocket_notification_message(
            WebsocketMessageDTO::new(
                notification_type,
                message.clone()
            )
        ).map_err( |err| HttpHelper::log_internal_server_error(endpoint_path.clone(), "Creating notification message", Box::new(err)))?;

        // Send notification
        match WebsocketHelper::send_tracked_notification(websocket, notification, reciever_id).await {
            Ok(_) => {

                // Notification recieved
                match NotificationRepository::isnert_raw(
                    endpoint_path, db, reciever_id, 
                    NotificationStatus::RECEIVED,
                    notification_type, 
                    message, 
                    None).await {
                    Ok(_) => (),
                    Err(err) => return Err(err)
                }
            },
            Err(_) => {
                
                // Notification not recieved remains SENT
                match NotificationRepository::isnert_raw(
                    endpoint_path, db, reciever_id, 
                    NotificationStatus::SENT,
                    notification_type, 
                    message, 
                    None).await {
                    Ok(_) => (),
                    Err(err) => return Err(err)
                }
            }
        };

        return Ok(());
    }

    pub async fn bulk_tracked_send(
        db: &DatabaseConnection, 
        addr: &Addr<WebsocketSession>,
        undelivered_notifications: Vec<Notification>
    ) {

        // Skip function execution if there are no undelivered notifications
        if undelivered_notifications.len() == 0 { return; } 

        // This list will contain all models that will be updated
        let mut to_update_model_ids: Vec<NotificationId> = vec![];

        for notification in undelivered_notifications{

            // Try converting type number into actual type
            let notification_type_number: NotificationTypeAsNumber = notification.r#type.clone();

            let notification_type: NotificationType = match NotificationType::try_from(notification_type_number) {
                Ok(notification_type) => notification_type,
                Err(err) => {
                    Logger::error_detailed("Failed to convert notification type number to actual type", Box::new(err));
                    continue;
                }
            };

            // Create notification message
            let websocket_message: WebsocketMessageDTO = WebsocketMessageDTO::new(
                notification_type,
                notification.text.clone(),
            );

            let notification_message: NotificationMessage = match WebsocketHelper::create_websocket_notification_message(websocket_message) {
                Ok(notification_message) => notification_message,
                Err(err) => {
                    Logger::error_detailed("Failed to create notification message", Box::new(err));
                    continue;
                }
            };

            // Try to send notification
            match addr.send(notification_message).await {
                Ok(_) => {

                    // Add notification id to vector
                    to_update_model_ids.push(notification.id);
                },
                Err(_) => {
                    continue; // Unable to deliver package for some reason, skip
                }
            };
        }

        // Bulk update status of notifications
        if to_update_model_ids.len() == 0 { return; } // Skip if no items are in vector

        match NotificationEntity::update_many()
            .col_expr(NotificationColumn::Status, Expr::value(NotificationStatus::RECEIVED as NotificationStatusAsNumber))
            .filter(NotificationColumn::UserId.is_in(to_update_model_ids))
            .exec(db).await 
        {
            Ok(_) => (),
            Err(err) => {
                Logger::error_detailed("Failed to bulk update notification status", Box::new(err));
                return;
            }
        }
    }



    pub async fn send_team_invitation_message(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        websocket: &WebsocketState,
        team_name: &str,
        reciever_id: UserId,
        sender_name: &str,
    ) -> EmptyHttpResult {

        // Create message
        let message: String = format!("U have been invited to join team: {} by {}", team_name, sender_name); 

        WebsocketMessages::internal_tracked_send(endpoint_path, db, websocket, reciever_id, message, NotificationType::TeamInvite).await
    }

    pub async fn send_team_role_changed_notification(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        websocket: &WebsocketState,
        reciever_id: UserId,
        team_name: &str,
    ) -> EmptyHttpResult {
        
        let message: String = format!("Your role in team: {} has been changed", team_name); 
        
        Self::internal_tracked_send(endpoint_path, db, websocket, reciever_id, message, NotificationType::TeamRoleChanged).await
    }

    pub async fn send_team_kicked_notification(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        websocket: &WebsocketState,
        reciever_id: UserId,
        team_name: &str,
    ) -> EmptyHttpResult {
        
        let message: String = format!("U have been kicked out from team: {}", team_name); 

        Self::internal_tracked_send(endpoint_path, db, websocket, reciever_id, message, NotificationType::TeamKick).await
    }
}
