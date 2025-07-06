// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::models::authenticated_user::AuthenticatedUser;
use crate::models::claims::Claims;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::login_user_dto::LoginUserDTO;
use crate::models::sroute_error::SRouteError;
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use crate::JWT_SECRET;
use crate::{
    entity::refresh_tokens::{
        ActiveModel as RefreshTokenActiveModel, Column as RefreshTokenColumn,
        Entity as RefreshTokenEntity, Model as RefreshToken,
    },
    entity::users::{
        ActiveModel as UserActiveModel, Column as UserColumn, Entity as UserEntity, Model as User,
    },
    models::dtos::create_user_dto::CreateUserDTO,
};
use actix_web::web::{Data, Json, Path};
use actix_web::*;
use argon2::PasswordHash;
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use chrono::{Duration, NaiveDateTime, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait,
    QueryFilter,
};
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------------------
const REFRESH_TOKEN_EXPIRATION_DAY_OFFSET: i64 = 7;
const JWT_TOKEN_EXPIRATION_MINUTE_OFFSET: i64 = 15;

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
/*
    signUp
*/
#[utoipa::path(
    post,
    path = "/auth/signUp",
    request_body = CreateUserDTO,
    responses(
        (status = 200, description = "User created"),
        (status = 400, description = "Possible errors: Validation failed, User already exists", body = SRouteError),
    )
)]
#[post("/auth/signUp")]
#[rustfmt::skip]
pub async fn sign_up(
    db: Data<DatabaseConnection>,
    user_data_json: Json<CreateUserDTO>
) -> impl Responder {

    // --------->
    // Base checks
    // --------->
    // Get ownership of incoming data
    let mut user_data: CreateUserDTO = user_data_json.into_inner();

    // Run incoming data validation
    if user_data.validate() == false { return HttpResponse::BadRequest().json(SRouteError { message: "Validation failed" }); }


    // --------->
    // Main execution
    // --------->
    // Check if user already exists
    let existing_user_fetch_result: Option<User> = match UserEntity::find()
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

    match existing_user_fetch_result {
            
        // If user exists return message that user already exists
        Some(_) => { return HttpResponse::BadRequest().json(SRouteError { message: "User already exists" }); },
            
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
            let user_insertion_result: Result<User, DbErr> = UserActiveModel {
                id:                 Set(Uuid::now_v7()),
                username:           Set(user_data.username.clone()),
                name:               Set(user_data.name),
                last_name:          Set(user_data.last_name),
                email:              Set(user_data.email),
                hashed_password:    Set(password_hash),
                salt:               Set(salt),
            }.insert(db.get_ref()).await;

            match user_insertion_result {
                Ok(_) => (),
                Err(err) => {
                    println!("-> sign_up errored (tried to create user): {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            return HttpResponse::Ok().finish();
        }
    }
}

/*
    logIn
*/
#[utoipa::path(
    post,
    path = "/auth/logIn",
    request_body = LoginUserDTO,
    responses(
        (status = 200, description = "User logged in", body = LogInResultDTO),
        (status = 400, description = "Possible errors: Validation failed, Wrong password, User not found", body = SRouteError),
    )
)]
#[post("/auth/logIn")]
#[rustfmt::skip]
async fn log_in(    
    db: Data<DatabaseConnection>,
    user_data_json: Json<LoginUserDTO>
) -> impl Responder {

    // --------->
    // Base checks
    // --------->
    // Get ownership of incoming data
    let mut user_data: LoginUserDTO = user_data_json.into_inner();
    
    // Run incoming data validation
    if user_data.validate() == false { return HttpResponse::BadRequest().json(SRouteError { message: "Validation failed" }); }


    // --------->
    // Main execution
    // --------->
    // Check if user already exists in database
    let existing_user: Option<User>  = match UserEntity::find()
        .filter(UserColumn::Email.eq(&user_data.email))
        .one(db.get_ref())
        .await {
            Ok(user) => user,
            Err(err) => {
                println!("-> log_in errored (tried to find user): {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        };

    match existing_user {

        None => { return HttpResponse::BadRequest().json(SRouteError { message: "User not found" }); },
        
        Some(user) => {
            // Hash provided password 
            let provided_password_hash: String = match hash_password_with_salt(&user.salt, &user_data.password) {
                Ok(password_hash) => password_hash,
                Err(err) => {
                    println!("-> log_in errored (tried to hash password): {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            // Check if password is same as in database
            if provided_password_hash != user.hashed_password {
                return  HttpResponse::BadRequest().json(SRouteError { message: "Wrong password" });
            }

            // Try to get refresh token from database
            let existing_refresh_token_result: Option<RefreshToken> = match RefreshTokenEntity::find()
                .filter(RefreshTokenColumn::UserId.eq(user.id))
                .one(db.get_ref())
                .await {
                    Ok(refresh_token) => refresh_token,
                    Err(err) => {
                        println!("-> log_in errored (tried to find refresh token): {:?}", err);
                        return HttpResponse::InternalServerError().finish();
                    }
                };

            match existing_refresh_token_result {
                
                // Create JWT token if refresh token exists
                Some(mut refresh_token) => {

                    // If refresh token is expired recycle it
                    if refresh_token.expire_time < Utc::now().naive_utc() {

                        let refresh_token_recycle_resutl: Result<RefreshToken, DbErr> = recycle_refresh_token(refresh_token.id, user.id, db).await;
                        match refresh_token_recycle_resutl {
                            Ok(token) => refresh_token = token,
                            Err(err) => {
                                println!("-> log_in errored (tried to delete refresh token and create new one): {:?}", err);
                                return HttpResponse::InternalServerError().finish();
                            }
                        };
                    }

                    // Create new jwt token
                    let jwt_token: String = create_jwt_token(&refresh_token, user.id);

                    return HttpResponse::Ok().json(LogInResultDTO {
                        jwt_token: jwt_token,
                        refresh_token_id: refresh_token.id
                    });
                },

                // If refresh token doesn't exist create new refresh token and JWT token
                None => {
                    // Try to create and add new refresh token to database
                    let new_refresh_token_active_model: RefreshTokenActiveModel = create_refresh_token(user.id);
                    let add_refresh_token_result: Result<RefreshToken, DbErr> = new_refresh_token_active_model.insert(db.get_ref()).await;

                    let refresh_token = match add_refresh_token_result {
                        Ok(token) => token,
                        Err(err) => {
                            println!("-> log_in errored (tried to create and add new refresh token to database): {:?}", err);
                            return HttpResponse::InternalServerError().finish();
                        }
                    };

                    // Create new jwt token
                    let jwt_token: String = create_jwt_token(&refresh_token, user.id);

                    return HttpResponse::Ok().json(LogInResultDTO {
                        jwt_token: jwt_token,
                        refresh_token_id: refresh_token.id
                    });
                }
            }
        }
    }
}

/*
    logOut
*/
#[utoipa::path(
    post,
    path = "/auth/logOut/{refresh_token_id}",
    params(
        ("refresh_token_id" = uuid::Uuid, Path, description = "Refresh token id")
    ),
    responses(
        (status = 200, description = "User logged out"),
    )
)]
#[post("/auth/logOut/{refresh_token_id}")]
#[rustfmt::skip]
async fn log_out(    
    db: Data<DatabaseConnection>,
    path: Path<Uuid>
) -> impl Responder {

    // Get refresh token id from path
    let refresh_token_id = path.into_inner();

    // Try to delete refresh token
    let delete_refresh_token_result: Result<DeleteResult, DbErr> = RefreshTokenEntity::delete_by_id(refresh_token_id)
        .exec(db.get_ref())
        .await;
    
    match delete_refresh_token_result {
        Ok(_) => (),
        Err(err) => {
            println!("-> log_out errored (tried to delete refresh token): {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    return HttpResponse::Ok().finish();
}

/*
    check
*/
#[utoipa::path(
    post,
    path = "/auth/check",
    responses(
        (status = 200, description = "User logged in"),
        (status = 401, description = "User not logged in"),
    )
)]
#[get("/auth/check")]
#[rustfmt::skip]
async fn check(
    _user: AuthenticatedUser    
) -> impl Responder {
    HttpResponse::Ok().finish()
}
// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
/// Tries to delete old refresh token and create new one <br/>
/// Returns new **refresh token** or **error**
async fn recycle_refresh_token(refresh_token_id: Uuid, user_id: Uuid, db: Data<DatabaseConnection>) -> Result<RefreshToken, DbErr> {

    // Try to delete refresh token
    let delete_refresh_token_result: Result<DeleteResult, DbErr> = RefreshTokenEntity::delete_by_id(refresh_token_id).exec(db.get_ref()).await;
    match delete_refresh_token_result {
        Ok(_) => (),
        Err(err) => {
            println!("-> log_in errored (tried to delete refresh token): {:?}", err);
            return Err(err);
        }
    };

    // Try to create and add new refresh token to database
    let new_refresh_token_active_model: RefreshTokenActiveModel = create_refresh_token(user_id);
    let add_refresh_token_result: Result<RefreshToken, DbErr> = new_refresh_token_active_model.insert(db.get_ref()).await;
    
    let token = match add_refresh_token_result {
        Ok(token) => Ok(token),
        Err(err) => {
            println!("-> log_in errored (tried to create and add new refresh token to database): {:?}", err);
            return Err(err);
        }
    };

    return token;
}

#[rustfmt::skip]
/// Hashes plain password using salt (argon2) <br/>
/// Returns string tuple where first string is **Salt**, and second string is **Hashed Password**
fn hash_password(password: &str) -> Result<(String, String), Box<argon2::password_hash::Error>> {

    // Create salt string and argon2 instance
    let salt:       SaltString = SaltString::generate(&mut OsRng);
    let argon2:     Argon2<'_> = Argon2::default();

    // Use argon2 function to hash password
    let password_hash: PasswordHash<'_> = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(password_hash) => password_hash,
        Err(err) => return Err(Box::new(err)),
    };

    return Ok((salt.to_string(), password_hash.to_string()));
}

#[rustfmt::skip]
/// Hashes plain password using provided salt string
/// Returns **hashed password** or **error**
fn hash_password_with_salt(salt_str: &str, password: &str) -> Result<String, Box<argon2::password_hash::Error>> {

    // Create argon2 instance and salt string instance
    let argon2:         Argon2<'_> = Argon2::default();
    let salt:    SaltString = SaltString::from_b64(salt_str).unwrap();

    // Use argon2 function to hash password
    let password_hash: PasswordHash<'_> = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(password_hash) => password_hash,
        Err(err) => return Err(Box::new(err)),
    };

    return Ok(password_hash.to_string());
}

#[rustfmt::skip]
fn create_jwt_token(refresh_token: &RefreshToken, user_id: Uuid) -> String {
    
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    let claims: Claims = Claims { 
        user_id: user_id, 
        expire_time: Utc::now().naive_utc() + Duration::minutes(JWT_TOKEN_EXPIRATION_MINUTE_OFFSET), 
        jit: refresh_token.jit
    };

    let access_token = encode(&Header::default(), &claims, &EncodingKey::from_secret(jwt_secret.as_ref()))
        .expect("JWT encoding failed");

    return access_token;
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
