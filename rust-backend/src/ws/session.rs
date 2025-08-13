use crate::{utils::websocket_helper::WebsocketHelper, ws::messages::NotificationMessage};
use actix::{Actor, Addr, AsyncContext, Handler, StreamHandler};
use actix_web_actors::ws;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use uuid::Uuid;

#[derive(Clone)]
pub struct WebsocketState {
    pub sessions: Arc<Mutex<HashMap<Uuid, Addr<WebsocketSession>>>>,
}

// ************************************************************************************
//
// SESSION STRUCT
//
// ************************************************************************************
pub struct WebsocketSession {
    user_id: Uuid,
    state: WebsocketState,
}

impl WebsocketSession {
    pub fn new(user_id: Uuid, state: WebsocketState) -> Self {
        Self { user_id, state }
    }
}

// ************************************************************************************
//
// ACTOR IMPLEMENTATION
//
// ************************************************************************************
impl Actor for WebsocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        WebsocketHelper::insert_into_session(&self.state, self.user_id, ctx.address());
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        WebsocketHelper::remove_user_from_session(&self.state, self.user_id);
    }
}

// ************************************************************************************
//
// HANDLER IMPLEMENTATIONS
//
// ************************************************************************************
impl Handler<NotificationMessage> for WebsocketSession {
    type Result = ();

    fn handle(&mut self, msg: NotificationMessage, ctx: &mut Self::Context) {
        ctx.text(msg.message);
    }
}

// For receiving WebSocket messages
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebsocketSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                println!("Received message from {}: {}", self.user_id, text);
                ctx.text(format!("You said: {}", text));
            }
            Ok(ws::Message::Ping(ping)) => ctx.pong(&ping),
            Ok(ws::Message::Close(reason)) => {
                println!("User {} disconnected", self.user_id);
                ctx.close(reason);
            }
            _ => {}
        }
    }
}
