use crate::models::dtos::jwt_refresh_token_pair::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::{dtos::create_user_dto::CreateUserDTO, sroute_error::SRouteError};
use crate::routes::auth_routs::{__path_log_in, __path_log_out, __path_sign_up, __path_check, __path_refresh};
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Quark Backend Open API",
        description = "This API handles backend/database operations.",
        version = "1.0",
        license(name = "MIT", url = "https://opensource.org/licenses/MIT")
    ),
    paths(sign_up, log_in, log_out, check, refresh),
    components(schemas(CreateUserDTO, LogInResultDTO, SRouteError, JWTRefreshTokenPairDTO)),
    tags(
        (name = "auth", description = "Authentication endpoints")
    )
)]
pub struct ApiDoc;
