// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::entity::team_members::{Column as TeamMemberColumn, Entity as TeamMemberEntity};
use crate::entity::team_roles::Entity as TeamRoleEntity;
use crate::entity::users::Entity as UserEntity;
use crate::models::dtos::kick_team_member_dto::KickTeamMemberDTO;
use crate::models::dtos::team_member_info::TeamMemberInfo;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::middleware::validated_json::ValidatedJson;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::repositories::team_repository::TeamRepository;
use crate::repositories::user_repository::UserRepository;
use crate::routes::team_routs::OWNER_PERMISSIONS;
use crate::utils::constants::{TEAM_MEMBERS_GET_ROUTE_PATH, TEAM_MEMBERS_KICK_ROUTE_PATH};
use crate::utils::http_helper::HttpHelper;
use crate::utils::websocket_messages::WebsocketMessages;
use crate::ws::session::WebsocketState;
use crate::{
    models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser,
    utils::redis_service::RedisService,
};
use actix_web::get;
use actix_web::web::Path;
use actix_web::{delete, web::Data, HttpResponse, Responder};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use uuid::Uuid;

// ************************************************************************************
//
// ROUTES - GET
//
// ************************************************************************************
#[utoipa::path(
    get,
    path = TEAM_MEMBERS_GET_ROUTE_PATH.0,
    params(
        ("team_id" = Uuid, Path),
    ),
    responses(
        (status = 200, description = "Team members"),
        (status = 403, description = "Not member of team", body = SRouteError),
    )
)]
#[get("/team-members/{team_id}")]
#[rustfmt::skip]
pub async fn team_get_members(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    path_data: Path<Uuid>,
) -> impl Responder {

    let team_id: Uuid = path_data.into_inner();

    // Check if user is member of team
    match TeamRepository::is_member(TEAM_MEMBERS_GET_ROUTE_PATH, db.get_ref(), redis_service.get_ref(), team_id, auth_user.user.id, true).await {
        Ok(_) => {},
        Err(err) => return err
    };

    // Make sure that user has permission to get team members info
    let team_permissions: i32 = match TeamRepository::get_user_permissions(
        TEAM_MEMBERS_GET_ROUTE_PATH, 
        db.get_ref(),
        redis_service.get_ref(),
        team_id,
        auth_user.user.id, 
    ).await {
        Ok(permissions) => permissions,
        Err(err) => return err,
    };

    match HttpHelper::check_permission(team_permissions, Permission::CAN_EDIT_SETTINGS) {
        Ok(_) => (),
        Err(err) => return err
    }

    // Get team members
    let team_members = match TeamMemberEntity::find()
        .filter(TeamMemberColumn::TeamId.eq(team_id))
        .find_also_related(UserEntity)
        .find_also_related(TeamRoleEntity)
        .all(db.get_ref())
        .await 
    {
        Ok(members) => {
            members
            .into_iter()
            .filter_map(|(member, user, role)| {
                match (member, user, role) {
                    (member, Some(user), Some(role)) => {
                        Some(TeamMemberInfo {
                            username: user.username,
                            profile_picture: HttpHelper::convert_image_to_base64(user.profile_picture),
                            email: user.email,
                            role_name: role.name,
                            joined_at: member.joined_at
                        })
                    }
                    _ => None
                }
            })
            .collect::<Vec<TeamMemberInfo>>()
        },
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_MEMBERS_GET_ROUTE_PATH, "Finding team members", Box::new(err))    
    };

    return HttpResponse::Ok().json(team_members);
}

// ************************************************************************************
//
// ROUTES - DELETE
//
// ************************************************************************************
#[utoipa::path(
    delete,
    path = TEAM_MEMBERS_KICK_ROUTE_PATH.0,
    request_body = KickTeamMemberDTO,
    responses(
        (status = 200, description = "Team member kicked"),
        (status = 403, description = "Not member of team, Permission too low, User not found, Cannot kick owner of team", body = SRouteError),
        (status = 409, description = "Cannot remove yourself", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[delete("/team_members/kick")]
#[rustfmt::skip]
pub async fn team_member_kick(
    db: Data<DatabaseConnection>,
    websocket: Data<WebsocketState>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    body_data: ValidatedJson<KickTeamMemberDTO>,
) -> impl Responder {

    let kick_team_dto: &KickTeamMemberDTO = body_data.get_data();

    // Check if user can kick someone
    // This functions all will return ForbiddenError if user is not member of team
    let user_permissions: i32 = match TeamRepository::get_user_permissions(TEAM_MEMBERS_KICK_ROUTE_PATH, db.get_ref(), redis_service.get_ref(), kick_team_dto.team_id, auth_user.user.id).await {
        Ok(permissions) => permissions,
        Err(err) => return err
    };

    match HttpHelper::check_permission(user_permissions, Permission::CAN_REMOVE_USERS) {
        Ok(_) => (),
        Err(err) => return err
    };

    // Get id of user that will be removed
    let user_to_remove_id: Uuid = match UserRepository::get_id_by_username(TEAM_MEMBERS_KICK_ROUTE_PATH, db.get_ref(), &kick_team_dto.username, true).await {
        Ok(user_id) => user_id.unwrap(),
        Err(err) => return err
    };

    let user_to_remove_permissions: i32 = match TeamRepository::get_user_permissions(TEAM_MEMBERS_KICK_ROUTE_PATH, db.get_ref(), redis_service.get_ref(), kick_team_dto.team_id, user_to_remove_id, ).await {
        Ok(permissions) => permissions,
        Err(err) => return err
    };

    // Prevent user from removing themselves
    if auth_user.user.id == user_to_remove_id {
        return HttpResponse::Conflict().json(SRouteError::new("Cannot remove yourself"));
    }

    // Prevent user from kicking owner of team
    if user_to_remove_permissions == OWNER_PERMISSIONS.clone() {
        return HttpResponse::Forbidden().json(SRouteError::new("Cannot kick owner of team"));
    }

    // Remove user from team
    match TeamRepository::delete_member(TEAM_MEMBERS_KICK_ROUTE_PATH, db.get_ref(), redis_service.get_ref(), kick_team_dto.team_id, user_to_remove_id).await {
        Ok(_) => (),
        Err(err) => return err
    };

    // Send notification
    match WebsocketMessages::send_team_kicked_notification(TEAM_MEMBERS_KICK_ROUTE_PATH, db.get_ref(), websocket.get_ref(), user_to_remove_id, &kick_team_dto.team_name).await {
        Ok(_) => return HttpResponse::Ok().finish(),
        Err(err) => return err
    }
}
