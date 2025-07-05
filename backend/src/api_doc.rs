use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::routes::auth_routs::{__path_sign_up, __path_log_in, __path_log_out};
use crate::models::{dtos::create_user_dto::CreateUserDTO, sroute_error::SRouteError};
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(sign_up, log_in, log_out),
    components(schemas(CreateUserDTO, LogInResultDTO, SRouteError)),
    tags(
        (name = "auth", description = "Authentication endpoints")
    )
)]
pub struct ApiDoc;
