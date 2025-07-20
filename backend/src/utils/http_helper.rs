// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::team_members::{
    Column as TeamMemberColumn, Entity as TeamMemberEntity, Model as TeamMember,
};
use crate::entity::team_roles::{Entity as TeamRoleEntity, Model as TeamRole};
use crate::entity::teams::{Entity as TeamEntity, Model as TeamModel};
use crate::entity::users::Column as UserColumn;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::utils::constants::{
    EMAIL_VERIFICATION_REDIS_KEY_PREFIX, REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION,
};
use crate::utils::redis_service::RedisService;
use crate::{
    entity::users::{Entity as UserEntity, Model as User},
    enums::type_of_request::TypeOfRequest,
};
use actix_web::HttpResponse;
use bb8::{Pool, PooledConnection};
use bb8_redis::RedisConnectionManager;
use rand::distr::Alphanumeric;
use rand::Rng;
use redis::{AsyncCommands, RedisError};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use std::error::Error;
use tracing::error;
use uuid::Uuid;

pub struct HttpHelper;

#[rustfmt::skip]
impl HttpHelper {

    // ************************************************************************************
    //
    // HELPER FUNCTIONS
    //
    // ************************************************************************************
    pub fn endpoint_internal_server_error(
        endpoint_path: (&'static str, TypeOfRequest),
        what_failed: &'static str,
        error: Box<dyn Error>
    ) -> HttpResponse {
        error!("[FAILED] [{:?}][{}] Reason: {}, Error: {:?}", endpoint_path.1, endpoint_path.0, what_failed, error);
        return HttpResponse::InternalServerError().finish();
    }
    
    /// Creates random 6 character long string <br/>
    /// String contains letters and number <br/>
    /// Returns **random string**
    pub fn generate_random_email_verification_code() -> String {
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect();
    
        random_string.to_uppercase()
    }
    
    // ************************************************************************************
    //
    // REDIS QUIERIES
    //
    // ************************************************************************************
    /// Tries to store email verification code in redis <br/>
    /// Returns **Ok** or **RedisError**
    pub async fn store_email_verification_code(
        redis_service: &RedisService,
        user_email: &str,
        email_verification_code: String
    ) -> Result<(), RedisError> {
    
        let redis_key: String = RedisService::create_key(EMAIL_VERIFICATION_REDIS_KEY_PREFIX, user_email);
        let _: () = redis_service.save_value::<String, String, ()>(redis_key, email_verification_code, REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION).await?;

        return Ok(());
    }

    /// Tries to verify email verification code in redis <br/>
    /// Returns **true** if code is valid or **false**, otherwise **RedisError**
    pub async fn verify_email_verification_code(
        redis_service: &RedisService,
        user_email: &str,
        email_verification_code: &str
    ) -> Result<bool, RedisError> {

        let redis_key: String = RedisService::create_key(EMAIL_VERIFICATION_REDIS_KEY_PREFIX, user_email);
        let stored_code: Option<String> = redis_service.get_value(&redis_key).await?;

        match stored_code {
            Some(code) => {
                if code == email_verification_code {
                    // Delete the code after successful verification (optional but recommended)
                    let _: () = redis_service.delete_value(redis_key).await?;
                    return Ok(true);
                }
            },
            None => {}
        }

        return Ok(false);
    }
    
    // ************************************************************************************
    //
    // PREDIFINED DATABASE QUERIES
    //
    // ************************************************************************************
    pub async fn find_user_by_id(
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

    pub async fn find_user_by_email(
        db: &DatabaseConnection,
        user_email: String
    ) -> Result<Option<User>, Box<dyn Error>> {
        return match UserEntity::find()
            .filter(UserColumn::Email.eq(user_email))
            .one(db)
            .await {
                Ok(user) => Ok(user),
                Err(err) => {
                    return Err(Box::new(err));
                }
            };
    }
    
    /// Tries to find team with specified team_id <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn find_team(
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
    
    /// Gets user team permissions <br/>
    /// Returns: Forbidden response if user is not member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Tuple of team member and team role
    pub async fn get_user_team_permissions(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        user_id: Uuid,
        team_id: Uuid,
    ) -> Result<(TeamMember, TeamRole), HttpResponse> {
    
        let (team_member, team_role): (TeamMember, TeamRole) = match TeamMemberEntity::find()
            .filter(TeamMemberColumn::UserId.eq(user_id))
            .filter(TeamMemberColumn::TeamId.eq(team_id))
            .find_also_related(TeamRoleEntity)
            .one(db)
            .await {
    
            // If everything is ok return both team member and team role objects
            Ok(Some((member, Some(role)))) => (member, role),
    
            // If team role is not found or team member is not found return forbidden response
            Ok(Some((_, None))) | Ok(None) => {
                return Err(HttpResponse::Forbidden().json(SRouteError { message: "Not memeber of team" }));
            },
    
            // Something went to shit and return internal server error
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team member", Box::new(err)));
            }
        };
    
        return Ok((team_member, team_role));
    }
    
    // ************************************************************************************
    //
    // PERMISSIONS FUNCTIONS
    //
    // ************************************************************************************
    /// Checks if all required permissions are present
    /// Returns (), otherwise status forbidden
    pub fn check_permissions(
        permissions: i32,
        required_permissions: Vec<Permission>
    ) -> Result<(), HttpResponse> {
    
        // TODO: Improve performance by caching
    
        let perm = Permission::from_bits(permissions)
            .ok_or_else(|| HttpResponse::Forbidden().json(SRouteError { message: "Invalid permissions" }))?;
    
        let required = required_permissions.into_iter().fold(Permission::empty(), |acc, p| acc | p);
    
        if (perm & required) == required {
            Ok(())
        } else {
            Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }))
        }
    }
    
    /// Checks if required permission is present
    /// Returns (), otherwise status forbidden
    pub fn check_permission(
        permissions: i32,
        required_permission: Permission
    ) -> Result<(), HttpResponse> {
    
        // TODO: Improve performance by caching
    
        let perm: Permission = match Permission::from_bits(permissions) {
            Some(perm) => perm,
            None => return Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }))
        };
    
        if perm.contains(required_permission) == false {
            return Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }));
        }
    
        return Ok(());
    }
}
