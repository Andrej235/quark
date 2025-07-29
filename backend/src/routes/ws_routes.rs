// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::{
    models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser,
    ws::session::{WebsocketSession, WebsocketState},
};
use actix_web::{
    get,
    web::{Data, Payload},
    HttpRequest, HttpResponse,
};
use actix_web_actors::ws;
use sea_orm::DatabaseConnection;
use std::sync::Arc;

// ************************************************************************************
//
// ROUTES - GET
//
// ************************************************************************************
#[get("/ws")]
#[rustfmt::skip]
async fn ws_handler(
    db: Data<DatabaseConnection>,
    req: HttpRequest,
    stream: Payload,
    state: Data<WebsocketState>,
    auth_user: AdvancedAuthenticatedUser,
) -> Result<HttpResponse, actix_web::Error> {
    
    let ws = WebsocketSession::new(
        db.get_ref().clone(),
        auth_user.user.id,
        auth_user.user.default_team_id,
        WebsocketState {
            sessions: Arc::clone(&state.get_ref().sessions),
            groups: Arc::clone(&state.get_ref().groups),
        },
    );

    ws::start(ws, &req, stream)
}
