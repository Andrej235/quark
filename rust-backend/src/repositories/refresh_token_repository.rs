use crate::{
    entity::refresh_tokens::{Entity as RefreshTokenEntity, Model as RefreshToken},
    models::sroute_error::SRouteError,
    types::aliases::{EndpointPathInfo, OptionalHttpResult, RefreshTokenId},
    utils::http_helper::HttpHelper,
};
use actix_web::HttpResponse;
use sea_orm::{DatabaseConnection, EntityTrait};

pub struct RefreshTokenRepository;

#[rustfmt::skip]
impl RefreshTokenRepository {

    /// Tries to find refresh token by specified **id** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound(**Refresh token not found**) response if refresh token is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found refresh token, otherwise None
    pub async fn find_by_id(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        refresh_token_id: RefreshTokenId,
        handle_not_found: bool
    ) -> OptionalHttpResult<RefreshToken> {

        return match RefreshTokenEntity::find_by_id(refresh_token_id)
            .one(db)
            .await
        {
            Ok(Some(user)) => Ok(Some(user)),
            Ok(None) => {
                if handle_not_found {
                    Err(HttpResponse::NotFound().json(SRouteError::new("Refresh token not found")))
                } else {
                    Ok(None)
                }
            }
            Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding user", Box::new(err))),
        };
    }
}
