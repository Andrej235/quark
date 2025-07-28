use crate::{
    models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser,
    ws::{
        messages::TeamInviteMessage,
        session::{AppState, WebSocketSession},
    },
};
use actix_web::{
    get, post,
    web::{Data, Path, Payload},
    HttpRequest, HttpResponse, Responder,
};
use actix_web_actors::ws;
use std::sync::Arc;
use uuid::Uuid;

#[get("/ws")]
async fn ws_handler(
    req: HttpRequest,
    stream: Payload,
    state: Data<AppState>,
    auth_user: AdvancedAuthenticatedUser,
) -> Result<HttpResponse, actix_web::Error> {
    let ws = WebSocketSession::new(
        auth_user.user.id,
        AppState {
            sessions: Arc::clone(&state.get_ref().sessions),
        },
    );
    ws::start(ws, &req, stream)
}

#[post("/send-message/{user_id}")]
async fn send_message(path: Path<Uuid>, state: Data<AppState>, body: String) -> impl Responder {
    let user_id = path.into_inner();
    let sessions = state.sessions.lock().unwrap();

    if let Some(addr) = sessions.get(&user_id) {
        addr.do_send(TeamInviteMessage::new(body));
        HttpResponse::Ok().body("Message sent")
    } else {
        HttpResponse::NotFound().body("User not connected")
    }
}
