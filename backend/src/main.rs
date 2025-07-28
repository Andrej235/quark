// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    api_doc::ApiDoc,
    routes::{
        team_invitations_routes::{
            team_invitation_accept, team_invitation_decline, team_invitation_send,
        },
        team_members_routes::{team_get_members, team_member_kick},
        team_roles_routes::{
            team_role_change, team_role_create, team_role_delete, team_role_update, team_roles_get,
        },
        team_routs::{team_create, team_delete, team_leave, team_update},
        user_routs::{
            check, get_user_info, send_email_verification, user_log_in, user_log_out,
            user_password_reset, user_refresh, user_sign_up, user_update, user_update_default_team,
            user_update_profile_picture, verify_email,
        },
        ws_routes::{send_message, ws_handler},
    },
    utils::redis_service::RedisService,
    ws::session::AppState,
};
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use dotenv::dotenv;
use once_cell::sync::OnceCell;
use resend_rs::Resend;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::{
    collections::HashMap,
    env,
    sync::{Arc, Mutex},
    time::Duration,
};
use tracing_subscriber::EnvFilter;
use utoipa::OpenApi;
use web::Data as WebData;

// ------------------------------------------------------------------------------------
// PUBLIC VARIABLES
// ------------------------------------------------------------------------------------
pub static JWT_SECRET: OnceCell<String> = OnceCell::new();
pub static RESEND_API_KEY: OnceCell<String> = OnceCell::new();
pub static RESEND_EMAIL: OnceCell<String> = OnceCell::new();

pub static RESEND_INSTANCE: OnceCell<Resend> = OnceCell::new();

pub static IS_DEVELOPMENT_ENV: OnceCell<bool> = OnceCell::new();

// ------------------------------------------------------------------------------------
// MODS
// ------------------------------------------------------------------------------------
pub mod api_doc;
pub mod entity;
pub mod enums;
pub mod extensions;
pub mod models;
pub mod repositories;
pub mod routes;
pub mod traits;
pub mod types;
pub mod utils;
pub mod ws;

// ------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------
/*
    This function is used to map endpoints.
    Any new endpoints that needs to be access has to be registered in this function.
*/
fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(user_sign_up);
    cfg.service(user_log_in);
    cfg.service(user_log_out);
    cfg.service(check);
    cfg.service(verify_email);
    cfg.service(send_email_verification);
    cfg.service(user_password_reset);
    cfg.service(user_update);
    cfg.service(user_refresh);
    cfg.service(user_update_profile_picture);
    cfg.service(get_user_info);
    cfg.service(user_update_default_team);

    cfg.service(team_create);
    cfg.service(team_delete);
    cfg.service(team_update);
    cfg.service(team_leave);

    cfg.service(team_role_create);
    cfg.service(team_role_update);
    cfg.service(team_role_change);
    cfg.service(team_roles_get);
    cfg.service(team_role_delete);

    cfg.service(team_invitation_send);
    cfg.service(team_invitation_accept);
    cfg.service(team_invitation_decline);

    cfg.service(team_get_members);
    cfg.service(team_member_kick);

    cfg.service(ws_handler);
    cfg.service(send_message);
}

/*
    This function is used to generate an OpenAPI spec.
    It runs at every server instance start if the env variable GENERATE_API_SPEC is set.
*/
fn generate_openapi_string() -> String {
    let openapi = ApiDoc::openapi();
    serde_json::to_string(&openapi).expect("Failed to serialize OpenAPI spec")
}

#[actix_web::main]
#[rustfmt::skip]
async fn main() -> std::io::Result<()> {

    // Makes sure that .env file exists
    dotenv().ok();
    

    // Initialize logger
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env()) // set with RUST_LOG
        .with_target(false)
        .with_level(true)
        .compact()
        .init();


    // If the env variable GENERATE_API_SPEC is set to true, write OpenAPI spec to standard output and prevent server start
    if env::var("GENERATE_API_SPEC").map(|v| v == "true").unwrap_or(false) {
        println!("{}", generate_openapi_string());
        return Ok(());
    }


    // Get and check if all required .env variables are set
    let jwt_secret:         String = env::var("JWT_SECRET").expect("JWT_SECRET not set.");
    let database_url:       String = env::var("DATABASE_URL").expect("DATABASE_URL not set.");
    let redis_url:          String = env::var("REDIS_URL").expect("REDIS_URL not set.");
    let resend_api_key:     String = env::var("RESEND_API_KEY").expect("RESEND_API_KEY not set.");
    let resend_email:       String = env::var("RESEND_EMAIL").expect("RESEND_EMAIL not set.");
    let worker_threads:     String = env::var("WORKER_THREADS").expect("WORKER_THREADS not set.");
    let is_development:     String = env::var("IS_DEVELOPMENT_ENV").expect("IS_DEVELOPMENT_ENV not set.");
    let database_logging:   String = env::var("DATABASE_LOGGING").expect("DATABASE_LOGGING not set.");


    // Update public static variables
    JWT_SECRET.set(jwt_secret).unwrap();
    RESEND_API_KEY.set(resend_api_key).unwrap();
    RESEND_EMAIL.set(resend_email).unwrap();
    IS_DEVELOPMENT_ENV.set(is_development.parse::<bool>().expect("Failed to cast IS_DEVELOPMENT_ENV to bool.")).unwrap();


    // Create resend instance
    // Its used for sending emails
    let resend: Resend = Resend::new(RESEND_API_KEY.get().unwrap());
    RESEND_INSTANCE.set(resend).unwrap();


    // Create database connection
    let mut database_options: ConnectOptions = ConnectOptions::new(database_url);
    database_options
        .max_connections(100)
        .min_connections(5)
        .connect_timeout(Duration::from_secs(30))
        .idle_timeout(Duration::from_secs(600))
        .sqlx_logging(database_logging.parse::<bool>().expect("Failed to cast DATABASE_LOGGING to bool."));

    let database_connection: DatabaseConnection = Database::connect(database_options)
        .await
        .expect("Failed to establish database connection.");
    

    // Create redis connection
    let redis_manager: RedisConnectionManager = RedisConnectionManager::new(redis_url).expect("Failed to create redis connection manager.");
    let pool: Pool<RedisConnectionManager> = Pool::builder().build(redis_manager).await.expect("Failed to create redis connection pool.");


    // Create websockets state
    let ws_app_state: AppState = AppState {
        sessions: Arc::new(Mutex::new(HashMap::new())),
    };

    let ws_app_state_data: WebData<AppState> = WebData::new(ws_app_state);
    
    
    // Start server
    HttpServer::new(move|| {
        
        // Create redis service
        let redis_service: RedisService = RedisService::set_pool(pool.clone());

        App::new()
            .wrap(
                Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
                .supports_credentials()
            )
            .app_data(WebData::new(database_connection.clone())) // Inject database into app state
            .app_data(WebData::new(redis_service))
            .app_data(ws_app_state_data.clone())
            .configure(routes) // Register endpoints
    })
    .workers(worker_threads.parse::<usize>().unwrap())
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
