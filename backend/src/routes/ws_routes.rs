use crate::models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser;
use actix::{Actor, Addr, AsyncContext, Message, StreamHandler};
use actix_web::web::Data;
use actix_web::{get, web::Payload, Result};
use actix_web::{Error, HttpRequest, HttpResponse};
use actix_web_actors::ws;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

type UserMap = Arc<Mutex<HashMap<Uuid, Addr<UserSocket>>>>;

#[derive(Message)]
#[rtype(result = "()")]
pub struct ExternalMessage(pub String);

pub struct UserSocket {
    pub user_id: Uuid,
    pub user_map: UserMap,
}

impl Actor for UserSocket {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let addr = ctx.address();
        self.user_map.lock().unwrap().insert(self.user_id, addr);
        println!("User {} connected", self.user_id);
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        self.user_map.lock().unwrap().remove(&self.user_id);
        println!("User {} disconnected", self.user_id);
    }
}

// 🛠 Handle messages from CLIENT (WebSocket)
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for UserSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                println!("Received from user {}: {}", self.user_id, text);
                ctx.text(format!("Echo: {}", text));
            }
            Ok(ws::Message::Close(reason)) => {
                println!("Client closed connection: {:?}", reason);
                ctx.close(reason);
                ctx.stop();
            }
            Ok(_) => {}
            Err(e) => {
                println!("WebSocket error: {:?}", e);
                ctx.stop();
            }
        }
    }
}

// ✅ Handle messages from OTHER ACTORS (ExternalMessage)
impl actix::Handler<ExternalMessage> for UserSocket {
    type Result = ();

    fn handle(&mut self, msg: ExternalMessage, ctx: &mut Self::Context) {
        ctx.text(format!("External: {}", msg.0));
    }
}

#[get("/ws")]
#[rustfmt::skip]
pub async fn ws_shake(
    req: HttpRequest,
    body: Payload,
    user_map: Data<UserMap>,
    auth_user: AdvancedAuthenticatedUser,
) -> Result<HttpResponse, Error> {
    ws::start(
        UserSocket {
            user_id: auth_user.user.id,
            user_map: user_map.get_ref().clone(),
        },
        &req,
        body,
    )
}
