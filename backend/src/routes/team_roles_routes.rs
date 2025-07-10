use actix_web::{
    delete, post,
    web::{Data, Json, Path},
    HttpResponse, Responder,
};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};

use crate::{
    entity::team_roles::{
        ActiveModel as TeamRoleActiveModel, Entity as TeamRoleEntity, Model as TeamRole,
    },
    models::{
        authenticated_user::AuthenticatedUser, dtos::create_team_role_dto::CreateTeamRoleDTO,
        sroute_error::SRouteError,
    },
    traits::endpoint_json_body_data::EndpointJsonBodyData,
    utils::http_helper::endpoint_internal_server_error,
};

const TEAM_ROLE_CREATE_ROUTE_PATH: &'static str = "/team-role/create";
const TEAM_ROLE_DELETE_ROUTE_PATH: &'static str = "/team-role/delete/{team_role_id}";

#[utoipa::path(
    post,
    path = TEAM_ROLE_CREATE_ROUTE_PATH,
    request_body = CreateTeamRoleDTO,
    responses(
        (status = 200, description = "Team role created"),
        (status = 400, description = "Possible errors: Validation failed", body = SRouteError),
    )
)]
#[post("/team-role/create")]
pub async fn team_role_create(
    db: Data<DatabaseConnection>,
    _user: AuthenticatedUser,
    team_role_json: Json<CreateTeamRoleDTO>,
) -> impl Responder {
    let mut team_role_data: CreateTeamRoleDTO = team_role_json.into_inner();

    if team_role_data.validate() == false {
        return HttpResponse::BadRequest().json(SRouteError {
            message: "Validation failed",
        });
    }

    let team_role_insertion_result: Result<TeamRole, DbErr> = TeamRoleActiveModel {
        name: Set(team_role_data.name),
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
    path = TEAM_ROLE_DELETE_ROUTE_PATH,
    params(
        ("team_role_id" = i64, Path, description = "ID of the team role to delete"),
    ),
    responses(
        (status = 200, description = "Team role deleted"),
        (status = 400, description = "Internal server error", body = SRouteError),
    )
)]
#[delete("/team-role/delete/{team_role_id}")]
pub async fn team_role_delete(
    db: Data<DatabaseConnection>,
    _user: AuthenticatedUser,
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
