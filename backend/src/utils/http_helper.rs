// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::team_members::{Column as TeamMemberColumn, Entity as TeamMemberEntity};
use crate::entity::team_roles::{
    Column as TeamRoleColumn, Entity as TeamRoleEntity, Model as TeamRole,
};
use crate::enums::type_of_request::TypeOfRequest;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::utils::cache::user_team_permissions_cache::UserTeamPermissionsCache;
use crate::utils::redis_service::RedisService;
use crate::{RESEND_EMAIL, RESEND_INSTANCE};
use actix_web::HttpResponse;
use rand::distr::Alphanumeric;
use rand::Rng;
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
    // PREDIFINED DATABASE QUERIES
    //
    // ************************************************************************************
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
