use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, PartialEq, Serialize, Deserialize, ToSchema)]
/// This is used when BadRequest or InternalServerError is returned from api endpoint
pub struct SRouteError {
    pub message: &'static str,
}
