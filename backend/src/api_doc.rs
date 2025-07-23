use crate::models::dtos::create_team_dto::CreateTeamDTO;
use crate::models::dtos::create_team_role_dto::CreateTeamRoleDTO;
use crate::models::dtos::jwt_refresh_token_pair_dto::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::team_invitation_dto::TeamInvitationDTO;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::dtos::password_reset_dto::PasswordResetDTO;
use crate::models::route_error::RouteError;
use crate::models::{dtos::create_user_dto::CreateUserDTO, sroute_error::SRouteError};
use crate::routes::team_roles_routes::__path_team_role_create;
use crate::routes::team_routs::{__path_team_create, __path_team_delete};
use crate::routes::user_routs::{
    __path_check, __path_user_log_in, __path_user_log_out, __path_user_refresh, __path_user_password_reset, __path_user_update,
    __path_send_email_verification, __path_user_sign_up, __path_verify_email, __path_user_update_profile_picture, __path_get_user_info,
    __path_user_update_default_team
};
use utoipa::OpenApi;
use crate::models::dtos::user_info_dto::UserInfoDTO;
use crate::models::dtos::team_info_dto::TeamInfoDTO;
use crate::routes::team_invitations_routes::{__path_team_invitation_send, __path_team_invitation_accept};

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Quark Backend Open API",
        description = "This API handles backend/database operations.",
        version = "1.0",
        license(name = "MIT", url = "https://opensource.org/licenses/MIT")
    ),
    paths(
        // user routes
        user_sign_up, user_log_in, user_log_out, user_refresh, verify_email, send_email_verification, user_password_reset, user_update, check,
        user_update_profile_picture, get_user_info, user_update_default_team,

        // team routes
        team_create, team_delete,

        // team role routes
        team_role_create,

        // team invitation routes
        team_invitation_send, team_invitation_accept
    ),
        
    components(schemas(
        // Common
        SRouteError, RouteError, ValidationErrorDTO,

        // user routes
        CreateUserDTO, LogInResultDTO, JWTRefreshTokenPairDTO, PasswordResetDTO, UserInfoDTO, TeamInfoDTO,

        // team routes
        CreateTeamDTO,
    
        // team role routes
        CreateTeamRoleDTO,
    
        // team invitation routes
        TeamInvitationDTO
    ))
)]
pub struct ApiDoc;
