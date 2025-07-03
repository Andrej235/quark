// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::models::sroute_error::SRouteError;
use crate::{
    entity::refresh_tokens::{ActiveModel as RefreshTokenActiveModel, Model as RefreshToken},
    entity::users::{
        ActiveModel as UserActiveModel, Column as UserColumn, Entity as UserEntity, Model as User,
    },
    models::create_user_dto::CreateUserDTO,
};
use actix_web::*;
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use chrono::{Duration, NaiveDateTime, Utc};
use sea_orm::ActiveValue::Set;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter};
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------------------
const REFRESH_TOKEN_EXPIRATION_DAY_OFFSET: i64 = 7;

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
#[get("/auth/signUp")]
#[rustfmt::skip]
async fn sign_up(
    db: web::Data<DatabaseConnection>,
    user_data_json: web::Json<CreateUserDTO>
) -> impl Responder {

    // Get ownership of user data from json
    let mut user_data: CreateUserDTO = user_data_json.into_inner();

    // Trim all strings
    user_data.trim_strings();

    // Check for string emptiness
    let is_any_string_empty: bool = user_data.check_if_all_strings_are_not_empty();
    if is_any_string_empty == false {
        return  HttpResponse::BadRequest().body("One of fields is empty.");
    }

    // Check if user already exists
    let existing_user: Option<User>  = match UserEntity::find()
        .filter(UserColumn::Username.eq(&user_data.username))
        .filter(UserColumn::Name.eq(&user_data.name))
        .filter(UserColumn::LastName.eq(&user_data.last_name))
        .filter(UserColumn::Email.eq(&user_data.email))
        .one(db.get_ref())
        .await {
            Ok(user) => user,
            Err(err) => {
                println!("-> sign_up errored (tried to find user): {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        };

    match existing_user {
            
        // If user exists return message that user already exists
        Some(_) => {
            return HttpResponse::BadRequest().json(SRouteError {
                message: "User already exists."
            });            
        },
            
        // Otherwise if it doesnt exist add it to database and return JWT token
        None => {

            // Hash password
            let (salt, password_hash): (String, String) = match hash_password(&user_data.password) {
                Ok((salt, password_hash)) => (salt, password_hash),
                Err(err) => {
                    println!("-> sign_up errored (tried to hash password): {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            // Create user
            let user_creation_result: Result<User, DbErr> = UserActiveModel {
                id: Set(Uuid::now_v7()),
                username: Set(user_data.username.clone()),
                name: Set(user_data.name),
                last_name: Set(user_data.last_name),
                email: Set(user_data.email),
                hashed_password: Set(password_hash),
                salt: Set(salt),
            }.insert(db.get_ref()).await;

            match user_creation_result {
                Ok(_) => (),
                Err(err) => {
                    println!("-> sign_up errored (tried to create user): {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            return HttpResponse::Ok().body("User created.");
        }
    }
}

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

#[rustfmt::skip]
fn create_jwt_token(refresh_token: RefreshToken) {
    
    let jwt_secret: String = std::env::var("JWT_SECRET").unwrap();
}

#[rustfmt::skip]
fn create_refresh_token(user_id: Uuid) -> RefreshTokenActiveModel {

    let refresh_token_id: Uuid = Uuid::now_v7();
    let refresh_token_expiration_time: NaiveDateTime = Utc::now().naive_utc() + Duration::days(REFRESH_TOKEN_EXPIRATION_DAY_OFFSET);
    let refresh_token_jit: Uuid = Uuid::now_v7();

    return RefreshTokenActiveModel {
        id: Set(refresh_token_id),
        user_id: Set(user_id),
        expire_time: Set(refresh_token_expiration_time),
        jit: Set(refresh_token_jit),
    };
}
