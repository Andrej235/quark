use crate::entity::teams::{Entity as TeamEntity, Model as TeamModel};
use crate::{
    enums::type_of_request::TypeOfRequest,
    models::sroute_error::SRouteError,
    utils::{
        cache::user_team_permissions_cache::UserTeamPermissionsCache, http_helper::HttpHelper,
        redis_service::RedisService,
    },
};
use actix_web::HttpResponse;
use sea_orm::{DatabaseConnection, EntityTrait};
use uuid::Uuid;

pub struct TeamRepository;

#[rustfmt::skip]
impl TeamRepository {

    /// Tries to find team by specified **id** <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn exists(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection, 
        team_id: Uuid
    ) -> Result<bool, HttpResponse> {

        return match TeamEntity::find_by_id(team_id)
            .one(db)
            .await {
                Ok(Some(_)) => Ok(true),
                Ok(None) => Ok(false),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Checking if team exists", Box::new(err)))
            };
    }

    /// Tries to find team by specified **id** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn find_by_id(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection, 
        team_id: Uuid,
        handle_not_found: bool
    ) -> Result<Option<TeamModel>, HttpResponse> {
    
        return match TeamEntity::find_by_id(team_id)
            .one(db)
            .await {
                Ok(Some(team)) => Ok(Some(team)),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "Team not found" }))
                    } else {
                        Ok(None)
                    }
                },
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team", Box::new(err)))
            }
    }

    pub async fn delete_by_id(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: Uuid
    ) -> Result<(), HttpResponse> {

        match TeamEntity::delete_by_id(team_id)
            .exec(db)
            .await {
            Ok(_) => {},
            Err(err) => return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Deleting team", Box::new(err)))
        }

        // Delete all cached users team permissions
        // There is no need for that cached data to exist anymore
        match UserTeamPermissionsCache::delete_all_permissions_for_team(redis, team_id).await {
            Ok(_) => Ok(()),
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Deleting cached user team permissions", Box::new(err)));
            }
        }
    }
}
