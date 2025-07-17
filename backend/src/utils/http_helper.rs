// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::users::{Entity as UserEntity, Model as User};
use actix_web::web::Data;
use actix_web::HttpResponse;
use sea_orm::{ConnectionTrait, DatabaseConnection, EntityTrait};
use std::error::Error;
use tracing::error;
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
pub fn endpoint_internal_server_error(
    route_path: &'static str,
    what_failed: &'static str,
    error: Box<dyn Error>
) -> HttpResponse {
    error!("[FAILED] [{}] Reason: {}, Error: {:?}", route_path, what_failed, error);
    return HttpResponse::InternalServerError().finish();
}

#[rustfmt::skip]
pub async fn find_user(
    db: &DatabaseConnection,
    user_id: Uuid
) -> Result<Option<User>, Box<dyn Error>> {
    return match UserEntity::find_by_id(user_id)
        .one(db)
        .await {
            Ok(user) => Ok(user),
            Err(err) => {
                return Err(Box::new(err));
            }
        };
}
