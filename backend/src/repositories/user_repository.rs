use crate::entity::users::{Column as UserColumn, Entity as UserEntity, Model as User};
use crate::{
    enums::type_of_request::TypeOfRequest, models::sroute_error::SRouteError,
    utils::http_helper::HttpHelper,
};
use actix_web::HttpResponse;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use uuid::Uuid;

pub struct UserRepository;

#[rustfmt::skip]
impl UserRepository {

    /// Tries to find user by specified **id** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if user is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found user
    pub async fn find_by_id(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        user_id: Uuid,
        handle_not_found: bool
    ) -> Result<Option<User>, HttpResponse> {

        return match UserEntity::find_by_id(user_id)
            .one(db)
            .await {
                Ok(Some(user)) => Ok(Some(user)),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "User not found" }))
                    } else {
                        Ok(None)
                    }
                },
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding user", Box::new(err)))
            }
    }

    /// Tries to find user id by specified **username** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if user is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found user
    pub async fn get_id_by_username(
        endpoint_path: (&'static str, TypeOfRequest), 
        db: &DatabaseConnection, 
        username: &str,
        handle_not_found: bool
    ) -> Result<Option<Uuid>, HttpResponse> {
        return match UserEntity::find()
            .filter(UserColumn::Username.eq(username))
            .one(db)
            .await {
                Ok(Some(user)) => Ok(Some(user.id)),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "User not found" }))
                    } else {
                        Ok(None)
                    }
                },
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding user", Box::new(err)))
            };
    }

    /// Tries to find user by specified **email** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if user is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found user
    pub async fn find_by_email(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        user_email: &str,
        handle_not_found: bool
    ) -> Result<Option<User>, HttpResponse> {

        return match UserEntity::find()
            .filter(UserColumn::Email.eq(user_email))
            .one(db)
            .await {
                Ok(Some(user)) => Ok(Some(user)),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "Team not found" }))
                    } else {
                        Ok(None)
                    }
                },
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding user", Box::new(err)))
            };
    }
}
