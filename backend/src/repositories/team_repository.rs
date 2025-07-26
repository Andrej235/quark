use crate::entity::team_members::{
    Column as TeamMemberColumn, Entity as TeamMemberEntity, Model as TeamMember,
};
use crate::entity::team_roles::{
    ActiveModel as TeamRoleActiveModel, Column as TeamRoleColumn, Entity as TeamRoleEntity,
    Model as TeamRole,
};
use crate::entity::teams::{Column as TeamColumn, Entity as TeamEntity, Model as Team};
use crate::models::route_error::RouteError;
use crate::types::aliases::{EndpointPathInfo, HttpResult, TeamId, UserId};
use crate::{
    models::sroute_error::SRouteError,
    utils::{
        cache::user_team_permissions_cache::UserTeamPermissionsCache, http_helper::HttpHelper,
        redis_service::RedisService,
    },
};
use actix_web::HttpResponse;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, ConnectionTrait, DatabaseConnection, EntityTrait,
    PaginatorTrait, QueryFilter, QuerySelect,
};

pub struct TeamRepository;

#[rustfmt::skip]
impl TeamRepository {

    // ************************************************************************************
    //
    // TEAM
    //
    // ************************************************************************************

    /// Tries to find team by specified **id** <br/>
    /// **NOTE: if handle_not_found is true, it will return NotFound response** <br/>
    /// Returns: NotFound(**Team not found**) response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn exists(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection, 
        team_id: TeamId,
        handle_not_found: bool
    ) -> HttpResult<bool> {

        return match TeamEntity::find_by_id(team_id)
            .one(db)
            .await {
                Ok(Some(_)) => Ok(true),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "Team not found" }))
                    } else {
                        Ok(false)
                    }
                },
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Checking if team exists", Box::new(err)))
            };
    }

    /// Tries to find team by specified **id** <br/>
    /// **NOTE: if handle_not_found is true, it will return NotFound response** <br/>
    /// Returns: NotFound(**Team not found**) response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn find_by_id(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection, 
        team_id: TeamId,
        handle_not_found: bool
    ) -> Result<Option<Team>, HttpResponse> {
    
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
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team", Box::new(err)))
            }
    }

    /// Tries to find team by specified **name** <br/>
    /// **NOTE: if handle_not_found is true, it will return NotFound response** <br/>
    /// Returns: NotFound(**Team not found**) response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn find_by_name(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection, 
        name: &str,
        handle_not_found: bool
    ) -> Result<Option<Team>, HttpResponse> {
    
        return match TeamEntity::find()
            .filter(TeamColumn::Name.eq(name))
            .one(db)
            .await {
                Ok(Some(team)) => Ok(Some(team)),
                Ok(None) => {
                    if handle_not_found {
                        Err(HttpResponse::NotFound().json(SRouteError { message: "Team not found" }))
                    } else {
                        Ok(None)
                    }
                }
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team", Box::new(err)))
            }
    }

    pub async fn delete_by_id(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: TeamId
    ) -> Result<(), HttpResponse> {

        match TeamEntity::delete_by_id(team_id)
            .exec(db)
            .await {
            Ok(_) => {},
            Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting team", Box::new(err)))
        }

        // Delete all cached users team permissions
        // There is no need for that cached data to exist anymore
        match UserTeamPermissionsCache::wipe(redis, team_id).await {
            Ok(_) => Ok(()),
            Err(err) => {
                return Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting cached user team permissions", Box::new(err)));
            }
        }
    }


    // ************************************************************************************
    //
    // MEMBERS
    //
    // ************************************************************************************

    /// Checks if user is member of team <br/>
    /// **NOTE: If user permissions are cached it will return true, otherwise it will get fresh permissions from database and cache them** <br/>
    /// Returns: Forbidden(**Not memeber of team**) response if user is not member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: True if user is member of team
    pub async fn is_member(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: TeamId,
        user_id: UserId,
        handle_not_member: bool
    ) -> Result<bool, HttpResponse> {

        // By checking if there are cached permissions in redis we can avoid unnecessary database query
        let permissions: Option<i32> = match UserTeamPermissionsCache::get(redis, user_id, team_id).await {
            Ok(permissions) => permissions,
            Err(err) => {
                return Err(HttpHelper::log_internal_server_error(endpoint_path, "Getting user team permissions", Box::new(err)));
            }
        };

        if permissions.is_some() { return Ok(true); }

        let is_member: bool = match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .count(db)
            .await {
                Ok(count) => count > 0,
                Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team member", Box::new(err)))
            };

        if !is_member && handle_not_member {
            return Err(HttpResponse::Forbidden().json(SRouteError { message: "Not member of team" }));
        }

        return Ok(is_member);
    }

    /// Tries to find team member by specified **team_id** and **user_id** <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team member
    pub async fn find_member(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        team_id: TeamId,
        user_id: UserId
    ) -> Result<Option<TeamMember>, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .one(db)
            .await {
                Ok(member) => Ok(member),
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team member", Box::new(err)))
            };
    }

    /// Gets team members <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team members
    pub async fn get_members(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        team_id: TeamId
    ) -> Result<Vec<TeamMember>, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .all(db)
            .await {
                Ok(members) => Ok(members),
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team members", Box::new(err)))
            };
    }

    /// Gets count of team members <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Count of team members
    pub async fn get_members_count(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        team_id: TeamId
    ) -> Result<u64, HttpResponse> {

        return match TeamMemberEntity::find()
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .count(db)
            .await {
                Ok(count) => Ok(count),
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team members count", Box::new(err)))
            };
    }

    /// Deletes team member <br/>
    /// Returns: InternalServerError if database query or redis fails <br/>
    /// Returns: Ok
    pub async fn delete_member(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: TeamId,
        user_id: UserId
    ) -> Result<(), HttpResponse> {

        return match UserTeamPermissionsCache::delete(redis, user_id, team_id).await {
            Ok(_) => {
                match TeamMemberEntity::delete_many()
                    .filter(TeamMemberColumn::UserId.eq(user_id))
                    .filter(TeamMemberColumn::TeamId.eq(team_id))
                    .exec(db)
                    .await {
                        Ok(_) => Ok(()),
                        Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting team member", Box::new(err)))
                    }
            },
            Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting user team permissions", Box::new(err)))
        };
    }


    // ************************************************************************************
    //
    // PERMISSIONS
    //
    // ************************************************************************************

    /// Gets user team permissions <br/>
    /// **NOTE: If user permissions are cached it will return them, otherwise it will get fresh permissions from database and cache them** <br/> 
    /// Returns: Forbidden(**Not memeber of team**) response if user is not member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Tuple of team member and team role
    pub async fn get_user_permissions(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        redis: &RedisService,
        team_id: TeamId,
        user_id: UserId
    ) -> Result<i32, HttpResponse> {
    
        // Check if there is cached permissions
        let permissions: Option<i32> = match UserTeamPermissionsCache::get(redis, user_id, team_id).await {
            Ok(permissions) => permissions,
            Err(err) => {
                return Err(HttpHelper::log_internal_server_error(endpoint_path, "Getting user team permissions", Box::new(err)));
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
                return Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team member", Box::new(err)));
            }
        };

        match UserTeamPermissionsCache::cache(redis, user_id, team_id, team_role.permissions).await {
            Ok(_) => {},
            Err(err) => {
                return Err(HttpHelper::log_internal_server_error(endpoint_path, "Caching user team permissions", Box::new(err)));
            }
        }
    
        return Ok(team_role.permissions);
    }


    // ************************************************************************************
    //
    // ROLES
    //
    // ************************************************************************************

    /// Creates new team role <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Created team role
    pub async fn add_new_role(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        new_role: TeamRoleActiveModel
    ) -> Result<TeamRole, HttpResponse> {

        return match new_role.insert(db).await {
            Ok(team_role) => Ok(team_role),
            Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Creating team role", Box::new(err)))
        };
    }

    /// Finds team role id by name <br/>
    /// Returns: NotFound(**Role [] not found**) if team role not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Team role id
    pub async fn find_role_id_by_name(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        team_id: TeamId,
        role_name: &str,
        handle_not_found: bool
    ) -> Result<Option<i64>, HttpResponse> {

        return match TeamRoleEntity::find()
            .select_only()
            .column(TeamRoleColumn::Id)
            .filter(TeamRoleColumn::TeamId.eq(team_id))
            .filter(TeamRoleColumn::Name.eq(role_name))
            .one(db)
            .await {
                Ok(Some(role)) => Ok(Some(role.id)),
                Ok(None) => {
                    if handle_not_found {
                        return Err(HttpResponse::NotFound().json(RouteError { message: format!("Role {} not found", role_name) }));
                    } else {
                        return Ok(None);
                    }
                },
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team role", Box::new(err)))
            };
    }

    /// Checks if team has role with specified **name** <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: True if team has role with specified **name**, false otherwise
    pub async fn has_role_by_name(
        endpoint_path: EndpointPathInfo,
        db: &DatabaseConnection,
        team_id: TeamId,
        role_name: &str
    ) -> Result<bool, HttpResponse> {

        return match TeamRoleEntity::find()
            .filter(TeamRoleColumn::TeamId.eq(team_id))
            .filter(TeamRoleColumn::Name.eq(role_name))
            .count(db)
            .await {
                Ok(count) => Ok(count > 0),
                Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Finding team role", Box::new(err)))
            };
    }

    /// Deletes team role <br/>
    /// Returns: InternalServerError if database query or redis fails <br/>
    /// Returns: Ok
    pub async fn delete_role<C>(
        endpoint_path: EndpointPathInfo,
        db: &C,
        redis: &RedisService,
        team_id: TeamId,
        role_id: i64,
        user_ids: Vec<UserId>
    ) -> Result<(), HttpResponse> 
    where
        C: ConnectionTrait + Send + Sync,
    {
        match TeamRoleEntity::delete_by_id(role_id).exec(db).await {
            Ok(_) => {
                match UserTeamPermissionsCache::delete_for_all_users(redis, team_id, user_ids).await {
                    Ok(_) => Ok(()),
                    Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting user team permissions", Box::new(err)))
                }
            },
            Err(err) => Err(HttpHelper::log_internal_server_error(endpoint_path, "Deleting team role", Box::new(err)))
        }
    }
}
