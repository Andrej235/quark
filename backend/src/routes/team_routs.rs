use crate::entity::teams::{ActiveModel as TeamActiveModel, Model as Team};
use crate::utils::http_helper::endpoint_internal_server_error;
use crate::{
    models::{dtos::create_team_dto::CreateTeamDTO, sroute_error::SRouteError},
    traits::endpoint_json_body_data::EndpointJsonBodyData,
};
use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse, Responder,
};
use sea_orm::ActiveValue::Set;
use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr};
use uuid::Uuid;

const TEAM_CREATE_ROUTE_PATH: &'static str = "/team/create";

#[post("/team/create")]
pub async fn team_create(
    db: Data<DatabaseConnection>,
    team_json: Json<CreateTeamDTO>,
) -> impl Responder {
    // Get ownership of incoming data
    let mut team_data: CreateTeamDTO = team_json.into_inner();

    // Run incoming data validation
    if team_data.validate() == false {
        return HttpResponse::BadRequest().json(SRouteError {
            message: "Validation failed",
        });
    }

    // Create team
    let team_insertion_result: Result<Team, DbErr> = TeamActiveModel {
        id: Set(Uuid::now_v7()),
        name: Set(team_data.name),
        description: Set(team_data.description),
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
