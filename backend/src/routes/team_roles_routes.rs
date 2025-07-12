use actix_web::{post, web::Data, HttpResponse, Responder};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, DbErr};

use crate::{
    entity::team_roles::{ActiveModel as TeamRoleActiveModel, Model as TeamRole},
    models::{
        dtos::{create_team_role_dto::CreateTeamRoleDTO, validatio_error_dto::ValidationErrorDTO},
        validated_json::ValidatedJson,
    },
    utils::{constants::TEAM_ROLE_CREATE_ROUTE_PATH, http_helper::endpoint_internal_server_error},
};

#[utoipa::path(
    post,
    path = TEAM_ROLE_CREATE_ROUTE_PATH,
    request_body = CreateTeamRoleDTO,
    responses(
        (status = 200, description = "Team role created"),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team-role/create")]
pub async fn team_role_create(
    db: Data<DatabaseConnection>,
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
        Ok(_) => (),
        Err(err) => {
            return endpoint_internal_server_error(
                TEAM_ROLE_CREATE_ROUTE_PATH,
                "Inserting new team role",
                Box::new(err),
            );
        }
    }

    return HttpResponse::Ok().finish();
}
