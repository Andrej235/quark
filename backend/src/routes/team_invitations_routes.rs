// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::entity::team_invitations::{
    ActiveModel as TeamInvitationActiveModel, Column as TeamInvitationColumn,
    Entity as TeamInvitationEntity,
};
use crate::entity::teams::{Entity as TeamEntity, Model as Team};
use crate::entity::users::Model as User;
use crate::models::sroute_error::SRouteError;
use crate::{
    models::{
        dtos::team_invitation_dto::TeamInvitationDTO,
        middleware::{
            advanced_authenticated_user::AdvancedAuthenticatedUser, validated_json::ValidatedJson,
        },
        team_invitation_status::TeamInvitationStatus,
    },
    utils::{
        constants::{TEAM_INVITATION_EXPIRATION_OFFSET, TEAM_INVITATION_SEND_ROUTE_PATH},
        http_helper::HttpHelper,
    },
};
use actix_web::{post, web::Data, HttpResponse, Responder};
use chrono::{Duration, Utc};
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter,
};
use std::io::Error as StdError;
use std::io::ErrorKind;

// ************************************************************************************
//
// ROUTES - POST
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_INVITATION_SEND_ROUTE_PATH.0,
    responses(
        (status = 200, description = "Invitation sent"),
        (status = 401, description = "User not logged in"),
        (status = 404, description = "User not found, Team not found", body = SRouteError),
    )   
)]
#[post("/team-invitations")]
#[rustfmt::skip]
pub async fn team_invitation_send(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<TeamInvitationDTO>,
) -> impl Responder {

    let team_invitation_data: &TeamInvitationDTO = json_data.get_data();

    // Check if user with provided email exists
    let reciever: User = match HttpHelper::find_user_by_email(TEAM_INVITATION_SEND_ROUTE_PATH, db.get_ref(), &team_invitation_data.email, true).await {
        Ok(user) => user.unwrap(),
        Err(err) => return err,
    };

    // Check if invitation already exists
    match TeamInvitationEntity::find()
        .filter(TeamInvitationColumn::TeamId.eq(team_invitation_data.team_id))
        .filter(TeamInvitationColumn::SenderId.eq(auth_user.user.id))
        .filter(TeamInvitationColumn::ReceiverId.eq(reciever.id))
        .find_also_related(TeamEntity)
        .one(db.get_ref()).await 
    {
        Ok(Some((inv, Some(team)))) => { // In case that invitation already exists update expires_at and send email again

            // SPECIAL CASE
            // If status of invitation is DECLINED create new invitation instead of updating old new
            if inv.status == TeamInvitationStatus::DECLINED.bits() {
                match create_new_team_invitation(db.get_ref(), team_invitation_data, &auth_user, &reciever).await {
                    Ok(_) => return HttpResponse::Ok().finish(),
                    Err(err) => return err,
                }
            }

            let inv_code: String = inv.token.clone();
            
            let mut inv_active_model: TeamInvitationActiveModel = inv.into();
            inv_active_model.expires_at = Set(Utc::now().naive_utc() + Duration::days(TEAM_INVITATION_EXPIRATION_OFFSET));

            match inv_active_model.update(db.get_ref()).await {
                Ok(_) => {},
                Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Updating invitation", Box::new(err)),
            };

            match send_invitation_email(&auth_user.user.username, &reciever.name, &reciever.email, &team.name, inv_code).await {
                Ok(_) => {},
                Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Sending invitation email", Box::new(err)),
            }
        },
        Ok(None) => { // In case that invitation doesn't exist create it
            match create_new_team_invitation(db.get_ref(), team_invitation_data, &auth_user, &reciever).await {
                Ok(_) => {},
                Err(err) => return err,
            }
        },
        Ok(Some((_, None))) => {
            // Shouldn't happen if FK constraints are correct.
            return HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Team not found for invitation", Box::new(StdError::new(ErrorKind::Other, "Team not found")));
        },
        Err(err) => return HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Checking if invitation exists", Box::new(err)),
    };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// HELPER FUNCTIONS
//
// ************************************************************************************
#[rustfmt::skip]
async fn send_invitation_email(sender_username: &str, reciever_name: &str, reciever_email: &str, team_name: &str, code: String) -> Result<(), resend_rs::Error> {
    
    let html: String = format!("<p>Hello {}, you have been by {} invited to join team: <b>{}</b> <br/> Use this code: <b>{}</b> to join the team</p>", reciever_name, sender_username, team_name, code);

    match HttpHelper::send_email(reciever_email, "Team Invitation", html.as_str()).await {
        Ok(_) => Ok(()),
        Err(err) => return Err(err),
    }
}

#[rustfmt::skip]
async fn create_new_team_invitation(db: &DatabaseConnection, team_invitation_data: &TeamInvitationDTO, auth_user: &AdvancedAuthenticatedUser, reciever: &User) -> Result<(), HttpResponse> {

    // Get team data
    // Because we dont have access to team data from query
    let team: Team = match HttpHelper::find_team_by_id(TEAM_INVITATION_SEND_ROUTE_PATH, db, team_invitation_data.team_id, true).await {
        Ok(team) => team.unwrap(),
        Err(err) => return Err(err),
    };

    let new_inv_code: String = HttpHelper::generate_team_invitation_code();

    let new_inv: TeamInvitationActiveModel = TeamInvitationActiveModel {
        token: Set(new_inv_code.clone()),
        expires_at: Set(Utc::now().naive_utc() + Duration::days(TEAM_INVITATION_EXPIRATION_OFFSET)),
        status: Set(TeamInvitationStatus::SENT.bits()),
        team_id: Set(team_invitation_data.team_id),
        sender_id: Set(auth_user.user.id),
        receiver_id: Set(reciever.id),
    };

    match new_inv.insert(db).await {
        Ok(_) => {},
        Err(err) => return Err(HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Inserting invitation", Box::new(err))),
    };

    match send_invitation_email(&auth_user.user.username, &reciever.name, &reciever.email, &team.name, new_inv_code).await {
        Ok(_) => Ok(()),
        Err(err) => return Err(HttpHelper::endpoint_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Sending invitation email", Box::new(err))),
    }
}
