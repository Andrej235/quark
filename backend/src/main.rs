// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    api_doc::ApiDoc,
    routes::auth_routs::{check, email_verification, log_in, log_out, refresh, sign_up},
};
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use once_cell::sync::OnceCell;
use reqwest::{
    header::{HeaderMap, HeaderValue},
    Client,
};
use sea_orm::{Database, DatabaseConnection};
use std::{env, fs::File, io::Write};
use tracing_subscriber::EnvFilter;
use utoipa::OpenApi;

// ------------------------------------------------------------------------------------
// PUBLIC VARIABLES
// ------------------------------------------------------------------------------------
pub static JWT_SECRET: OnceCell<String> = OnceCell::new();
pub static BREVO_API_KEY: OnceCell<String> = OnceCell::new();
pub static BREVO_EMAIL: OnceCell<String> = OnceCell::new();
pub static BREVO_CLIENT: OnceCell<Client> = OnceCell::new();

pub const BREVO_SEND_EMAIL_ENDPOINT_URL: &'static str = "https://api.brevo.com/v3/smtp/email";

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
    cfg.service(refresh);
    cfg.service(email_verification);
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
    let brevo_api_key:  String = env::var("BREVO_API_KEY").expect("BREVO_API_KEY not set.");
    let brevo_email:    String = env::var("BREVO_EMAIL").expect("BREVO_EMAIL not set.");


    // Update public static variables
    JWT_SECRET.set(jwt_secret).unwrap();
    BREVO_API_KEY.set(brevo_api_key).unwrap();
    BREVO_EMAIL.set(brevo_email).unwrap();


    // Create request builder
    // It will be cached in static veriable for faster later use
    let mut headers: HeaderMap = HeaderMap::new();
    headers.insert("api-key", HeaderValue::from_str(BREVO_API_KEY.get().unwrap()).unwrap());
    headers.insert("Content-Type", HeaderValue::from_static("application/json"));

    let client: Client = Client::builder()
        .default_headers(headers)
        .build()
        .expect("Failed to build brevo client.");

    BREVO_CLIENT.set(client).unwrap();

    
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
