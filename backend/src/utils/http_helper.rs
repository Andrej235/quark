// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use actix_web::HttpResponse;
use std::error::Error;
use tracing::error;

// ------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
pub fn endpoint_internal_server_error(
    route_path: &'static str,
    what_failed: &'static str,
    error: Box<dyn Error>
) -> HttpResponse {
    error!("[FAILED] [{}] Reason: {}, Error: {:?}", route_path, what_failed, error);
    return HttpResponse::InternalServerError().finish();
}
