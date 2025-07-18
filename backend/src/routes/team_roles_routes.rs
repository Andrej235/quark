use actix_web::{
    delete, post, put,
    web::{Data, Path},
    HttpResponse, Responder,
};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};

use crate::{
    entity::team_roles::{
        ActiveModel as TeamRoleActiveModel, Entity as TeamRoleEntity, Model as TeamRole,
    },
    models::{
        dtos::{
            create_team_role_dto::CreateTeamRoleDTO, update_team_role_dto::UpdateTeamRoleDTO,
            validation_error_dto::ValidationErrorDTO,
        },
        middleware::basic_authenticated_user::BasicAuthenticatedUser,
        middleware::validated_json::ValidatedJson,
    },
    utils::{
        constants::{
            TEAM_ROLE_CREATE_ROUTE_PATH, TEAM_ROLE_DELETE_ROUTE_PATH, TEAM_ROLE_UPDATE_ROUTE_PATH,
        },
        http_helper::endpoint_internal_server_error,
    },
};

#[utoipa::path(
    post,
    path = TEAM_ROLE_CREATE_ROUTE_PATH.0,
    request_body = CreateTeamRoleDTO,
    responses(
        (status = 200, description = "Team role created"),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team-role/create")]
pub async fn team_role_create(
    db: Data<DatabaseConnection>,
    _auth_user: BasicAuthenticatedUser,
    json_data: ValidatedJson<CreateTeamRoleDTO>,
) -> impl Responder {
    // Get json data
    let team_role_data: &CreateTeamRoleDTO = json_data.get_data();

    // Create team
    let team_role_insertion_result: Result<TeamRole, DbErr> = TeamRoleActiveModel {
        name: Set(team_role_data.name.clone()),
        team_id: Set(team_role_data.team_id),
        ..Default::default()
    }
    .insert(db.get_ref())
    .await;

    match team_role_insertion_result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(err) => {
            return endpoint_internal_server_error(
                TEAM_ROLE_CREATE_ROUTE_PATH,
                "Inserting new team role",
                Box::new(err),
            );
        }
    }
}

#[utoipa::path(
    delete,
    path = TEAM_ROLE_DELETE_ROUTE_PATH.0,
    params(
        ("team_role_id" = i64, Path, description = "ID of the team role to delete"),
    ),
    responses(
        (status = 200, description = "Team role deleted"),
    )
)]
#[delete("/team-role/delete/{team_role_id}")]
pub async fn team_role_delete(
    db: Data<DatabaseConnection>,
    _auth_user: BasicAuthenticatedUser,
    team_role_id: Path<i64>,
) -> impl Responder {
    let id = team_role_id.into_inner();

    let delete_result = TeamRoleEntity::delete_by_id(id).exec(db.get_ref()).await;

    match delete_result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(err) => endpoint_internal_server_error(
            TEAM_ROLE_DELETE_ROUTE_PATH,
            "Deleting team role",
            Box::new(err),
        ),
    }
}

#[utoipa::path(
    put,
    path = TEAM_ROLE_UPDATE_ROUTE_PATH.0,
    request_body = UpdateTeamRoleDTO
)]
#[put("/team-role/update/{team_role_id}")]
pub async fn team_role_update(
    db: Data<DatabaseConnection>,
    // _auth_user: AuthenticatedUser,
    team_role_id: Path<i64>,
    json_data: ValidatedJson<UpdateTeamRoleDTO>,
) -> impl Responder {
    let id = team_role_id.into_inner();
    let update_data = json_data.get_data();

    match TeamRoleEntity::find_by_id(id).one(db.get_ref()).await {
        Ok(Some(existing)) => {
            let mut model: TeamRoleActiveModel = existing.into();
            model.name = Set(update_data.name.clone());

            match model.update(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(err) => endpoint_internal_server_error(
                    TEAM_ROLE_UPDATE_ROUTE_PATH,
                    "Updating team role",
                    Box::new(err),
                ),
            }
        }

        Ok(None) => HttpResponse::NotFound().body("Team role not found"),
        Err(err) => endpoint_internal_server_error(
            TEAM_ROLE_UPDATE_ROUTE_PATH,
            "Finding team role",
            Box::new(err),
        ),
    }
}
