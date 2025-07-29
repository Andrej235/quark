use crate::{
    types::aliases::{TeamId, UserId},
    utils::websocket_helper::WebsocketHelper,
    ws::messages::NotificationMessage,
};
use actix::{Actor, Addr, AsyncContext, Handler, StreamHandler};
use actix_web_actors::ws;
use sea_orm::DatabaseConnection;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use uuid::Uuid;

#[derive(Clone)]
pub struct WebsocketState {
    // Key: UserId, Value: Addr<WebsocketSession>
    pub sessions: Arc<Mutex<HashMap<UserId, Addr<WebsocketSession>>>>,

    // Key: TeamId, Value: HashMap<UserId, Addr<WebsocketSession>>
    pub groups: Arc<Mutex<HashMap<TeamId, HashMap<UserId, Addr<WebsocketSession>>>>>,
}

// ************************************************************************************
//
// SESSION STRUCT
//
// ************************************************************************************
pub struct WebsocketSession {
    db: DatabaseConnection,
    user_id: UserId,
    default_team_id: Option<TeamId>,
    state: WebsocketState,
}

impl WebsocketSession {
    pub fn new(
        db: DatabaseConnection,
        user_id: Uuid,
        default_team_id: Option<TeamId>,
        state: WebsocketState,
    ) -> Self {
        Self {
            db,
            user_id,
            default_team_id,
            state,
        }
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
        WebsocketHelper::initialize_websocket_session(
            &self.db,
            &self.state,
            self.user_id,
            self.default_team_id,
            ctx.address(),
        );
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        WebsocketHelper::drop_websocket_session(&self.state, self.user_id);
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
                ctx.text(format!("You said: {}", text));
            }
            Ok(ws::Message::Ping(ping)) => ctx.pong(&ping),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
            }
            _ => {}
        }
    }
}
