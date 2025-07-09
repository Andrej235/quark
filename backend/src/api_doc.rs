use crate::models::dtos::create_team_dto::CreateTeamDTO;
use crate::models::dtos::create_team_role_dto::CreateTeamRoleDTO;
use crate::models::dtos::jwt_refresh_token_pair::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::password_reset_dto::PasswordResetDTO;
use crate::models::{dtos::create_user_dto::CreateUserDTO, sroute_error::SRouteError};
use crate::routes::team_roles_routes::__path_team_role_create;
use crate::routes::team_routs::__path_team_create;
use crate::routes::user_routs::{
    __path_check, __path_log_in, __path_log_out, __path_refresh, __path_reset_password,
    __path_send_email_verification, __path_sign_up, __path_verify_email,
};
use utoipa::OpenApi;

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
        sign_up, log_in, log_out, refresh, verify_email, send_email_verification, reset_password, check,

        // team routes
        team_create,

        // team role routes
        team_role_create),
        
    components(schemas(
        // user routes
        CreateUserDTO, LogInResultDTO, SRouteError, JWTRefreshTokenPairDTO, PasswordResetDTO,

        // team routes
        CreateTeamDTO,
    
        // team role routes
        CreateTeamRoleDTO)),
    tags(
        (name = "user", description = "User endpoints"),
        (name = "team", description = "Team endpoints"),
        (name = "team/roles", description = "Team roles endpoints"),
    )
)]
pub struct ApiDoc;
