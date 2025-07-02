use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use sea_orm::{Database, DatabaseConnection};
use std::env;

#[get("/hello")]
async fn hello(db: web::Data<DatabaseConnection>) -> impl Responder {
    HttpResponse::Ok().body("Hello World!")
}

/*
    This function is used to map endpoints.
    Any new endpoints that needs to be access has to be registered in this function.
*/
fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(hello);
}

#[actix_web::main]
#[rustfmt::skip]
async fn main() -> std::io::Result<()> {

    dotenv().ok(); // Makes sure that .env file exists


    // Create database connection
    let database_url: String = env::var("DATABASE_URL").expect("DATABASE_URL not set.");
    let database_connection: DatabaseConnection = Database::connect(database_url)
        .await
        .expect("Failed to connect to database");


    // Start actix server
    println!("Starting server...");

    HttpServer::new(move || {
        App::new().app_data(web::Data::new(database_connection.clone())) // Inject database into app state
        .configure(routes) // Register endpoints
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
