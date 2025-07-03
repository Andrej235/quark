#[allow(unused)]
// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    entity::user::{ActiveModel as UserActiveModel, Column as UserColumn, Entity as UserEntity},
    models::create_user_dto::CreateUserDTO,
};
use actix_web::*;
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use sea_orm::{sea_query::ExprTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
/*
#[get("/users/signIn")]
#[rustfmt::skip]
async fn sign_in_user(
    db: web::Data<DatabaseConnection>,
    user_data_json: web::Json<CreateUserDTO>
) -> impl Responder {

// Create new model instance
//let user_instance = UserActiveModel{
    //    id: Set(Uuid::now_v7()),
    //    username: Set(user_data.username.to_owned()),
    //    name: Set(user_data.name.to_owned()),
    //    last_name: Set(user_data.last_name.to_owned()),
    //    email: Set(user_data.email.to_owned()),
    //    salt: Set(String::from("")),
    //    hashed_password: Set(String::from(""))
    //};

    // Try to add user to database
    //match user_instance.insert(db.get_ref()).await {
        //    Ok(inserted_user) => HttpResponse::Ok().json(inserted_user),
        //    Err(e) => {
            //        HttpResponse::InternalServerError().body(format!("Something died, {}", e))
            //    }
            //}

            // Get ownership of user data from json
            let mut user_data: CreateUserDTO = user_data_json.into_inner();

            // Trim all strings
            user_data.trim_strings();

            // Check for string emptiness
            let is_any_string_empty: bool = user_data.check_if_all_strings_are_not_empty();
            if is_any_string_empty == true {
                return  HttpResponse::BadRequest().body("One of fields is empty.");
            }

            // Check if user already exists
            let res = UserEntity::find()
            .filter(UserColumn::Username.eq(user_data.username))
            .filter(UserColumn::Name.eq(user_data.name))
            .filter(UserColumn::LastName.eq(user_data.last_name))
            .filter(UserColumn::Email.eq(user_data.email))
            .one(db.get_ref())
            .await;


        return HttpResponse::Ok().body("OK!");
    }
*/

// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
/// Hashes plain password using salt (argon2) <br/>
/// Returns string tuple where first string is **Salt**, and second string is **Hashed Password**
fn hash_password(password: &str) -> Result<(String, String), Box<argon2::password_hash::Error>> {

    // Create salt string and argon2 instance
    let salt:       SaltString = SaltString::generate(&mut OsRng);
    let argon2:     Argon2<'_> = Argon2::default();

    // Use argon2 function to hash password
    let password_hash: argon2::PasswordHash<'_> = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(password_hash) => password_hash,
        Err(err) => return Err(Box::new(err)),
    };

    return Ok((salt.to_string(), password_hash.to_string()));
}
