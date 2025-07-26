// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::{
    entity::{
        team_members::{Column as TeamMemberColumn, Entity as TeamMemberEntity},
        team_roles::{
            ActiveModel as TeamRoleActiveModel, Column as TeamRoleColumn, Entity as TeamRoleEntity,
            Model as TeamRole,
        },
    },
    models::{
        dtos::{
            create_team_role_dto::CreateTeamRoleDTO, delete_team_role_dto::DeleteTeamRoleDTO,
            team_role_info_dto::TeamRoleInfoDTO, update_team_role_dto::UpdateTeamRoleDTO,
            validation_error_dto::ValidationErrorDTO,
        },
        middleware::{
            advanced_authenticated_user::AdvancedAuthenticatedUser, validated_json::ValidatedJson,
        },
        permission::Permission,
        sroute_error::SRouteError,
    },
    repositories::team_repository::TeamRepository,
    utils::{
        constants::{
            DEFAULT_TEAM_ROLE_NAMES, TEAM_ROLE_CREATE_ROUTE_PATH, TEAM_ROLE_DELETE_ROUTE_PATH,
            TEAM_ROLE_GET_ROUTE_PATH, TEAM_ROLE_UPDATE_ROUTE_PATH,
        },
        http_helper::HttpHelper,
        redis_service::RedisService,
    },
};
use actix_web::{
    delete, get, post, put,
    web::{Data, Path},
    HttpResponse, Responder,
};
use sea_orm::{
    prelude::Expr, ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection,
    DatabaseTransaction, EntityTrait, QueryFilter, QuerySelect,
};
use uuid::Uuid;

// ************************************************************************************
//
// ROUTE - POST
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_ROLE_CREATE_ROUTE_PATH.0,
    request_body = CreateTeamRoleDTO,
    responses(
        (status = 200, description = "Team role created"),
        (status = 403, description = "Not member of team, Permission too low", body = SRouteError),
        (status = 404, description = "Team not found", body = SRouteError),
        (status = 409, description = "Role already exists", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team-role")]
#[rustfmt::skip]
pub async fn team_role_create(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<CreateTeamRoleDTO>,
) -> impl Responder {

    let team_role_data: &CreateTeamRoleDTO = json_data.get_data();

    // Check if user can edit roles
    match check_user_can_edit_roles(db.get_ref(), redis_service.get_ref(), team_role_data.team_id, auth_user.user.id).await {
        Ok(_) => {},
        Err(err) => return err        
    }

    // Create team role
    let role_already_exists: bool = match TeamRepository::has_role_by_name(TEAM_ROLE_CREATE_ROUTE_PATH, db.get_ref(), team_role_data.team_id, &team_role_data.name).await {
        Ok(role_exists) => role_exists,
        Err(err) => return err
    };

    if role_already_exists {
        return HttpResponse::Conflict().json(SRouteError { message: "Role already exists" }); 
    }

    match TeamRepository::add_new_role(TEAM_ROLE_CREATE_ROUTE_PATH, db.get_ref(), TeamRoleActiveModel {
        team_id: Set(team_role_data.team_id),
        name: Set(team_role_data.name.clone()),
        ..Default::default()        
    }).await {
        Ok(_) => {},
        Err(err) => return err
    }

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTE - PUT
//
// ************************************************************************************
#[utoipa::path(
    put,
    path = TEAM_ROLE_CREATE_ROUTE_PATH.0,
    request_body = UpdateTeamRoleDTO,
    responses(
        (status = 200, description = "Team role created"),
        (status = 403, description = "Not member of team, Permission too low", body = SRouteError),
        (status = 404, description = "Team not found, Team role not found", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[put("/team-role")]
#[rustfmt::skip]
pub async fn team_role_update(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<UpdateTeamRoleDTO>,
    path_data: Path<Uuid>,
) -> impl Responder {

    let team_id: Uuid = path_data.into_inner();
    let team_role_data: &UpdateTeamRoleDTO = json_data.get_data();

    // Abort request if user is trying to delete default role
    if is_role_default(&team_role_data.old_name) {
        return HttpResponse::Forbidden().json(SRouteError { message: "Cannot delete default role" }); 
    }

    // Check if user can edit roles
    match check_user_can_edit_roles(db.get_ref(), redis_service.get_ref(), team_id, auth_user.user.id).await {
        Ok(_) => {},
        Err(err) => return err        
    };

    // Update team role
    let team_role: TeamRole = match TeamRoleEntity::find()
        .filter(TeamRoleColumn::TeamId.eq(team_id))
        .filter(TeamRoleColumn::Name.eq(&team_role_data.old_name))
        .one(db.get_ref())
        .await 
    {
        Ok(Some(team_role)) => team_role,
        Ok(None) => return HttpResponse::NotFound().json(SRouteError { message: "Team role not found" }),
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_ROLE_UPDATE_ROUTE_PATH, "Finding team role", Box::new(err))
    };

    let mut team_role_active_model: TeamRoleActiveModel = team_role.into();
    team_role_active_model.name = Set(team_role_data.name.clone());

    match team_role_active_model.update(db.get_ref()).await {
        Ok(_) => {},
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_ROLE_UPDATE_ROUTE_PATH, "Updating team role", Box::new(err))
    }

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTE - GET
//
// ************************************************************************************
#[utoipa::path(
    get,
    path = TEAM_ROLE_GET_ROUTE_PATH.0,
    params(
        ("team_id" = Uuid, Path),
    ),
    responses(
        (status = 200, description = "Team role created"),
        (status = 403, description = "Not member of team", body = SRouteError),
    )
)]
#[get("/team-role/{team_id}")]
#[rustfmt::skip]
pub async fn team_roles_get(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    path_data: Path<Uuid>,
) -> impl Responder {
    
    let team_id: Uuid = path_data.into_inner();

    // Check if user is team member
    match TeamRepository::is_member(TEAM_ROLE_GET_ROUTE_PATH, db.get_ref(), redis_service.get_ref(), team_id, auth_user.user.id, true).await {
        Ok(_) => {},
        Err(err) => return err
    }

    // Get team roles
    let team_roles: Vec<TeamRoleInfoDTO> = match TeamRoleEntity::find()
        .filter(TeamRoleColumn::TeamId.eq(team_id))
        .all(db.get_ref())
        .await 
    {
        Ok(team_roles) => {
            team_roles
                .into_iter()
                .map(|team_role| {
                    TeamRoleInfoDTO {
                        name: team_role.name,
                        permissions: team_role.permissions,
                    }
                })
                .collect::<Vec<TeamRoleInfoDTO>>()
        },
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_ROLE_GET_ROUTE_PATH, "Finding team roles", Box::new(err))
    };

    return HttpResponse::Ok().json(team_roles);
}

// ************************************************************************************
//
// ROUTE - DELETE
//
// ************************************************************************************
#[utoipa::path(
    delete,
    path = TEAM_ROLE_CREATE_ROUTE_PATH.0,
    request_body = DeleteTeamRoleDTO,
    responses(
        (status = 200, description = "Team role deleted"),
        (status = 403, description = "Not member of team, Permission too low", body = SRouteError),
        (status = 404, description = "Team not found, Team role not found", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[delete("/team-role")]
#[rustfmt::skip]
pub async fn team_role_delete(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<DeleteTeamRoleDTO>,
) -> impl Responder {
    
    let team_role_data: &DeleteTeamRoleDTO = json_data.get_data();

    // Abort request if user is trying to delete default role
    if is_role_default(&team_role_data.name) {
        return HttpResponse::Forbidden().json(SRouteError { message: "Cannot delete default role" }); 
    }

    // Check if user can edit roles
    match check_user_can_edit_roles(db.get_ref(), redis_service.get_ref(), team_role_data.team_id, auth_user.user.id).await {
        Ok(_) => {},
        Err(err) => return err        
    };

    // Find role ids of role that will be deleted and Member role
    let role_id: i64 = match TeamRepository::find_role_id_by_name(TEAM_ROLE_DELETE_ROUTE_PATH, db.get_ref(), team_role_data.team_id, &team_role_data.name, true).await {
        Ok(result) => result.unwrap(),
        Err(err) => return err
    };

    let member_role_id: i64 = match TeamRepository::find_role_id_by_name(TEAM_ROLE_DELETE_ROUTE_PATH, db.get_ref(), team_role_data.team_id, "Member", true).await {
        Ok(result) => result.unwrap(),
        Err(err) => return err
    };

    // Chnage roles of users that have role that will be deleted to default Member role
    let transaction: DatabaseTransaction = match HttpHelper::begin_transaction(TEAM_ROLE_DELETE_ROUTE_PATH, db.get_ref()).await {
        Ok(transaction) => transaction,
        Err(err) => return err
    };

    let transaction_result: Result<(), HttpResponse> = (|| async {

        // Swap old role with new default role because old will be deleted
        match TeamMemberEntity::update_many()
            .filter(TeamMemberColumn::TeamId.eq(team_role_data.team_id))
            .filter(TeamMemberColumn::TeamRoleId.eq(role_id))
            .col_expr(TeamMemberColumn::TeamRoleId, Expr::value(member_role_id))
            .exec(&transaction)
            .await 
        {
            Ok(s) => s,
            Err(err) => return Err(HttpHelper::log_internal_server_error(TEAM_ROLE_DELETE_ROUTE_PATH, "Updating team members", Box::new(err))) 
        };

        // Delete role from database and delete cached role permissions of users 
        let users_id: Vec<Uuid> = match TeamMemberEntity::find()
            .select_only()
            .column(TeamMemberColumn::UserId)
            .filter(TeamMemberColumn::TeamId.eq(team_role_data.team_id))
            .filter(TeamMemberColumn::TeamRoleId.eq(role_id))
            .into_tuple()
            .all(&transaction)
            .await
        {
            Ok(users_id) => users_id,
            Err(err) => return Err(HttpHelper::log_internal_server_error(TEAM_ROLE_DELETE_ROUTE_PATH, "Finding team members", Box::new(err)))
        };

        match TeamRepository::delete_role(TEAM_ROLE_DELETE_ROUTE_PATH, &transaction, redis_service.get_ref(), team_role_data.team_id, role_id, users_id).await {
            Ok(_) => {},
            Err(err) => return Err(err)
        } 

        Ok(())
    })().await;

    match HttpHelper::commit_http_transaction(TEAM_ROLE_DELETE_ROUTE_PATH, transaction, transaction_result).await {
        Ok(_) => {},
        Err(err) => return err
    };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// HELPER FUNCTIONS
//
// ************************************************************************************
#[rustfmt::skip]
async fn check_user_can_edit_roles(db: &DatabaseConnection, redis_service: &RedisService, team_id: Uuid, user_id: Uuid) -> Result<(), HttpResponse> {
    
    // Check if team exists
    match TeamRepository::exists(TEAM_ROLE_CREATE_ROUTE_PATH, db, team_id, true).await {
        Ok(_) => (),
        Err(err) => return Err(err)
    };

    // Chcek if user is part of team and has require permissions
    let user_permissions: i32 = match TeamRepository::get_user_permissions(TEAM_ROLE_CREATE_ROUTE_PATH, db, redis_service, user_id, team_id).await {
        Ok(user_permissions) => user_permissions,
        Err(err) => return Err(err)
    };

    match HttpHelper::check_permission(user_permissions, Permission::CAN_EDIT_ROLES) {
        Ok(_) => Ok(()),
        Err(err) => return Err(err)
    }
}

#[rustfmt::skip]
fn is_role_default(role_name: &str) -> bool {
    DEFAULT_TEAM_ROLE_NAMES.contains(&role_name)
}
