// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::entity::team_members::ActiveModel as TeamMemberActiveModel;
use crate::entity::team_roles::ActiveModel as TeamRoleActiveModel;
use crate::entity::teams::{
    ActiveModel as TeamActiveModel, Column as TeamColumn, Entity as TeamEntity,
};
use crate::entity::users::ActiveModel as UserActiveModel;
use crate::models::dtos::create_team_dto::CreateTeamDTO;
use crate::models::dtos::update_team_dto::UpdateTeamDTO;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser;
use crate::models::middleware::validated_json::ValidatedJson;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::utils::constants::{
    TEAM_CREATE_ROUTE_PATH, TEAM_DELETE_ROUTE_PATH, TEAM_UPDATE_ROUTE_PATH,
};
use crate::utils::http_helper::HttpHelper;
use crate::utils::redis_service::RedisService;
use actix_web::web::Path;
use actix_web::{delete, put};
use actix_web::{post, web::Data, HttpResponse, Responder};
use lazy_static::lazy_static;
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter,
    TransactionTrait,
};
use uuid::Uuid;

// ************************************************************************************
//
// STATICS
//
// ************************************************************************************
lazy_static! {
    static ref OWNER_PERMISSIONS: i32 = Permission::all().bits();
    static ref MODERATOR_PERMISSIONS: i32 = (Permission::CAN_VIEW_USERS
        | Permission::CAN_VIEW_PROSPECTS
        | Permission::CAN_CREATE_PROSPECTS
        | Permission::CAN_EDIT_PROSPECTS
        | Permission::CAN_DELETE_PROSPECTS
        | Permission::CAN_VIEW_EMAILS
        | Permission::CAN_CREATE_EMAILS
        | Permission::CAN_EDIT_EMAILS
        | Permission::CAN_DELETE_EMAILS
        | Permission::CAN_SEND_EMAILS)
        .bits();
}

// ************************************************************************************
//
// ROUTES - POST
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_CREATE_ROUTE_PATH.0,
    request_body = CreateTeamDTO,
    responses(
        (status = 200, description = "Team created"),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team")]
#[rustfmt::skip]
pub async fn team_create(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    team_json: ValidatedJson<CreateTeamDTO>,
) -> impl Responder {

    // Get json data
    let team_data: &CreateTeamDTO = team_json.get_data();

    // Dont allow user to create team if there is team with same name
    match TeamEntity::find()
        .filter(TeamColumn::Name.eq(team_data.name.clone()))
        .one(db.get_ref())
        .await {
        Ok(None) => (),
        Ok(Some(_)) => return HttpResponse::BadRequest().json(SRouteError { message: "Team already exists" }),
        Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Checking for existing team", Box::new(err)),
    }

    // Begin transaction
    let team_id: Uuid = Uuid::now_v7(); // We create here teams id because we need to use it later for caching users team permissions
    let user_id: Uuid = auth_user.user.id; // Only reason that this is here is because of borrow checker

    let transaction = match db.begin().await {
        Ok(transaction) => transaction,
        Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Starting transaction", Box::new(err)),
    };

    let transaction_result: Result<(), DbErr> = (|| async {

        // Create team
        let team = TeamActiveModel {
            id: Set(team_id.clone()),
            name: Set(team_data.name.clone()),
            description: Set(team_data.description.clone()),  
        }.insert(&transaction).await?;

        // Create default team roles
        let owner_role = TeamRoleActiveModel {
            name: Set("Owner".to_string()),
            team_id: Set(team.id),
            permissions: Set(OWNER_PERMISSIONS.clone()),
            ..Default::default()
        }.insert(&transaction).await?;

        _ = TeamRoleActiveModel {
            name: Set("Moderator".to_string()),
            team_id: Set(team.id),
            permissions: Set(MODERATOR_PERMISSIONS.clone()),
            ..Default::default()
        }.insert(&transaction).await?;

        // Create team member
        _ = TeamMemberActiveModel {
            user_id: Set(user_id.clone()),
            team_id: Set(team.id),
            team_role_id: Set(owner_role.id),
            ..Default::default()
        }.insert(&transaction).await?;

        // Update default team id of user if not already set
        if auth_user.user.default_team_id.is_none() {
            let mut user_active_model: UserActiveModel = auth_user.user.into();
            user_active_model.default_team_id = Set(Some(team.id));
            user_active_model.update(&transaction).await?;
        }

        transaction.commit().await
    })().await; 

    match transaction_result {
        Ok(_) => (),
        Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Creating team", Box::new(err)),
    }

    // Cache team permissions in redis
    match HttpHelper::cache_user_team_permissions(redis_service.get_ref(), user_id, team_id, OWNER_PERMISSIONS.clone()).await {
        Ok(_) => (),
        Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Caching team permissions", Box::new(err)),
    };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTES - PUT
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_UPDATE_ROUTE_PATH.0,
    request_body = UpdateTeamDTO,
    params(
        ("team_id" = uuid::Uuid, Path)
    ),
    responses(
        (status = 200, description = "Team created"),
        (status = 404, description = "Team not found", body = SRouteError),
        (status = 409, description = "Team with same name already exists", body = SRouteError),
        (status = 422, description = "", body = ValidationErrorDTO),
    )
)]
#[put("/team/{team_id}")]
#[rustfmt::skip]
pub async fn team_update(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    team_id: Path<Uuid>,
    json_data: ValidatedJson<UpdateTeamDTO>,
) -> impl Responder {
    
    let team_id: Uuid = team_id.into_inner();
    let new_team_info: &UpdateTeamDTO = json_data.get_data();

    // Prevent user from updating team if they dont have permission
    let team_permissions: i32 = match HttpHelper::get_user_team_permissions(
        TEAM_DELETE_ROUTE_PATH, 
        db.get_ref(), 
        redis_service.get_ref(),
        auth_user.user.id, 
        team_id,
    ).await {
        Ok(permissions) => permissions,
        Err(err) => return err,
    };

    match HttpHelper::check_permission(team_permissions, Permission::CAN_EDIT_SETTINGS) {
        Ok(_) => (),
        Err(err) => return err
    }

    // Update team
    match TeamEntity::find_by_id(team_id).one(db.get_ref()).await {
        Ok(Some(existing)) => {
            
            // Check for name conflict
            match TeamEntity::find()
                .filter(TeamColumn::Name.eq(new_team_info.name.clone()))
                .filter(TeamColumn::Id.ne(team_id))
                .one(db.get_ref())
                .await {
                Ok(None) => {},
                Ok(Some(_)) => {
                    return HttpResponse::Conflict().json(SRouteError { message: "Team name already exists" });
                }
                Err(err) => {
                    return HttpHelper::endpoint_internal_server_error(TEAM_UPDATE_ROUTE_PATH, "Checking for name conflict", Box::new(err));
                }
            };

            // Abort updating team if new team data is same as before
            // Prevents unnecessary database updates
            if existing.name == new_team_info.name && existing.description == new_team_info.description {
                return HttpResponse::Ok().finish();
            }

            // Update existing team
            let mut model: TeamActiveModel = existing.into();
            model.name = Set(new_team_info.name.clone());
            model.description = Set(new_team_info.description.clone());

            match model.update(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(err) => HttpHelper::endpoint_internal_server_error(TEAM_UPDATE_ROUTE_PATH, "Updating team", Box::new(err)),
            }
        }
        Ok(None) => HttpResponse::NotFound().json(SRouteError {
            message: "Team not found",
        }),
        Err(err) => {
            HttpHelper::endpoint_internal_server_error(TEAM_UPDATE_ROUTE_PATH, "Finding team", Box::new(err))
        }
    }
}

// ************************************************************************************
//
// ROUTES - DELETE
//
// ************************************************************************************
#[utoipa::path(
    delete,
    path = TEAM_DELETE_ROUTE_PATH.0,
    params(
        ("team_id" = Uuid, Path),
    ),
    responses(
        (status = 200, description = "Team deleted"),
        (status = 403, description = "Possibe messages: Not memeber of team, 
                                                        Not allowed to delete team", body = SRouteError),
    )
)]
#[delete("/team/{team_id}")]
#[rustfmt::skip]
pub async fn team_delete(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser,
    team_id: Path<Uuid>,
) -> impl Responder {

    let team_id = team_id.into_inner();

    // Prevent user from deleting team if they are not member of the team or user does not have permission to delete team
    let team_permissions: i32 = match HttpHelper::get_user_team_permissions(
        TEAM_DELETE_ROUTE_PATH, 
        db.get_ref(), 
        redis_service.get_ref(),
        auth_user.user.id, 
        team_id,
    ).await {
        Ok(permissions) => permissions,
        Err(err) => return err,
    };

    match HttpHelper::check_permission(team_permissions, Permission::CAN_DELETE_TEAM) {
        Ok(_) => (),
        Err(err) => return err
    }

    // Delete team
    let delete_result = TeamEntity::delete_by_id(team_id).exec(db.get_ref()).await;

    match delete_result {
        Ok(_) => {},
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(
                TEAM_DELETE_ROUTE_PATH,
                "Deleting team",
                Box::new(err),
            );
        }
    }

    // Delete all cached users team permissions
    // There is no need for that cached data to exist anymore
    match HttpHelper::delete_unused_cached_user_team_permissions(redis_service.get_ref(), team_id).await {
        Ok(_) => (),
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(TEAM_DELETE_ROUTE_PATH, "Deleting cached user team permissions", Box::new(err));
        }
    };

    return HttpResponse::Ok().finish();
}
