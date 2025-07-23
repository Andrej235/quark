// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::team_members::{Column as TeamMemberColumn, Entity as TeamMemberEntity};
use crate::entity::team_roles::{
    Column as TeamRoleColumn, Entity as TeamRoleEntity, Model as TeamRole,
};
use crate::entity::teams::{Entity as TeamEntity, Model as TeamModel};
use crate::entity::users::Column as UserColumn;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::utils::constants::{
    EMAIL_VERIFICATION_REDIS_KEY_PREFIX, REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION,
    REDIS_USER_TEAM_PERMISSIONS_EXPIRATION, USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX,
};
use crate::utils::redis_service::RedisService;
use crate::{
    entity::users::{Entity as UserEntity, Model as User},
    enums::type_of_request::TypeOfRequest,
};
use crate::{RESEND_EMAIL, RESEND_INSTANCE};
use actix_web::HttpResponse;
use rand::distr::Alphanumeric;
use rand::Rng;
use redis::RedisError;
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::Resend;
use sea_orm::error::DbErr;
use sea_orm::{
    ColumnTrait, DatabaseConnection, DatabaseTransaction, EntityTrait, QueryFilter,
    TransactionTrait,
};
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

    /// Creates random 8 character long string <br/>
    /// String contains letters and number <br/>
    /// Returns **random string**
    pub fn generate_team_invitation_code() -> String {
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(8)
            .map(char::from)
            .collect();
    
        random_string.to_uppercase()
    }
    
    // Sends email with provided subject and html content
    /// Returns **Ok** or **ResendError**
    pub async fn send_email(
        reciever_email: &str, 
        email_subject: &'static str,
        html: &str
    ) -> Result<(), resend_rs::Error> {

        let resend_instance: &Resend = RESEND_INSTANCE.get().unwrap();

        // Prep email data
        let from: String = format!("Quark <{}>", RESEND_EMAIL.get().unwrap());
        let to: [&str; 1] = [reciever_email];

        // Generate email
        let email: CreateEmailBaseOptions = CreateEmailBaseOptions::new(&from, to, email_subject)
            .with_html(html);

        // Send email
        match resend_instance.emails.send(email).await {
            Ok(_) => Ok(()),
            Err(err) => return Err(err),
        }
    }

    /// Begins transaction <br/>
    /// Returns: InternalServerError transaction creation fails
    /// Returns: DatabaseTransaction
    pub async fn begin_transaction(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection
    ) -> Result<DatabaseTransaction, HttpResponse> {
        match db.begin().await {
            Ok(transaction) => Ok(transaction),
            Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Creating transaction", Box::new(err))),
        }
    }

    /// Commits transaction <br/>
    /// Returns: InternalServerError transaction commit or rollback fails <br/>
    /// Returns: Ok 
    pub async fn commit_transaction(
        endpoint_path: (&'static str, TypeOfRequest),
        transaction: DatabaseTransaction,
        transaction_result: Result<(), DbErr>
    ) -> Result<(), HttpResponse> {
        match transaction_result {
            Ok(_) => {
                if let Err(e) = transaction.commit().await {
                    return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Committing transaction", Box::new(e)));
                }

                return Ok(());
            }
            Err(err) => {
                if let Err(e) = transaction.rollback().await {
                    return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Rolling back transaction", Box::new(e)));
                }

                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Creating team", Box::new(err)));
            }
        }
    }



    // ************************************************************************************
    //
    // REDIS QUERIES
    //
    // ************************************************************************************
    /// Tries to store email verification code in redis <br/>
    /// Returns **Ok** or **RedisError**
    pub async fn cache_email_verification_code(
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
    pub async fn verify_cached_email_verification_code(
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
    

    pub async fn cache_user_team_permissions(
        redis_service: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
        permissions: i32
    ) -> Result<(), RedisError> {

        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        let _: () = redis_service.save_value::<String, i32, ()>(redis_key, permissions, REDIS_USER_TEAM_PERMISSIONS_EXPIRATION).await?;

        return Ok(());
    }
    
    pub async fn get_cached_user_team_permissions(
        redis_service: &RedisService,
        user_id: Uuid,
        team_id: Uuid
    ) -> Result<Option<i32>, RedisError> {

        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        return redis_service.get_value(redis_key).await;
    }

    pub async fn delete_cached_user_team_permissions(
        redis_service: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
    ) -> Result<(), RedisError> {

        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        let _: () = redis_service.delete_value::<String, ()>(redis_key).await?;

        return Ok(());
    }

    pub async fn delete_unused_cached_user_team_permissions(
        redis_service: &RedisService,
        team_id: Uuid
    ) -> Result<(), RedisError> {
        
        let redis_pattern: String = format!("{}:*:{}", USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, team_id);
        let _: () = redis_service.delete_matching_keys(redis_pattern).await?;

        return Ok(());
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

    /// Tries to find user by specified **email** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if user is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found user
    pub async fn find_user_by_email(
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
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding user", Box::new(err)))
            };
    }
    
    /// Tries to find team by specified **id** <br/>
    /// NOTE: if handle_not_found is true, it will return NotFound response <br/>
    /// Returns: NotFound response if team is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team
    pub async fn find_team_by_id(
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

    /// Tries to find team role by specified **name** <br/>
    /// Returns: NotFound response if team role is not found <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Found team role
    pub async fn find_team_role_by_name(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        team_id: Uuid,
        role_name: &str
    ) -> Result<Option<TeamRole>, HttpResponse> {

        return match TeamRoleEntity::find()
            .filter(TeamRoleColumn::TeamId.eq(team_id))
            .filter(TeamRoleColumn::Name.eq(role_name))
            .one(db)
            .await {
                Ok(Some(team_role)) => Ok(Some(team_role)),
                Ok(None) => Err(HttpResponse::NotFound().json(SRouteError { message: "Team role not found" })),
                Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Finding team role", Box::new(err)))
            };
    }

    /// Gets user team permissions <br/>
    /// Returns: Forbidden response if user is not member of team <br/>
    /// Returns: InternalServerError if database query fails <br/>
    /// Returns: Tuple of team member and team role
    pub async fn get_user_team_permissions(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection,
        redis: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
    ) -> Result<i32, HttpResponse> {
    
        // Check if there is cached permissions
        let permissions: Option<i32> = match HttpHelper::get_cached_user_team_permissions(redis, user_id, team_id).await {
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

        match HttpHelper::cache_user_team_permissions(redis, user_id, team_id, team_role.permissions).await {
            Ok(_) => {},
            Err(err) => {
                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Caching user team permissions", Box::new(err)));
            }
        }
    
        return Ok(team_role.permissions);
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
