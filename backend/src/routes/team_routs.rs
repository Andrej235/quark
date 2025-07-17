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
use crate::models::middleware::basic_authenticated_user::BasicAuthenticatedUser;
use crate::models::middleware::validated_json::ValidatedJson;
use crate::models::role::Role;
use crate::models::sroute_error::SRouteError;
use crate::utils::constants::{
    TEAM_CREATE_ROUTE_PATH, TEAM_DELETE_ROUTE_PATH, TEAM_UPDATE_ROUTE_PATH,
};
use crate::utils::http_helper::endpoint_internal_server_error;
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
    static ref OWNER_PERMISSIONS: i32 = Role::all().bits();
    static ref MODERATOR_PERMISSIONS: i32 =
        (Role::CAN_ADD_TEAM_MEMBER | Role::CAN_REMOVE_TEAM_MEMBER).bits();
}

// ************************************************************************************
//
// ROUTES - POST
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_CREATE_ROUTE_PATH,
    request_body = CreateTeamDTO,
    responses(
        (status = 200, description = "Team created"),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team/create")]
#[rustfmt::skip]
pub async fn team_create(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    team_json: ValidatedJson<CreateTeamDTO>,
) -> impl Responder {

    // Get json data
    let team_data: &CreateTeamDTO = team_json.get_data();

    // Only user with verified email can create team
    if auth_user.user.is_email_verified == false { return HttpResponse::Unauthorized().body("Unverified email"); }

    // Dont allow user to create team if there is team with same name
    match TeamEntity::find()
        .filter(TeamColumn::Name.eq(team_data.name.clone()))
        .one(db.get_ref())
        .await {
        Ok(None) => (),
        Ok(Some(_)) => return HttpResponse::BadRequest().json(SRouteError { message: "Team already exists" }),
        Err(err) => return endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Checking for existing team", Box::new(err)),
    }

    // Begin transaction
    let transaction = match db.begin().await {
        Ok(transaction) => transaction,
        Err(err) => return endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Starting transaction", Box::new(err)),
    };

    let transaction_result: Result<(), DbErr> = (|| async {

        // Create team
        let team = TeamActiveModel {
            id: Set(Uuid::now_v7()),
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
            user_id: Set(auth_user.user.id),
            team_id: Set(team.id),
            team_role_id: Set(owner_role.id),
            ..Default::default()
        }.insert(&transaction).await?;

        // Update default team id of user
        let mut user_active_model: UserActiveModel = auth_user.user.into();
        user_active_model.default_team_id = Set(Some(team.id));
        user_active_model.update(&transaction).await?;

        transaction.commit().await
    })().await; 

    match transaction_result {
        Ok(_) => (),
        Err(err) => return endpoint_internal_server_error(TEAM_CREATE_ROUTE_PATH, "Creating team", Box::new(err)),
    }

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTES - PUT
//
// ************************************************************************************
#[put("/team/update/{team_id}")]
pub async fn team_update(
    db: Data<DatabaseConnection>,
    //_auth_user: AuthenticatedUser,
    team_id: Path<Uuid>,
    json_data: ValidatedJson<UpdateTeamDTO>,
) -> impl Responder {
    let id = team_id.into_inner();
    let update_data = json_data.get_data();

    match TeamEntity::find_by_id(id).one(db.get_ref()).await {
        Ok(Some(existing)) => {
            let mut model: TeamActiveModel = existing.into();
            model.name = Set(update_data.name.clone());
            model.description = Set(update_data.description.clone());

            match model.update(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(err) => endpoint_internal_server_error(
                    TEAM_UPDATE_ROUTE_PATH,
                    "Updating team",
                    Box::new(err),
                ),
            }
        }
        Ok(None) => HttpResponse::NotFound().body("Team not found"),
        Err(err) => {
            endpoint_internal_server_error(TEAM_UPDATE_ROUTE_PATH, "Finding team", Box::new(err))
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
    path = TEAM_DELETE_ROUTE_PATH,
    params(
        ("team_id" = Uuid, Path, description = "ID of the team to delete"),
    ),
    responses(
        (status = 200, description = "Team delete"),
    )
)]
#[delete("/team/delete/{team_id}")]
pub async fn team_delete(
    db: Data<DatabaseConnection>,
    _auth_user: BasicAuthenticatedUser,
    team_id: Path<Uuid>,
) -> impl Responder {
    // Get ownership of incoming data
    let id = team_id.into_inner();

    // Delete team
    let delete_result = TeamEntity::delete_by_id(id).exec(db.get_ref()).await;

    match delete_result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(err) => {
            return endpoint_internal_server_error(
                TEAM_DELETE_ROUTE_PATH,
                "Deleting team",
                Box::new(err),
            );
        }
    }
}
