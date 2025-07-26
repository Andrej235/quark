// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::entity::team_invitations::{
    ActiveModel as TeamInvitationActiveModel, Column as TeamInvitationColumn,
    Entity as TeamInvitationEntity, Model as TeamInvitation,
};
use crate::entity::team_members::ActiveModel as TeamMemberActiveModel;
use crate::entity::team_roles::{Column as TeamRoleColumn, Entity as TeamRoleEntity};
use crate::entity::teams::{Entity as TeamEntity, Model as Team};
use crate::entity::users::Model as User;
use crate::enums::type_of_request::TypeOfRequest;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::sroute_error::SRouteError;
use crate::repositories::team_repository::TeamRepository;
use crate::repositories::user_repository::UserRepository;
use crate::utils::constants::{
    TEAM_INVITATION_ACCEPT_ROUTE_PATH, TEAM_INVITATION_DECLINE_ROUTE_PATH,
};
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
use actix_web::patch;
use actix_web::web::Path;
use actix_web::{post, web::Data, HttpResponse, Responder};
use chrono::{Duration, Utc};
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter,
};
use sea_orm::{DbErr, QuerySelect};
use std::io::Error as StdError;
use std::io::ErrorKind;
use uuid::Uuid;

// ************************************************************************************
//
// ROUTES - POST
//
// ************************************************************************************
#[utoipa::path(
    post,
    path = TEAM_INVITATION_SEND_ROUTE_PATH.0,
    request_body = TeamInvitationDTO,
    responses(
        (status = 200, description = "Invitation sent"),
        (status = 400, description = "User not verified", body = SRouteError),
        (status = 404, description = "User not found, Team not found", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
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
    let reciever: User = match UserRepository::find_by_email(TEAM_INVITATION_SEND_ROUTE_PATH, db.get_ref(), &team_invitation_data.email, true).await {
        Ok(user) => user.unwrap(),
        Err(err) => return err,
    };

    // Users without verified email cant be invited to teams
    if reciever.is_email_verified == false {
        return HttpResponse::BadRequest().json(SRouteError { message: "User not verified" });
    }

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
            // If status of invitation is DECLINED or ACCEPTED create new invitation instead of updating old new
            if inv.status == TeamInvitationStatus::DECLINED || inv.status == TeamInvitationStatus::ACCEPTED {
                match create_new_team_invitation(db.get_ref(), team_invitation_data, &auth_user, &reciever).await {
                    Ok(_) => return HttpResponse::Ok().finish(),
                    Err(err) => return err,
                }
            }

            let inv_code: String = inv.token.clone();

            // **** Update invitation
            let mut inv_active_model: TeamInvitationActiveModel = inv.into();
            inv_active_model.expires_at = Set(Utc::now().naive_utc() + Duration::days(TEAM_INVITATION_EXPIRATION_OFFSET));

            match inv_active_model.update(db.get_ref()).await {
                Ok(_) => {},
                Err(err) => return HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Updating invitation", Box::new(err)),
            };
            // ****************

            match send_invitation_email(&auth_user.user.username, &reciever.name, &reciever.email, &team.name, inv_code).await {
                Ok(_) => {},
                Err(err) => return HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Sending invitation email", Box::new(err)),
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
            return HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Team not found for invitation", Box::new(StdError::new(ErrorKind::Other, "Team not found")));
        },
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Checking if invitation exists", Box::new(err)),
    };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTES - PATCH
//
// ************************************************************************************
#[utoipa::path(
    patch,
    path = TEAM_INVITATION_ACCEPT_ROUTE_PATH.0,
    params(
        ("code" = String, Path),
    ),
    responses(
        (status = 200, description = "Invitation accepted"),
        (status = 400, description = "Invalid code", body = SRouteError),
        (status = 404, description = "Invitation not found, Team role not found", body = SRouteError),
        (status = 409, description = "Invitation already accepted, Invitation already declined", body = SRouteError),
        (status = 410, description = "Invitation expired", body = SRouteError),
    )   
)]
#[patch("/team-invitations/accept/{code}")]
#[rustfmt::skip]
pub async fn team_invitation_accept(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    path_data: Path<String>
) -> impl Responder {

    let code: String = path_data.into_inner();

    // Check required data
    let invitation: TeamInvitation = match check_ability_to_respond_to_invitation(&db, &auth_user, code.clone(), TEAM_INVITATION_ACCEPT_ROUTE_PATH).await {
        Ok(inv) => inv,
        Err(err) => return err,
    };

    // Update invitation and add user to team
    let team_role_id: i64 = match TeamRoleEntity::find()
        .select_only()
        .column(TeamRoleColumn::Id)
        .filter(TeamRoleColumn::TeamId.eq(invitation.team_id))
        .filter(TeamRoleColumn::Name.eq("Member"))
        .into_tuple()
        .one(db.get_ref())
        .await
        {
            Ok(Some(team_role_id)) => team_role_id,
            Ok(None) => return HttpResponse::NotFound().json(SRouteError { message: "Team role not found" }),
            Err(err) => return HttpHelper::log_internal_server_error(TEAM_INVITATION_ACCEPT_ROUTE_PATH, "Finding team role", Box::new(err)),    
        };

    let transaction = match HttpHelper::begin_transaction(TEAM_INVITATION_ACCEPT_ROUTE_PATH, db.get_ref()).await {
        Ok(transaction) => transaction,
        Err(err) => return err,
    };

    let transaction_result: Result<(), DbErr> = (|| async {

        let team_id: Uuid = invitation.team_id;

        // Update invitation
        let mut inv_active_model: TeamInvitationActiveModel = invitation.into();
        inv_active_model.status = Set(TeamInvitationStatus::ACCEPTED.into());
        inv_active_model.update(db.get_ref()).await?;

        // Create team member
        let team_member_active_model = TeamMemberActiveModel {
            user_id: Set(auth_user.user.id),
            team_id: Set(team_id),
            team_role_id: Set(team_role_id),
            joined_at: Set(Utc::now().naive_utc()),
        };

        team_member_active_model.insert(db.get_ref()).await?;

        Ok(())
    })().await;

    match HttpHelper::commit_transaction(TEAM_INVITATION_ACCEPT_ROUTE_PATH, transaction, transaction_result).await {
        Ok(_) => (),
        Err(err) => return err,
    }

    return HttpResponse::Ok().finish();
}

#[utoipa::path(
    patch,
    path = TEAM_INVITATION_DECLINE_ROUTE_PATH.0,
    params(
        ("code" = String, Path),
    ),
    responses(
        (status = 200, description = "Invitation accepted"),
        (status = 400, description = "Invalid code", body = SRouteError),
        (status = 404, description = "Invitation not found, Team role not found", body = SRouteError),
        (status = 409, description = "Invitation already accepted, Invitation already declined", body = SRouteError),
        (status = 410, description = "Invitation expired", body = SRouteError),
    )   
)]
#[patch("/team-invitations/decline/{code}")]
#[rustfmt::skip]
pub async fn team_invitation_decline(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    path_data: Path<String>
) -> impl Responder {

    let code: String = path_data.into_inner();

    // Check required data
    let invitation: TeamInvitation = match check_ability_to_respond_to_invitation(&db, &auth_user, code.clone(), TEAM_INVITATION_DECLINE_ROUTE_PATH).await {
        Ok(inv) => inv,
        Err(err) => return err,
    };

    // Update invitation
    let mut inv_active_model: TeamInvitationActiveModel = invitation.into();
    inv_active_model.status = Set(TeamInvitationStatus::DECLINED.into());
    
    match inv_active_model.update(db.get_ref()).await {
        Ok(_) => (),
        Err(err) => return HttpHelper::log_internal_server_error(TEAM_INVITATION_DECLINE_ROUTE_PATH, "Updating invitation", Box::new(err)),
    };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// HELPER FUNCTIONS
//
// ************************************************************************************
#[rustfmt::skip]
async fn check_ability_to_respond_to_invitation(db: &DatabaseConnection, auth_user: &AdvancedAuthenticatedUser, code: String, endpoint_path: (&'static str, TypeOfRequest)) -> Result<TeamInvitation, HttpResponse> {

    // Make sure that lenght of code if correct
    if code.len() != 8 {
        return Err(HttpResponse::BadRequest().json(SRouteError { message: "Invalid code" }));
    }

    // Check if invitation exists
    let invitation: TeamInvitation = match TeamInvitationEntity::find() 
        .filter(TeamInvitationColumn::Token.eq(code))
        .filter(TeamInvitationColumn::ReceiverId.eq(auth_user.user.id))
        .one(db).await
    {
        Ok(Some(invitation)) => invitation,
        Ok(None) => return Err(HttpResponse::NotFound().json(SRouteError { message: "Invitation not found" })),
        Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Checking if invitation exists", Box::new(err))),
    };

    // Handle all status codes
    let inv_status = match TeamInvitationStatus::try_from(invitation.status) {
        Ok(inv_status) => inv_status,
        Err(err) => return Err(HttpHelper::log_internal_server_error(endpoint_path, "Converting invitation status", Box::new(err))),
    };

    match inv_status {
        TeamInvitationStatus::SENT => {},
        TeamInvitationStatus::ACCEPTED => return Err(HttpResponse::Conflict().json(SRouteError { message: "Invitation already accepted" })),
        TeamInvitationStatus::DECLINED => return Err(HttpResponse::Conflict().json(SRouteError { message: "Invitation already declined" })),
    }

    if invitation.expires_at == Utc::now().naive_utc() {
        return Err(HttpResponse::Gone().json(SRouteError { message: "Invitation expired" }));
    }

    return Ok(invitation);    
}

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
    let team: Team = match TeamRepository::find_by_id(TEAM_INVITATION_SEND_ROUTE_PATH, db, team_invitation_data.team_id, true).await {
        Ok(team) => team.unwrap(),
        Err(err) => return Err(err),
    };

    let new_inv_code: String = HttpHelper::gen_team_invitation_code();

    let new_inv: TeamInvitationActiveModel = TeamInvitationActiveModel {
        token: Set(new_inv_code.clone()),
        expires_at: Set(Utc::now().naive_utc() + Duration::days(TEAM_INVITATION_EXPIRATION_OFFSET)),
        status: Set(TeamInvitationStatus::SENT.into()),
        team_id: Set(team_invitation_data.team_id),
        sender_id: Set(auth_user.user.id),
        receiver_id: Set(reciever.id),
    };

    match new_inv.insert(db).await {
        Ok(_) => {},
        Err(err) => return Err(HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Inserting invitation", Box::new(err))),
    };

    match send_invitation_email(&auth_user.user.username, &reciever.name, &reciever.email, &team.name, new_inv_code).await {
        Ok(_) => Ok(()),
        Err(err) => return Err(HttpHelper::log_internal_server_error(TEAM_INVITATION_SEND_ROUTE_PATH, "Sending invitation email", Box::new(err))),
    }
}
