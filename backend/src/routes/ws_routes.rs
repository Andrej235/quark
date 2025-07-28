use std::sync::Arc;
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

#[get("/ws")]
async fn ws_handler(
    req: HttpRequest,
    stream: Payload,
    state: Data<WebsocketState>,
    auth_user: AdvancedAuthenticatedUser,
) -> Result<HttpResponse, actix_web::Error> {
    let ws = WebsocketSession::new(
        auth_user.user.id,
        WebsocketState {
            sessions: Arc::clone(&state.get_ref().sessions),
        },
    );
    ws::start(ws, &req, stream)
}
