use crate::entity::team_members::{
    Column as TeamMemberColumn, Entity as TeamMemberEntity, Model as TeamMember,
};
use crate::entity::team_roles::{Entity as TeamRoleEntity, Model as TeamRole};
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
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter};
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
    /// **NOTE: if handle_not_found is true, it will return NotFound response** <br/>
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

    /// Check if user is member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: True if user is member of team, otherwise false
    pub async fn is_member(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: Uuid,
        user_id: Uuid
    ) -> Result<bool, HttpResponse> {

        // By checking if there are cached permissions in redis we can avoid unnecessary database query
        let permissions: Option<i32> = match UserTeamPermissionsCache::get_permissions(redis, user_id, team_id).await {
            Ok(permissions) => permissions,
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Getting user team permissions", Box::new(err)));
            }
        };

        if permissions.is_some() { return Ok(true); }

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .count(db)
            .await {
                Ok(count) => Ok(count > 0),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team member", Box::new(err)))
            };
    }

    /// Tries to find team member by specified **team_id** and **user_id** <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team member
    pub async fn find_member(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        team_id: Uuid,
        user_id: Uuid
    ) -> Result<Option<TeamMember>, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .one(db)
            .await {
                Ok(member) => Ok(member),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team member", Box::new(err)))
            };
    }

    /// Gets team members <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team members
    pub async fn get_members(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        team_id: Uuid
    ) -> Result<Vec<TeamMember>, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .all(db)
            .await {
                Ok(members) => Ok(members),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team members", Box::new(err)))
            };
    }

    /// Gets count of team members <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Count of team members
    pub async fn get_members_count(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        team_id: Uuid
    ) -> Result<u64, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .count(db)
            .await {
                Ok(count) => Ok(count),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team members count", Box::new(err)))
            };
    }

    /// Deletes team member <br/>
    /// Returns: InternalServerError if database query or redis fails <br/>
    /// Returns: Ok
    pub async fn delete_member(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: Uuid,
        user_id: Uuid
    ) -> Result<(), HttpResponse> {

        return match UserTeamPermissionsCache::delete_permissions(redis, user_id, team_id).await {
            Ok(_) => {
                match TeamMemberEntity::delete_many()
                    .filter(TeamMemberColumn::UserId.eq(user_id))
                    .filter(TeamMemberColumn::TeamId.eq(team_id))
                    .exec(db)
                    .await {
                        Ok(_) => Ok(()),
                        Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Deleting team member", Box::new(err)))
                    }
            },
            Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Deleting user team permissions", Box::new(err)))
        };
    }

    /// Gets user team permissions <br/>
    /// **NOTE: If user permissions are cached it will return them, otherwise it will get fresh permissions from database and cache them** <br/> 
    /// Returns: Forbidden response if user is not member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Tuple of team member and team role
    pub async fn get_user_permissions(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        redis: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
    ) -> Result<i32, HttpResponse> {
    
        // Check if there is cached permissions
        let permissions: Option<i32> = match UserTeamPermissionsCache::get_permissions(redis, user_id, team_id).await {
            Ok(permissions) => permissions,
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Getting user team permissions", Box::new(err)));
            }
        };

        if permissions.is_some() { return Ok(permissions.unwrap()); }

        // In case that there is no cached permissions get fresh permissions from database and cache them
        let team_role: TeamRole = match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .find_also_related(TeamRoleEntity)
            .one(db)
            .await {
    
            Ok(Some((_, Some(role)))) => role,
    
            Ok(Some((_, None))) | Ok(None) => {
                return Err(HttpResponse::Forbidden().json(SRouteError { message: "Not memeber of team" }));
            },
    
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team member", Box::new(err)));
            }
        };

        match UserTeamPermissionsCache::cache_permissions(redis, user_id, team_id, team_role.permissions).await {
            Ok(_) => {},
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Caching user team permissions", Box::new(err)));
            }
        }
    
        return Ok(team_role.permissions);
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
