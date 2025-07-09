// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::models::authenticated_user::AuthenticatedUser;
use crate::models::claims::Claims;
use crate::models::dtos::jwt_refresh_token_pair::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::login_user_dto::LoginUserDTO;
use crate::models::email_verify_claims::EmailVerifyClaims;
use crate::models::sroute_error::SRouteError;
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
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
use crate::{JWT_SECRET, RESEND_EMAIL, RESEND_INSTANCE};
use actix_web::web::{Data, Json, Path};
use actix_web::*;
use argon2::PasswordHash;
use argon2::{
    password_hash::{rand_core::OsRng, Error as Argon2Error, SaltString},
    Argon2, PasswordHasher,
};
use chrono::{Duration, NaiveDateTime, Utc};
use jsonwebtoken::{
    decode, encode, errors::Error as JWTTokenError, DecodingKey, EncodingKey, Header, TokenData,
    Validation,
};
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::{Error as ResendError, Resend};
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait,
    IntoActiveModel, QueryFilter,
};
use tracing::error;
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------------------------
const REFRESH_TOKEN_EXPIRATION_OFFSET: i64 = 7; // days
const JWT_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes
const EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
/*
**  signup
*/
#[utoipa::path(
    post,
    path = "/auth/signup",
    request_body = CreateUserDTO,
    responses(
        (status = 200, description = "User created"),
        (status = 400, description = "Possible errors: Validation failed, User already exists", body = SRouteError),
    )
)]
#[post("/auth/signup")]
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
                error!("Finding user with filterting failed: {:?}", err);
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
                    error!("Password hashing failed: {:?}", err);
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
                is_email_verified:  Set(false),
            }.insert(db.get_ref()).await;

            let user: User = match user_insertion_result {
                Ok(user) => user,
                Err(err) => {
                    error!("Creating user failed: {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            // Generate email verification token
            // Its used to verify user email
            let email_verification_token: String = match create_email_verification_token(user.id) {
                Ok(token) => token,
                Err(err) => {
                    error!("Creating email verification token failed: {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            // Send verification email to user
            match send_verification_email(&user.username, &user.email, &email_verification_token).await {
                Ok(_) => {},
                Err(err) => {
                    error!("Sending verification email failed: {:?}", err);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            return HttpResponse::Ok().finish();
        }
    }
}

/*
**  login
*/
#[utoipa::path(
    post,
    path = "/auth/login",
    request_body = LoginUserDTO,
    responses(
        (status = 200, description = "User logged in", body = LogInResultDTO),
        (status = 400, description = "Possible errors: Validation failed, Wrong password, User not found", body = SRouteError),
    )
)]
#[post("/auth/login")]
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
                error!("Finding user with filtering failed: {:?}", err);
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
                    error!("Hashing password failed: {:?}", err);
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
                        error!("Finding refresh token with filtering failed: {:?}", err);
                        return HttpResponse::InternalServerError().finish();
                    }
                };

            match existing_refresh_token_result {
                
                // Create JWT token if refresh token exists
                Some(mut refresh_token) => {

                    // If refresh token is expired recycle it
                    if refresh_token.expire_time < Utc::now().naive_utc() {

                        match recycle_refresh_token(refresh_token.id, user.id, db).await {
                            Ok(token) => refresh_token = token,
                            Err(err) => {
                                error!("Recycling refresh token failed: {:?}", err);
                                return HttpResponse::InternalServerError().finish();
                            }
                        };
                    }

                    // Create and return new jwt token
                    match create_jwt_token(&refresh_token, user.id) {
                        Ok(token) => {
                            return HttpResponse::Ok().json(LogInResultDTO {
                                jwt_token: token,
                                refresh_token_id: refresh_token.id
                            });
                        },
                        Err(err) => {
                            error!("Creating JWT token failed: {:?}", err);
                            return HttpResponse::InternalServerError().finish();
                        }
                    };
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

                    // Create and return new jwt token
                    match create_jwt_token(&refresh_token, user.id) {
                        Ok(token) => {
                            return HttpResponse::Ok().json(LogInResultDTO {
                                jwt_token: token,
                                refresh_token_id: refresh_token.id
                            });
                        },
                        Err(err) => {
                            error!("Creating JWT token failed: {:?}", err);
                            return HttpResponse::InternalServerError().finish();
                        }
                    };
                }
            }
        }
    }
}

/*
**  logout
*/
#[utoipa::path(
    post,
    path = "/auth/logout/{refresh_token_id}",
    params(
        ("refresh_token_id" = uuid::Uuid, Path, description = "Refresh token id")
    ),
    responses(
        (status = 200, description = "User logged out"),
    )
)]
#[post("/auth/logout/{refresh_token_id}")]
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
            error!("Deleting refresh token failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    return HttpResponse::Ok().finish();
}

/*
**  refresh
*/
#[utoipa::path(
    post,
    path = "/auth/refresh",
    responses(
        (status = 200, description = "Token pair refreshed", body = JWTRefreshTokenPairDTO),
        (status = 401, description = "Possible messages: Invalid JWT token, 
                                                         Invalid Refresh token, 
                                                         Expired Refresh token,
                                                         Mismatched user and refresh token,
                                                         Mismatched claim and refresh token", body = SRouteError),
    )
)]
#[post("/auth/refresh")]
#[rustfmt::skip]
async fn refresh(
    db: Data<DatabaseConnection>,
    token_pair: Json<JWTRefreshTokenPairDTO>  
) -> impl Responder {

    // --------->
    // Data prep
    // --------->
    // Get ownership of incoming data
    let token_pair: JWTRefreshTokenPairDTO = token_pair.into_inner();

    // Get claims object from jwt string
    let claims: Claims = match decode_jwt_string(&token_pair.jwt_token, false) {
        Ok(token_data) => token_data.claims,
        Err(err) => {
            error!("JWT string decode failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };


    // ------------------>
    // Token validation
    // ------------------>
    // Return unauthorized response if user is not found
    match UserEntity::find_by_id(claims.user_id)
        .one(db.get_ref())
        .await {
            Ok(user) => {
                if user.is_none() { return HttpResponse::Unauthorized().json(SRouteError { message: "Invalid JWT token" }); }
            },
            Err(err) => {
                error!("Finding user by id failed: {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        };

    // Return unauthorized response if refresh token is not found
    let refresh_token: RefreshToken = match RefreshTokenEntity::find_by_id(token_pair.refresh_token_id)
        .one(db.get_ref())
        .await {
            Ok(token) => {
                if token.is_none() { return HttpResponse::Unauthorized().json(SRouteError { message: "Invalid Refresh token" }); }
                token.unwrap()
            },
            Err(err) => {
                error!("Finding refresh token by id failed: {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        };

    // Return unauthorized response if user id from claim does not match user id from refresh token
    if claims.user_id != refresh_token.user_id {
        return HttpResponse::Unauthorized().json(SRouteError { message: "Mismatched user and refresh token" });
    }

    // Return unauthorized response if jit from claim does not match jit from refresh token
    if claims.jit != refresh_token.jit {
        return HttpResponse::Unauthorized().json(SRouteError { message: "Mismatched claim and refresh token" });
    }

    // Return unauthorized response if refresh token is expired
    if refresh_token.expire_time < Utc::now().naive_utc() {
        return HttpResponse::Unauthorized().json(SRouteError { message: "Expired Refresh token" });
    }


    // -------------------->
    // New token creation
    // -------------------->
    // Delete old refresh token and create new one
    let new_refresh_token: RefreshToken = match recycle_refresh_token(refresh_token.id, claims.user_id, db).await {
        Ok(token) => token,
        Err(err) => {
            error!("Recycle refresh token failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    // Return new JWT Token
    return match create_jwt_token(&new_refresh_token, claims.user_id) {
        Ok(token) => HttpResponse::Ok().json(JWTRefreshTokenPairDTO {
            jwt_token: token,
            refresh_token_id: new_refresh_token.id
        }),
        Err(err) => {
            error!("Creating JWT token failed: {:?}", err);
            HttpResponse::InternalServerError().finish()
        }
    };
}

/*
**  email-verification
*/
#[utoipa::path(
    post,
    path = "/auth/verify-email/{token}",
    responses(
        (status = 200, description = "Email verified"),
        (status = 401, description = "Possible messages: User not found", body = SRouteError),
    )
)]
#[get("/auth/verify-email/{token}")]
#[rustfmt::skip]
async fn verify_email(
    db: Data<DatabaseConnection>,
    path_token: Path<String> 
) -> impl Responder {

    // Get ownership of incoming data
    let token: String = path_token.into_inner();

    // Try to decode token
    let email_verification_claims: EmailVerifyClaims = match decode_email_verification_token(&token, false) {
        Ok(token_data) => token_data.claims,
        Err(err) => {
            error!("Email verification token decode failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    // Check if token is expired
    if email_verification_claims.expire_time < Utc::now().naive_utc() {
        return HttpResponse::Unauthorized().body("Token expired.");
    }

    // Try to find user by id
    let user_model: User = match UserEntity::find_by_id(email_verification_claims.user_id)
        .one(db.get_ref())
        .await {
            Ok(user) => {
                if user.is_none() { return HttpResponse::Unauthorized().json(SRouteError { message: "User not found" }); }
                user.unwrap()
            },
            Err(err) => {
                error!("Finding user by id failed: {:?}", err);
                return HttpResponse::InternalServerError().finish();
            }
        };
        
    // Update email verified property of user
    let mut user_active_model: UserActiveModel = user_model.into();
    user_active_model.is_email_verified = Set(true);
    
    match user_active_model.update(db.get_ref()).await {
        Ok(_) => {},
        Err(err) => {
            error!("Updating user failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    return HttpResponse::Ok().body("Verified.");
}

/*
**  check
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
/// Error logging is handled but this function <br/>
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
/// Hashes plain password using provided salt string <br/>
/// Returns **hashed password** or **error**
fn hash_password_with_salt(salt_str: &str, password: &str) -> Result<String, Argon2Error> {

    // Create argon2 instance and salt string instance
    let argon2:     Argon2<'_> = Argon2::default();
    let salt:       SaltString = SaltString::from_b64(salt_str).map_err(|err| err)?;

    // Use argon2 function to hash password
    let password_hash: PasswordHash<'_> = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(password_hash) => password_hash,
        Err(err) => return Err(err),
    };

    return Ok(password_hash.to_string());
}

#[rustfmt::skip]
/// Creates email verification token <br/>
/// Token contains basic data like **user_id** and **expiration time** that are used for email verification <br/>
/// Returns **token** or **error**
fn create_email_verification_token(user_id: Uuid) -> Result<String, JWTTokenError> {
    
    // Get JWT secret
    let jwt_secret: &String = JWT_SECRET.get().unwrap();
    
    // Create claims
    let claims: EmailVerifyClaims = EmailVerifyClaims { 
        user_id: user_id, 
        expire_time: Utc::now().naive_utc() + Duration::minutes(EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET), 
    };

    return encode(
        &Header::default(), 
        &claims, 
        &EncodingKey::from_secret(jwt_secret.as_ref())
    );
}

#[rustfmt::skip]
/// Decodes email verification token <br/>
/// Returns **token data** or **error**
fn decode_email_verification_token(jwt_string: &str, validate_expire_time: bool) -> Result<TokenData<EmailVerifyClaims>, JWTTokenError> {
    
    // Get jwt secret
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    // Apply custom decode validation
    let mut validation = Validation::default();
    validation.validate_exp = validate_expire_time;

    // Decode jwt string
    return decode::<EmailVerifyClaims>(
        jwt_string,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &validation,
    );
}

#[rustfmt::skip]
/// Sends email verification email <br/>
/// Uses Resend API with custom domain to send verification email
/// Returns **Ok** or **error**
async fn send_verification_email(user_username: &str, user_email: &str, token: &str) -> Result<(), ResendError> {

    // Get resend instance
    let resend_instance: &Resend = RESEND_INSTANCE.get().unwrap();

    // Prep email data
    let from:       String = format!("Quark <{}>", RESEND_EMAIL.get().unwrap());
    let to:         [&str; 1] = [user_email];
    let subject:    &'static str = "Quark Email Verification";

    // Create email option instance
    let email = CreateEmailBaseOptions::new(&from, to, subject)
        .with_html(format!("<p>Hello {}, please click <a href='http://127.0.0.1:8080/auth/verify-email/{}'>HERE</a> to verify your email.</p>", user_username, token).as_str());

    // Send email
    match resend_instance.emails.send(email).await {
        Ok(_) => Ok(()),
        Err(err) => return Err(err),
    }
}

#[rustfmt::skip]
fn create_jwt_token(refresh_token: &RefreshToken, user_id: Uuid) -> Result<String, JWTTokenError> {

    // Get JWT secret
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    // Create claims
    let claims: Claims = Claims { 
        user_id: user_id, 
        expire_time: Utc::now().naive_utc() + Duration::minutes(JWT_TOKEN_EXPIRATION_OFFSET), 
        jit: refresh_token.jit
    };

    return encode(
        &Header::default(), 
        &claims, 
        &EncodingKey::from_secret(jwt_secret.as_ref())
    );
}

#[rustfmt::skip]
fn create_refresh_token(user_id: Uuid) -> RefreshTokenActiveModel {

    let refresh_token_id: Uuid = Uuid::now_v7();
    let refresh_token_expiration_time: NaiveDateTime = Utc::now().naive_utc() + Duration::days(REFRESH_TOKEN_EXPIRATION_OFFSET);
    let refresh_token_jit: Uuid = Uuid::now_v7();

    return RefreshTokenActiveModel {
        id: Set(refresh_token_id),
        user_id: Set(user_id),
        expire_time: Set(refresh_token_expiration_time),
        jit: Set(refresh_token_jit),
    };
}

#[rustfmt::skip]
fn decode_jwt_string(jwt_string: &str, validate_expire_time: bool) -> Result<TokenData<Claims>, JWTTokenError> {

    // Get jwt secret
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    // Apply custom decode validation
    let mut validation = Validation::default();
    validation.validate_exp = validate_expire_time;

    // Decode jwt string
    return decode::<Claims>(
        jwt_string,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &validation,
    );
}
