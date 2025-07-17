use crate::entity::teams::{ActiveModel as TeamActiveModel, Entity as TeamEntity, Model as Team};
use crate::models::dtos::create_team_dto::CreateTeamDTO;
use crate::models::dtos::update_team_dto::UpdateTeamDTO;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::middleware::basic_authenticated_user::BasicAuthenticatedUser;
use crate::models::middleware::validated_json::ValidatedJson;
use crate::utils::constants::{
    TEAM_CREATE_ROUTE_PATH, TEAM_DELETE_ROUTE_PATH, TEAM_UPDATE_ROUTE_PATH,
};
use crate::utils::http_helper::endpoint_internal_server_error;
use actix_web::web::Path;
use actix_web::{delete, put};
use actix_web::{post, web::Data, HttpResponse, Responder};
use sea_orm::ActiveValue::Set;
use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr, EntityTrait};
use uuid::Uuid;

#[utoipa::path(
    post,
    path = TEAM_CREATE_ROUTE_PATH,
    request_body = CreateTeamDTO,
    responses(
        (status = 200, description = "Team created"),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/team/create")]
pub async fn team_create(
    db: Data<DatabaseConnection>,
    _auth_user: BasicAuthenticatedUser,
    team_json: ValidatedJson<CreateTeamDTO>,
) -> impl Responder {
    // Get json data
    let team_data: &CreateTeamDTO = team_json.get_data();

    let team_insertion_result: Result<Team, DbErr> = TeamActiveModel {
        id: Set(Uuid::now_v7()),
        name: Set(team_data.name.clone()),
        description: Set(team_data.description.clone()),
    }
    .insert(db.get_ref())
    .await;

    match team_insertion_result {
        Ok(_) => (),
        Err(err) => {
            return endpoint_internal_server_error(
                TEAM_CREATE_ROUTE_PATH,
                "Inserting new team",
                Box::new(err),
            );
        }
    }

    return HttpResponse::Ok().finish();
}

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
