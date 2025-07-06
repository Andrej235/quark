// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    api_doc::ApiDoc,
    routes::auth_routs::{log_in, log_out, sign_up},
};
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use sea_orm::{Database, DatabaseConnection};
use std::{env, fs::File, io::Write};
use utoipa::OpenApi;

// ------------------------------------------------------------------------------------
// MODS
// ------------------------------------------------------------------------------------
pub mod api_doc;
pub mod entity;
pub mod extensions;
pub mod models;
pub mod routes;
pub mod traits;

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

    println!("OpenAPI endpoint map saved to openapi.json");

    Ok(())
}

#[actix_web::main]
#[rustfmt::skip]
async fn main() -> std::io::Result<()> {

    // Makes sure that .env file exists
    dotenv().ok();

    // Write OpenAPI endpoint map to a file
    write_openapi_file().expect("Failed to write OpenAPI spec file");

    // Check if all required .env variables are set
    if env::var("JWT_SECRET").is_err() { panic!("JWT_SECRET not set."); }
    if env::var("DATABASE_URL").is_err() { panic!("DATABASE_URL not set."); }

    // Create database connection
    let database_url: String = env::var("DATABASE_URL").expect("DATABASE_URL not set.");
    let database_connection: DatabaseConnection = Database::connect(database_url)
        .await
        .expect("Failed to connect to database");

    // Start actix server
    println!("Starting server...");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(database_connection.clone())) // Inject database into app state
            .configure(routes) // Register endpoints
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
