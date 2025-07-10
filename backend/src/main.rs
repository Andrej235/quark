// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    api_doc::ApiDoc,
    routes::{
        team_roles_routes::team_role_create,
        team_routs::{team_create, team_delete},
        user_routs::{
            check, log_in, log_out, refresh, reset_password, send_email_verification, sign_up,
            verify_email,
        },
    },
};
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use once_cell::sync::OnceCell;
use resend_rs::Resend;
use sea_orm::{Database, DatabaseConnection};
use std::{env, fs::File, io::Write};
use tracing_subscriber::EnvFilter;
use utoipa::OpenApi;

// ------------------------------------------------------------------------------------
// PUBLIC VARIABLES
// ------------------------------------------------------------------------------------
pub static JWT_SECRET: OnceCell<String> = OnceCell::new();
pub static RESEND_API_KEY: OnceCell<String> = OnceCell::new();
pub static RESEND_EMAIL: OnceCell<String> = OnceCell::new();

pub static RESEND_INSTANCE: OnceCell<Resend> = OnceCell::new();

// ------------------------------------------------------------------------------------
// MODS
// ------------------------------------------------------------------------------------
pub mod api_doc;
pub mod entity;
pub mod extensions;
pub mod models;
pub mod routes;
pub mod traits;
pub mod utils;

// ------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------
/*
    This function is used to map endpoints.
    Any new endpoints that needs to be access has to be registered in this function.
*/
fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(sign_up);
    cfg.service(log_in);
    cfg.service(log_out);
    cfg.service(check);
    cfg.service(verify_email);
    cfg.service(send_email_verification);
    cfg.service(reset_password);
    cfg.service(refresh);

    cfg.service(team_create);
    cfg.service(team_delete);

    cfg.service(team_role_create);
}

/*
    This function is used to write OpenAPI endpoint map to a file.
    Its run at every server instance start.
*/
fn write_openapi_file() -> std::io::Result<()> {
    let openapi: utoipa::openapi::OpenApi = ApiDoc::openapi();

    let json: String =
        serde_json::to_string_pretty(&openapi).expect("Failed to serialize OpenAPI spec");

    let mut file: File = File::create("openapi.json")?;
    file.write_all(json.as_bytes())?;

    Ok(())
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


    // Write OpenAPI endpoint map to a file
    write_openapi_file().expect("Failed to write OpenAPI endpoint map.");


    // Get and check if all required .env variables are set
    let jwt_secret:     String = env::var("JWT_SECRET").expect("JWT_SECRET not set.");
    let database_url:   String = env::var("DATABASE_URL").expect("DATABASE_URL not set.");
    let resend_api_key:  String = env::var("RESEND_API_KEY").expect("RESEND_API_KEY not set.");
    let resend_email:    String = env::var("RESEND_EMAIL").expect("RESEND_EMAIL not set.");


    // Update public static variables
    JWT_SECRET.set(jwt_secret).unwrap();
    RESEND_API_KEY.set(resend_api_key).unwrap();
    RESEND_EMAIL.set(resend_email).unwrap();


    // Create resend instance
    // Its used for sending emails
    let resend: Resend = Resend::new(RESEND_API_KEY.get().unwrap());
    RESEND_INSTANCE.set(resend).unwrap();


    // Create database connection
    let database_connection: DatabaseConnection = Database::connect(database_url)
        .await
        .expect("Failed to connect to database");


    // Start actix server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(database_connection.clone())) // Inject database into app state
            .configure(routes) // Register endpoints
    })
    // .workers(16) // In production set this to number of threads that are available for server
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
