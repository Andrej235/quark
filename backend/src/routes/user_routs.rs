// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::models::authenticated_user::AuthenticatedUser;
use crate::models::dtos::jwt_refresh_token_pair_dto::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::login_user_dto::LoginUserDTO;
use crate::models::dtos::password_reset_dto::PasswordResetDTO;
use crate::models::dtos::validatio_error_dto::ValidationErrorDTO;
use crate::models::email_verify_claims::EmailVerifyClaims;
use crate::models::sroute_error::SRouteError;
use crate::models::user_claims::UserClaims;
use crate::traits::endpoint_json_body_data::EndpointJsonBodyData;
use crate::utils::constants::{
    CHECK_ROUTE_PATH, EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET, JWT_TOKEN_EXPIRATION_OFFSET,
    LOG_IN_ROUTE_PATH, LOG_OUT_ROUTE_PATH, REFRESH_ROUTE_PATH, REFRESH_TOKEN_EXPIRATION_OFFSET,
    RESET_PASSWORD_ROUTE_PATH, SEND_VERIFICATION_EMAIL_ROUTE_PATH, SIGN_UP_ROUTE_PATH,
    VERIFY_EMAIL_ROUTE_PATH,
};
use crate::utils::http_helper::endpoint_internal_server_error;
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
    QueryFilter,
};
use std::error::Error;
use tracing::error;
use uuid::Uuid;

// ------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------
/*
**  signup
*/
#[utoipa::path(
    post,
    path = SIGN_UP_ROUTE_PATH,
    request_body = CreateUserDTO,
    responses(
        (status = 200, description = "User created"),
        (status = 400, description = "Possible errors: User already exists", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/signup")]
#[rustfmt::skip]
pub async fn sign_up(
    db: Data<DatabaseConnection>,
    user_data_json: Json<CreateUserDTO>
) -> impl Responder {

    // Get ownership of incoming data
    let mut user_data: CreateUserDTO = user_data_json.into_inner();

    // Run incoming data validation
    if let Err(err) = user_data.validate_data() {
        return HttpResponse::UnprocessableEntity().json(ValidationErrorDTO::from(err));
    }

    
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
                return endpoint_internal_server_error(SIGN_UP_ROUTE_PATH, "Finding user with filterting", Box::new(err));
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
                    return endpoint_internal_server_error(SIGN_UP_ROUTE_PATH, "Hashing password", Box::<dyn Error>::from(format!("{:?}", err)));
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

            match user_insertion_result {
                Ok(_) => (),
                Err(err) => {
                    return endpoint_internal_server_error(SIGN_UP_ROUTE_PATH, "Creating user", Box::new(err));
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
    path = LOG_IN_ROUTE_PATH,
    request_body = LoginUserDTO,
    responses(
        (status = 200, description = "User logged in", body = LogInResultDTO),
        (status = 400, description = "Possible errors: Wrong password, User not found", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/login")]
#[rustfmt::skip]
async fn log_in(    
    db: Data<DatabaseConnection>,
    user_data_json: Json<LoginUserDTO>
) -> impl Responder {
    
    // Get ownership of incoming data
    let mut user_data: LoginUserDTO = user_data_json.into_inner();
    
    // Run incoming data validation
    if let Err(err) = user_data.validate_data() {
        return HttpResponse::UnprocessableEntity().json(ValidationErrorDTO::from(err));
    }


    // Check if user already exists in database
    let existing_user: Option<User>  = match UserEntity::find()
        .filter(UserColumn::Email.eq(&user_data.email))
        .one(db.get_ref())
        .await {
            Ok(user) => user,
            Err(err) => {
                return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Finding user with filtering", Box::new(err));
            }
        };

    match existing_user {

        None => { return HttpResponse::BadRequest().json(SRouteError { message: "User not found" }); },
        
        Some(user) => {
            // Hash provided password 
            let provided_password_hash: String = match hash_password_with_salt(&user.salt, &user_data.password) {
                Ok(password_hash) => password_hash,
                Err(err) => {
                    return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Hashing password", Box::<dyn Error>::from(format!("{:?}", err)));
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
                        return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Finding refresh token with filtering", Box::new(err));
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
                                return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Recycling refresh token", Box::new(err));
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
                            return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Creating JWT token", Box::new(err));
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
                            return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Adding new refresh token to database", Box::new(err));
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
                            return endpoint_internal_server_error(LOG_IN_ROUTE_PATH, "Creating JWT token", Box::new(err));
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
    path = LOG_OUT_ROUTE_PATH,
    params(
        ("refresh_token_id" = uuid::Uuid, Path, description = "Refresh token id")
    ),
    responses(
        (status = 200, description = "User logged out"),
    )
)]
#[post("/user/logout/{refresh_token_id}")]
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
            return endpoint_internal_server_error(LOG_OUT_ROUTE_PATH, "Deleting refresh token", Box::new(err));
        }
    };

    return HttpResponse::Ok().finish();
}

/*
**  refresh
*/
#[utoipa::path(
    post,
    path = REFRESH_ROUTE_PATH,
    responses(
        (status = 200, description = "Token pair refreshed", body = JWTRefreshTokenPairDTO),
        (status = 401, description = "Possible messages: Invalid JWT token, 
                                                         Invalid Refresh token, 
                                                         Expired Refresh token,
                                                         Mismatched user and refresh token,
                                                         Mismatched claim and refresh token", body = SRouteError),
    )
)]
#[post("/user/refresh")]
#[rustfmt::skip]
async fn refresh(
    db: Data<DatabaseConnection>,
    token_pair: Json<JWTRefreshTokenPairDTO>  
) -> impl Responder {

    // Get ownership of incoming data
    let token_pair: JWTRefreshTokenPairDTO = token_pair.into_inner();

    // Get claims object from jwt string
    let claims: UserClaims = match decode_jwt_string(&token_pair.jwt_token, false) {
        Ok(token_data) => token_data.claims,
        Err(err) => {
            error!("JWT string decode failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };


    // Return unauthorized response if user is not found
    match UserEntity::find_by_id(claims.user_id)
        .one(db.get_ref())
        .await {
            Ok(user) => {
                if user.is_none() { return HttpResponse::Unauthorized().json(SRouteError { message: "Invalid JWT token" }); }
            },
            Err(err) => {
                return endpoint_internal_server_error(REFRESH_ROUTE_PATH, "Finding user by id", Box::new(err));
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
                return endpoint_internal_server_error(REFRESH_ROUTE_PATH, "Finding refresh token by id", Box::new(err));
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
            return endpoint_internal_server_error(REFRESH_ROUTE_PATH, "Recycling refresh token", Box::new(err));
        }
    };

    // Return new JWT Token
    return match create_jwt_token(&new_refresh_token, claims.user_id) {
        Ok(token) => HttpResponse::Ok().json(JWTRefreshTokenPairDTO {
            jwt_token: token,
            refresh_token_id: new_refresh_token.id
        }),
        Err(err) => {
            return endpoint_internal_server_error(REFRESH_ROUTE_PATH, "Creating JWT token", Box::new(err));
        }
    };
}

/*
**  verify-email
*/
#[utoipa::path(
    get,
    path = VERIFY_EMAIL_ROUTE_PATH,
    responses(
        (status = 200, description = "Email verified"),
        (status = 400, description = "Possible messages: User already verified", body = SRouteError),
        (status = 401, description = "Possible messages: User not found", body = SRouteError),
    )
)]
#[get("/user/email/verify/{token}")]
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
            return endpoint_internal_server_error(VERIFY_EMAIL_ROUTE_PATH, "Decoding email verification token", Box::new(err));
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
                return endpoint_internal_server_error(VERIFY_EMAIL_ROUTE_PATH, "Finding user by id", Box::new(err));
            }
        };

    // Check if user is already verified
    if user_model.is_email_verified == true {
        return HttpResponse::BadRequest().json(SRouteError { message: "User already verified" });
    }
        
    // Update email verified property of user
    let mut user_active_model: UserActiveModel = user_model.into();
    user_active_model.is_email_verified = Set(true);
    
    match user_active_model.update(db.get_ref()).await {
        Ok(_) => {},
        Err(err) => {
            return endpoint_internal_server_error(VERIFY_EMAIL_ROUTE_PATH, "Updating user", Box::new(err));
        }
    };

    return HttpResponse::Ok().body("Verified.");
}

/*
**  send-email-verification
*/
#[utoipa::path(
    get,
    path = SEND_VERIFICATION_EMAIL_ROUTE_PATH,
    responses(
        (status = 200, description = "Email sent"),
        (status = 400, description = "Possible messages: User already verified", body = SRouteError),
    )
)]
#[get("/user/email/send-verification")]
#[rustfmt::skip]
async fn send_email_verification(
    db: Data<DatabaseConnection>,
    authenticated_user: AuthenticatedUser
) -> impl Responder {

    // Try to find user
    let user: User = match UserEntity::find_by_id(authenticated_user.user_id)
        .one(db.get_ref())
        .await {
            Ok(user) => user.unwrap(), // This is not safe to do because user can be None but i think its impossible to be authorized with invalid id
            Err(err) => {
                return endpoint_internal_server_error(SEND_VERIFICATION_EMAIL_ROUTE_PATH, "Finding user by id", Box::new(err));
            }
        };

    // Check if user is already verified
    if user.is_email_verified == true {
        return HttpResponse::BadRequest().json(SRouteError { message: "User already verified" });
    }

    // Generate email verification token
    // Its used to verify user email
    let email_verification_token: String = match create_email_verification_token(user.id) {
        Ok(token) => token,
        Err(err) => {
            return endpoint_internal_server_error(SEND_VERIFICATION_EMAIL_ROUTE_PATH, "Creating email verification token", Box::new(err));
        }
    };

    // Send verification email to user
    match send_verification_email(&user.username, &user.email, &email_verification_token).await {
        Ok(_) => {},
        Err(err) => {
            return endpoint_internal_server_error(SEND_VERIFICATION_EMAIL_ROUTE_PATH, "Sending verification email", Box::new(err));
        }
    };

    return HttpResponse::Ok().finish();
}

/*
**  reset-password
*/
#[utoipa::path(
    post,
    path = RESET_PASSWORD_ROUTE_PATH,
    responses(
        (status = 200, description = "Password reset"),
        (status = 400, description = "Possible messages: Wrong password", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/reset-password")]
#[rustfmt::skip]
async fn reset_password(
    db: Data<DatabaseConnection>,
    authenticated_user: AuthenticatedUser,
    reset_password_json: Json<PasswordResetDTO>
) -> impl Responder {

    // Get ownership of incoming data
    let mut reset_password_data: PasswordResetDTO = reset_password_json.into_inner();    

    // Run incoming data validation
    if let Err(err) = reset_password_data.validate_data() {
        return HttpResponse::UnprocessableEntity().json(ValidationErrorDTO::from(err));
    }

    // Try to find user
    let user: User = match UserEntity::find_by_id(authenticated_user.user_id)
        .one(db.get_ref())
        .await {
            Ok(user) => user.unwrap(),
            Err(err) => {
                return endpoint_internal_server_error(RESET_PASSWORD_ROUTE_PATH, "Finding user by id", Box::new(err));
            }
        };

    // Hash old password
    let old_password_hash: String = match hash_password_with_salt(&user.salt, &reset_password_data.old_password) {
        Ok(hash) => hash,
        Err(err) => {
            return endpoint_internal_server_error(RESET_PASSWORD_ROUTE_PATH, "Hashing old password", Box::<dyn Error>::from(format!("{:?}", err)));
        }
    };

    // Check if old password is correct
    if user.hashed_password != old_password_hash {
        return HttpResponse::BadRequest().json(SRouteError { message: "Wrong password" });
    }

    // Hash new password
    let (new_salt, new_password_hash): (String, String) = match hash_password(&reset_password_data.new_password) {
        Ok(hash) => hash,
        Err(err) => {
            return endpoint_internal_server_error(RESET_PASSWORD_ROUTE_PATH, "Hashing new password", Box::<dyn Error>::from(format!("{:?}", err)));
        }
    };

    // Update password
    let mut user_active_model: UserActiveModel = user.into();
    user_active_model.hashed_password = Set(new_password_hash);
    user_active_model.salt = Set(new_salt);
    
    match user_active_model.update(db.get_ref()).await {
        Ok(_) => {},
        Err(err) => {
            return endpoint_internal_server_error(RESET_PASSWORD_ROUTE_PATH, "Updating user", Box::new(err));
        }
    };

    return HttpResponse::Ok().finish();
}

/*
**  check
*/
#[utoipa::path(
    get,
    path = CHECK_ROUTE_PATH,
    responses(
        (status = 200, description = "User logged in"),
        (status = 401, description = "User not logged in"),
    )
)]
#[get("/user/check")]
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
fn hash_password(password: &str) -> Result<(String, String), Argon2Error> {

    // Create salt string and argon2 instance
    let salt:       SaltString = SaltString::generate(&mut OsRng);
    let argon2:     Argon2<'_> = Argon2::default();

    // Use argon2 function to hash password
    let password_hash: PasswordHash<'_> = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(password_hash) => password_hash,
        Err(err) => return Err(err),
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
        .with_html(format!("<p>Hello {}, please click <a href='http://127.0.0.1:8080/user/email/verify/{}'>HERE</a> to verify your email.</p>", user_username, token).as_str());

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
    let claims: UserClaims = UserClaims { 
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
fn decode_jwt_string(jwt_string: &str, validate_expire_time: bool) -> Result<TokenData<UserClaims>, JWTTokenError> {

    // Get jwt secret
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    // Apply custom decode validation
    let mut validation = Validation::default();
    validation.validate_exp = validate_expire_time;

    // Decode jwt string
    return decode::<UserClaims>(
        jwt_string,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &validation,
    );
}
