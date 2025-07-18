// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::team_members::{
    Column as TeamMemberColumn, Entity as TeamMemberEntity, Model as TeamMember,
};
use crate::entity::team_roles::{Entity as TeamRoleEntity, Model as TeamRole};
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::{
    entity::users::{Entity as UserEntity, Model as User},
    enums::type_of_request::TypeOfRequest,
};
use actix_web::HttpResponse;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use std::error::Error;
use tracing::error;
use uuid::Uuid;

// ************************************************************************************
//
// ENDPOINT FUNCTIONS
//
// ************************************************************************************
#[rustfmt::skip]
pub fn endpoint_internal_server_error(
    endpoint_path: (&'static str, TypeOfRequest),
    what_failed: &'static str,
    error: Box<dyn Error>
) -> HttpResponse {
    error!("[FAILED] [{:?}][{}] Reason: {}, Error: {:?}", endpoint_path.1, endpoint_path.0, what_failed, error);
    return HttpResponse::InternalServerError().finish();
}

// ************************************************************************************
//
// PREDIFINED DATABASE QUERIES
//
// ************************************************************************************
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

#[rustfmt::skip]
/// Gets user team permissions <br/>
/// Returns: Forbidden response if user is not member of team <br/>
/// Returns: Internal server error if database query fails <br/>
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
            return Err(endpoint_internal_server_error(
                endpoint_path,
                "Finding team member",
                Box::new(err),
            ));
        }
    };

    return Ok((team_member, team_role));
}

// ************************************************************************************
//
// PERMISSIONS FUNCTIONS
//
// ************************************************************************************
#[rustfmt::skip]
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

#[rustfmt::skip]
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
