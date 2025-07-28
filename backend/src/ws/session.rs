use actix::{Actor, Addr, AsyncContext, Handler, StreamHandler};
use actix_web_actors::ws;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use uuid::Uuid;

use crate::ws::messages::NotificationMessage;

#[derive(Clone)]
pub struct WebsocketState {
    pub sessions: Arc<Mutex<HashMap<Uuid, Addr<WebSocketSession>>>>,
}

// ************************************************************************************
//
// SESSION STRUCT
//
// ************************************************************************************
pub struct WebSocketSession {
    user_id: Uuid,
    state: WebsocketState,
}

impl WebSocketSession {
    pub fn new(user_id: Uuid, state: WebsocketState) -> Self {
        Self { user_id, state }
    }
}

// ************************************************************************************
//
// ACTOR IMPLEMENTATION
//
// ************************************************************************************
impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let mut sessions = self.state.sessions.lock().unwrap();
        sessions.insert(self.user_id, ctx.address());
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        let mut sessions = self.state.sessions.lock().unwrap();
        sessions.remove(&self.user_id);
    }
}

// ************************************************************************************
//
// HANDLER IMPLEMENTATIONS
//
// ************************************************************************************
impl Handler<NotificationMessage> for WebSocketSession {
    type Result = ();

    fn handle(&mut self, msg: NotificationMessage, ctx: &mut Self::Context) {
        ctx.text(msg.message);
    }
}

// For receiving WebSocket messages
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketSession {
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
