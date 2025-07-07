// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::teams::{ActiveModel as TeamActiveModel, Model as Team};
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

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
#[post("/team/create")]
pub async fn team_create(
    db: Data<DatabaseConnection>,
    team_data_json: Json<CreateTeamDTO>,
) -> impl Responder {
    // --------->
    // Base checks
    // --------->
    // Get ownership of incoming data
    let mut team_data: CreateTeamDTO = team_data_json.into_inner();

    // Run incoming data validation
    if team_data.validate() == false {
        return HttpResponse::BadRequest().json(SRouteError {
            message: "Validation failed",
        });
    }

    // --------->
    // Main execution
    // --------->
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
            println!("-> team_create errored (tried to create team): {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    }

    return HttpResponse::Ok().finish();
}
