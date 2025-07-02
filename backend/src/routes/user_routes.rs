// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    entity::user::{ActiveModel as UserActiveModel, Entity as UserEntity},
    models::create_user::CreateUser,
};
use actix_web::*;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection};
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
#[get("/users/add")]
#[rustfmt::skip]
async fn add_user(
    db: web::Data<DatabaseConnection>,
    user_data: web::Json<CreateUser>
) -> impl Responder {

    // Create new model instance
    let user_instance = UserActiveModel{
        id: Set(Uuid::now_v7()),
        username: Set(user_data.username.to_owned()),
        name: Set(user_data.name.to_owned()),
        last_name: Set(user_data.last_name.to_owned()),
        email: Set(user_data.email.to_owned()),

        salt: Set(String::from("")),
        hashed_password: Set(String::from(""))
    };

    // Try to add user to database
    match user_instance.insert(db.get_ref()).await {
        Ok(inserted_user) => HttpResponse::Ok().json(inserted_user),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Something died, {}", e))
        }
    }
}

/*
#[get("/users/{id}")]
#[rustfmt::skip]
async fn get_user(
    db: web::Data<DatabaseConnection>,
    path: web::Path<i32>
) -> impl Responder {

let user_id = path.into_inner();

match UserEntity::find_by_id(user_id).one(db.get_ref()).await {
    Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().body(format!("User {} not found", user_id)),
        Err(e) => HttpResponse::InternalServerError().body(format!("DB error: {}", e)),
    }
}
*/
