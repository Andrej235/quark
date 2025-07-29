use crate::entity::notifications::{
    ActiveModel as NotificationActiveModel, Entity as NotificationEntity,
};
use crate::{
    enums::{notification_status::NotificationStatus, notification_type::NotificationType},
    types::aliases::{
        EmptyHttpResult, EndpointPathInfo, NotificationStatusAsNumber, NotificationTypeAsNumber,
        UserId,
    },
    utils::http_helper::HttpHelper,
};
use chrono::Utc;
use sea_orm::{ActiveValue::Set, DatabaseConnection, EntityTrait};

pub struct NotificationRepository;

#[rustfmt::skip]
impl NotificationRepository {

    pub async fn isnert_raw(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        user_id: UserId,
        notification_status: NotificationStatus,
        notification_type: NotificationType,
        notification_text: String,
        notification_description: Option<String>
    ) -> EmptyHttpResult {

        let notification: NotificationActiveModel = NotificationActiveModel {
            r#type: Set(notification_type as NotificationTypeAsNumber),
            status: Set(notification_status as NotificationStatusAsNumber),
            created_at: Set(Utc::now().naive_utc()),
            text: Set(notification_text),
            description: Set(notification_description),
            user_id: Set(user_id),
            ..Default::default()
        };

        match NotificationEntity::insert(notification).exec(db).await {
            Ok(_) => (),
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Inserting notification", Box::new(err)))
        };

        return Ok(());
    }
}
