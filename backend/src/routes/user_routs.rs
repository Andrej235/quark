// ************************************************************************************
//
// IMPORTS
//
// ************************************************************************************
use crate::models::dtos::jwt_refresh_token_pair_dto::JWTRefreshTokenPairDTO;
use crate::models::dtos::login_result_dto::LogInResultDTO;
use crate::models::dtos::login_user_dto::LoginUserDTO;
use crate::models::dtos::password_reset_dto::PasswordResetDTO;
use crate::models::dtos::team_info_dto::TeamInfoDTO;
use crate::models::dtos::update_profile_picture_dto::UpdateProfilePictureDTO;
use crate::models::dtos::update_user::UpdateUserDTO;
use crate::models::dtos::user_info_dto::UserInfoDTO;
use crate::models::dtos::validation_error_dto::ValidationErrorDTO;
use crate::models::middleware::advanced_authenticated_user::AdvancedAuthenticatedUser;
use crate::models::middleware::basic_authenticated_user::BasicAuthenticatedUser;
use crate::models::middleware::validated_json::ValidatedJson;
use crate::models::route_error::RouteError;
use crate::models::sroute_error::SRouteError;
use crate::models::user_claims::UserClaims;
use crate::utils::constants::{
    CHECK_ROUTE_PATH, GET_USER_INFO_ROUTE_PATH, JWT_TOKEN_EXPIRATION_OFFSET,
    REFRESH_TOKEN_EXPIRATION_OFFSET, SEND_VERIFICATION_EMAIL_ROUTE_PATH, USER_LOG_IN_ROUTE_PATH,
    USER_LOG_OUT_ROUTE_PATH, USER_REFRESH_ROUTE_PATH, USER_RESET_PASSWORD_ROUTE_PATH,
    USER_SIGN_UP_ROUTE_PATH, USER_UPDATE_DEFAULT_TEAM_ROUTE_PATH,
    USER_UPDATE_PROFILE_PICTURE_ROUTE_PATH, USER_UPDATE_ROUTE_PATH, VERIFY_EMAIL_ROUTE_PATH,
};
use crate::utils::http_helper::HttpHelper;
use crate::utils::redis_service::RedisService;
use crate::{
    entity::refresh_tokens::{
        ActiveModel as RefreshTokenActiveModel, Column as RefreshTokenColumn,
        Entity as RefreshTokenEntity, Model as RefreshToken,
    },
    entity::team_members::{Column as TeamMemberColumn, Entity as TeamMemberEntity},
    entity::team_roles::Entity as TeamRoleEntity,
    entity::teams::Entity as TeamEntity,
    entity::users::{
        ActiveModel as UserActiveModel, Column as UserColumn, Entity as UserEntity, Model as User,
    },
    models::dtos::create_user_dto::CreateUserDTO,
};
use crate::{JWT_SECRET, RESEND_EMAIL, RESEND_INSTANCE};
use actix_web::error::Error as ActixWebError;
use actix_web::web::{Data, Path};
use actix_web::*;
use argon2::PasswordHash;
use argon2::{
    password_hash::{rand_core::OsRng, Error as Argon2Error, SaltString},
    Argon2, PasswordHasher,
};
use base64::Engine;
use chrono::{Duration, NaiveDateTime, Utc};
use image::imageops::FilterType;
use image::{DynamicImage, ImageFormat, ImageReader};
use jsonwebtoken::{
    decode, encode, errors::Error as JWTTokenError, DecodingKey, EncodingKey, Header, TokenData,
    Validation,
};
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::{Error as ResendError, Resend};
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait,
    PaginatorTrait, QueryFilter,
};
use std::error::Error;
use std::io::Cursor;
use tracing::error;
use uuid::Uuid;

// ************************************************************************************
//
// ROUTES - POST
//
// ************************************************************************************
/*
**  signup
*/
#[utoipa::path(
    post,
    path = USER_SIGN_UP_ROUTE_PATH.0,
    request_body = CreateUserDTO,
    responses(
        (status = 200, description = "User created"),
        (status = 400, description = "Possible errors: User already exists", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/signup")]
#[rustfmt::skip]
pub async fn user_sign_up(
    db: Data<DatabaseConnection>,
    json_data: ValidatedJson<CreateUserDTO>
) -> impl Responder {

    let user_data: &CreateUserDTO = json_data.get_data();

    // Check if user already exists
    let matching_users: u64 = match UserEntity::find()
        .filter(UserColumn::Username.eq(&user_data.username))
        .filter(UserColumn::Email.eq(&user_data.email))
        .count(db.get_ref())
        .await {
            Ok(count) => count,
            Err(err) => {
                return HttpHelper::endpoint_internal_server_error(USER_SIGN_UP_ROUTE_PATH, "Finding user with filterting", Box::new(err));
            }
        };

    // If there us more than 0 users found return error
    // We cant allow multiple users with same username or email
    if matching_users > 0 {
        return HttpResponse::BadRequest().json(SRouteError { message: "User already exists" });
    }

    // Hash password
    let (salt, password_hash): (String, String) = match hash_password(&user_data.password) {
        Ok((salt, password_hash)) => (salt, password_hash),
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_SIGN_UP_ROUTE_PATH, "Hashing password", Box::<dyn Error>::from(format!("{:?}", err)));
        }
    };

    // Create user
    let user_insertion_result: Result<User, DbErr> = UserActiveModel {
        id:                 Set(Uuid::now_v7()),
        username:           Set(user_data.username.clone()),
        name:               Set(user_data.name.clone()),
        last_name:          Set(user_data.last_name.clone()),
        email:              Set(user_data.email.clone()),
        hashed_password:    Set(password_hash),
        salt:               Set(salt),
        is_email_verified:  Set(false),
        profile_picture:    Set(None), // no default profile picture
        default_team_id:    Set(None), // no default team
    }.insert(db.get_ref()).await;

    if let Err(err) = user_insertion_result {
        return HttpHelper::endpoint_internal_server_error(USER_SIGN_UP_ROUTE_PATH, "Creating user", Box::new(err));
    }

    return HttpResponse::Ok().finish();
}

/*
**  login
*/
#[utoipa::path(
    post,
    path = USER_LOG_IN_ROUTE_PATH.0,
    request_body = LoginUserDTO,
    responses(
        (status = 200, description = "User logged in", body = LogInResultDTO),
        (status = 400, description = "Possible errors: Wrong password, User not found", body = SRouteError),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/login")]
#[rustfmt::skip]
async fn user_log_in(
    db: Data<DatabaseConnection>,
    json_data: ValidatedJson<LoginUserDTO>,
) -> impl Responder {

    let user_data: &LoginUserDTO = json_data.get_data();

    // Check if user already exists in database
    let existing_user: Option<User> = match UserEntity::find()
        .filter(UserColumn::Email.eq(&user_data.email))
        .one(db.get_ref())
        .await
    {
        Ok(user) => user,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Finding user with filtering", Box::new(err));
        }
    };

    // Abort endpoint execution if no user is found
    if existing_user.is_none() {
        return HttpResponse::BadRequest().json(SRouteError {
            message: "User not found",
        });
    }

    let user: User = existing_user.unwrap();

    // Hash pasword and check if it correct
    let provided_password_hash: String =
        match hash_password_with_salt(&user.salt, &user_data.password) {
            Ok(password_hash) => password_hash,
            Err(err) => {
                return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Hashing password", Box::<dyn Error>::from(format!("{:?}", err)));
            }
        };

    if provided_password_hash != user.hashed_password {
        return HttpResponse::BadRequest().json(SRouteError { message: "Wrong password" });
    }

    // Try to get refresh token from database
    let existing_refresh_token_result: Option<RefreshToken> = match RefreshTokenEntity::find()
        .filter(RefreshTokenColumn::UserId.eq(user.id))
        .one(db.get_ref())
        .await
    {
        Ok(refresh_token) => refresh_token,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Finding refresh token", Box::new(err));
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
                        return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Recycling refresh token", Box::new(err));
                    }
                };
            }

            // Create and return new jwt token
            match create_jwt_token(&refresh_token, user.id) {
                Ok(token) => {
                    return HttpResponse::Ok().json(LogInResultDTO {
                        jwt_token: token,
                        refresh_token_id: refresh_token.id,
                    });
                }
                Err(err) => {
                    return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Creating JWT token", Box::new(err));
                }
            };
        }

        // If refresh token doesn't exist create new refresh token and JWT token
        None => {

            // Try to create and add new refresh token to database
            let new_refresh_token_active_model: RefreshTokenActiveModel =
                create_refresh_token(user.id);
                
            let add_refresh_token_result: Result<RefreshToken, DbErr> =
                new_refresh_token_active_model.insert(db.get_ref()).await;

            let refresh_token = match add_refresh_token_result {
                Ok(token) => token,
                Err(err) => {
                    return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Adding new refresh token to database", Box::new(err));
                }
            };

            // Create and return new jwt token
            match create_jwt_token(&refresh_token, user.id) {
                Ok(token) => {
                    return HttpResponse::Ok().json(LogInResultDTO {
                        jwt_token: token,
                        refresh_token_id: refresh_token.id,
                    });
                }
                Err(err) => {
                    return HttpHelper::endpoint_internal_server_error(USER_LOG_IN_ROUTE_PATH, "Creating JWT token", Box::new(err));
                }
            };
        }
    }
}

/*
**  logout
*/
#[utoipa::path(
    post,
    path = USER_LOG_OUT_ROUTE_PATH.0,
    params(
        ("refresh_token_id" = uuid::Uuid, Path, description = "Refresh token id")
    ),
    responses(
        (status = 200, description = "User logged out"),
    )
)]
#[post("/user/logout/{refresh_token_id}")]
#[rustfmt::skip]
async fn user_log_out(    
    db: Data<DatabaseConnection>,
    path: Path<Uuid>
) -> impl Responder {

    // Get refresh token id from path
    let refresh_token_id = path.into_inner();

    // Try to delete refresh token
    match RefreshTokenEntity::delete_by_id(refresh_token_id)
        .exec(db.get_ref())
        .await {
            Ok(_) => (),
            Err(err) => {
                return HttpHelper::endpoint_internal_server_error(USER_LOG_OUT_ROUTE_PATH, "Deleting refresh token", Box::new(err));
            }
        };

    return HttpResponse::Ok().finish();
}

/*
**  reset-password
*/
#[utoipa::path(
    post,
    path = USER_RESET_PASSWORD_ROUTE_PATH.0,
    responses(
        (status = 200, description = "Password reset"),
        (status = 400, description = "Possible messages: Wrong password", body = SRouteError),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/reset-password")]
#[rustfmt::skip]
async fn user_password_reset(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<PasswordResetDTO>
) -> impl Responder {

    // Get json data
    let reset_password_data: &PasswordResetDTO = json_data.get_data();

    // Hash old password
    let old_password_hash: String = match hash_password_with_salt(&auth_user.user.salt, &reset_password_data.old_password) {
        Ok(hash) => hash,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_RESET_PASSWORD_ROUTE_PATH, "Hashing old password", Box::<dyn Error>::from(format!("{:?}", err)));
        }
    };

    // Check if old password is correct
    if auth_user.user.hashed_password != old_password_hash {
        return HttpResponse::BadRequest().json(SRouteError { message: "Wrong password" });
    }

    // Hash new password
    let (new_salt, new_password_hash): (String, String) = match hash_password(&reset_password_data.new_password) {
        Ok(hash) => hash,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_RESET_PASSWORD_ROUTE_PATH, "Hashing new password", Box::<dyn Error>::from(format!("{:?}", err)));
        }
    };

    // Update password
    let mut user_active_model: UserActiveModel = auth_user.user.into();
    user_active_model.hashed_password = Set(new_password_hash);
    user_active_model.salt = Set(new_salt);
    
    match user_active_model.update(db.get_ref()).await {
        Ok(_) => {},
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_RESET_PASSWORD_ROUTE_PATH, "Updating user", Box::new(err));
        }
    };

    return HttpResponse::Ok().finish();
}

/*
**  refresh
*/
#[utoipa::path(
    post,
    path = USER_REFRESH_ROUTE_PATH.0,
    responses(
        (status = 200, description = "Token pair refreshed", body = JWTRefreshTokenPairDTO),
        (status = 400, description = "Possible messages: Invalid JWT token, 
                                                         Invalid Refresh token, 
                                                         Expired Refresh token,
                                                         Mismatched user and refresh token,
                                                         Mismatched claim and refresh token", body = SRouteError),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[post("/user/refresh")]
#[rustfmt::skip]
async fn user_refresh(
    db: Data<DatabaseConnection>,
    json_data: ValidatedJson<JWTRefreshTokenPairDTO>  
) -> impl Responder {

    // Get json data
    let token_pair: &JWTRefreshTokenPairDTO = json_data.get_data();

    // Get claims object from jwt string
    let claims: UserClaims = match decode_jwt_string(&token_pair.jwt_token, false) {
        Ok(token_data) => token_data.claims,
        Err(err) => {
            error!("JWT string decode failed: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };


    // Check if user exists with same id from claims
    match HttpHelper::find_user_by_id(db.get_ref(), claims.user_id).await {
        Ok(Some(_)) => {},
        Ok(None) => return HttpResponse::Unauthorized().finish(),
        Err(err) => return HttpHelper::endpoint_internal_server_error(USER_REFRESH_ROUTE_PATH, "Finding user by id", err)
    }

    // Return unauthorized response if refresh token is not found
    let refresh_token: RefreshToken = match RefreshTokenEntity::find_by_id(token_pair.refresh_token_id)
        .one(db.get_ref())
        .await {
            Ok(token) => {
                if token.is_none() { return HttpResponse::Unauthorized().json(SRouteError { message: "Invalid Refresh token" }); }
                token.unwrap()
            },
            Err(err) => {
                return HttpHelper::endpoint_internal_server_error(USER_REFRESH_ROUTE_PATH, "Finding refresh token by id", Box::new(err));
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


    // Delete old refresh token and create new one
    let new_refresh_token: RefreshToken = match recycle_refresh_token(refresh_token.id, claims.user_id, db).await {
        Ok(token) => token,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_REFRESH_ROUTE_PATH, "Recycling refresh token", Box::new(err));
        }
    };

    // Return new JWT Token
    return match create_jwt_token(&new_refresh_token, claims.user_id) {
        Ok(token) => HttpResponse::Ok().json(JWTRefreshTokenPairDTO {
            jwt_token: token,
            refresh_token_id: new_refresh_token.id
        }),
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(USER_REFRESH_ROUTE_PATH, "Creating JWT token", Box::new(err));
        }
    };
}

// ************************************************************************************
//
// ROUTES - PUT
//
// ************************************************************************************
/*
**  update
*/
#[utoipa::path(
    put,
    path = USER_UPDATE_ROUTE_PATH.0,
    request_body = UpdateUserDTO,
    responses(
        (status = 200, description = "User updated"),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[put("/user/me")]
#[rustfmt::skip]
async fn user_update(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<UpdateUserDTO>
) -> impl Responder {
    
    // Get json data
    let update_user_data: &UpdateUserDTO = json_data.get_data();

    // Update user
    let mut user_active_model: UserActiveModel = auth_user.user.into();

    if update_user_data.name.is_some() {
        user_active_model.name = Set(update_user_data.name.clone().unwrap());
    }

    if update_user_data.last_name.is_some() {
        user_active_model.last_name = Set(update_user_data.last_name.clone().unwrap());
    }

    if update_user_data.username.is_some() {
        user_active_model.username = Set(update_user_data.username.clone().unwrap());
    }

    match user_active_model
        .update(db.get_ref())
        .await {
            Ok(_) => {},
            Err(err) => {
                return HttpHelper::endpoint_internal_server_error(USER_UPDATE_ROUTE_PATH, "Updating user", Box::new(err));
            }
        };

    return HttpResponse::Ok().finish();
}

// ************************************************************************************
//
// ROUTES - PATCH
//
// ************************************************************************************
/*
**  update profile picture
*/
#[utoipa::path(
    patch,
    path = USER_UPDATE_PROFILE_PICTURE_ROUTE_PATH.0,
    request_body = UpdateProfilePictureDTO,
    responses(
        (status = 200, description = "Profile picture changed"),
        (status = 400, description = "Possible messages: Invalid base64 string
                                                         Invalid [] format
                                                         Failed to convert image into bytes", body = RouteError),
        (status = 401, description = ""),
        (status = 422, description = "Validation failed", body = ValidationErrorDTO),
    )
)]
#[patch("/user/me/profile-picture")]
#[rustfmt::skip]
#[allow(unused_assignments)]
async fn user_update_profile_picture(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    json_data: ValidatedJson<UpdateProfilePictureDTO>
) -> impl Responder {

    // Get json data
    let update_profile_picture_data: &UpdateProfilePictureDTO = json_data.get_data();
        
    // Get bytes of new profile picture
    let mut new_image_bytes: Option<Vec<u8>> = None;

    if update_profile_picture_data.profile_picture.is_none() {
        new_image_bytes = None;        
    }
    else {
        new_image_bytes = Some(match decode_base64_string(update_profile_picture_data.profile_picture.as_ref().unwrap(), ImageFormat::Png) {
            Ok(bytes) => bytes,
            Err(err) => {
                // We dont return internal server error here because we know that user should see error message
                return HttpResponse::BadRequest().json(RouteError { message: err.to_string() }); 
            }
        });
    }

    // Update user
    let mut user_active_model: UserActiveModel = auth_user.user.into();
    user_active_model.profile_picture = Set(new_image_bytes);

    let update_result = user_active_model.update(db.get_ref()).await;
    if let Err(err) = update_result {
        return HttpHelper::endpoint_internal_server_error(USER_UPDATE_PROFILE_PICTURE_ROUTE_PATH, "Updating user", Box::new(err));
    }

    return HttpResponse::Ok().finish();
}

/*
**  update default team
*/
#[utoipa::path(
    patch,
    path = USER_UPDATE_DEFAULT_TEAM_ROUTE_PATH.0,
    params(
        ("team_id" = uuid::Uuid, Path)
    ),
    responses(
        (status = 200, description = "Updated default team"),
        (status = 401, description = ""),
        (status = 404, description = "Team not found"),
    )
)]
#[patch("/user/me/default-team/{team_id}")]
#[rustfmt::skip]
async fn user_update_default_team(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser,
    team_id: Path<Uuid>
) -> impl Responder {

    let new_default_team_id: Uuid = team_id.into_inner();

    // Prevent further endpoint execution if existing user default team id is same as new id
    // We dont need to know if team is valid because this is simple check
    if auth_user.user.default_team_id == Some(new_default_team_id) {
        println!("Same");
        return HttpResponse::Ok().finish();
    }

    // Make sure that team is valid
    match HttpHelper::find_team(USER_UPDATE_DEFAULT_TEAM_ROUTE_PATH, db.get_ref(), new_default_team_id, false).await {
        Ok(_) => {},
        Err(err) => { return err; }
    };

    // Update user
    let mut user_active_model: UserActiveModel = auth_user.user.into();
    user_active_model.default_team_id = Set(Some(new_default_team_id));

    let update_result = user_active_model.update(db.get_ref()).await;
    if let Err(err) = update_result {
        return HttpHelper::endpoint_internal_server_error(USER_UPDATE_DEFAULT_TEAM_ROUTE_PATH, "Updating user", Box::new(err));
    }

    HttpResponse::Ok().finish()
}

// ************************************************************************************
//
// ROUTES - GET
//
// ************************************************************************************
/*
**  verify-email
*/
#[utoipa::path(
    get,
    path = VERIFY_EMAIL_ROUTE_PATH.0,
    params(
        ("email" = String, Path),
        ("code" = String, Path),
    ),
    responses(
        (status = 200, description = "Email verified"),
        (status = 400, description = "Invalid code, User already verified", body = SRouteError),
        (status = 401, description = ""),
    )
)]
#[get("/user/email/verify/{email}/{code}")]
#[rustfmt::skip]
async fn verify_email(
    db: Data<DatabaseConnection>,
    redis_service: Data<RedisService>,
    path_data: Path<(String, String)> 
) -> impl Responder {

    // Get ownership of incoming data
    let (email, code): (String, String) = path_data.into_inner();

    // Make sure that its valid code
    // If code is not valid abort endpoint execution
    let can_verify = match HttpHelper::verify_cached_email_verification_code(redis_service.get_ref(), &email, &code).await {
        Ok(can_verify) => can_verify,
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(VERIFY_EMAIL_ROUTE_PATH, "Storing email verification code", Box::new(err));
        }
    };

    if can_verify == false {
        return HttpResponse::BadRequest().json(SRouteError { message: "Invalid code" });
    }

    // Try to find user
    let user_model: User = match HttpHelper::find_user_by_email(db.get_ref(), email).await {
        Ok(Some(user)) => user,
        Ok(None) => return HttpResponse::Unauthorized().finish(),
        Err(err) => return HttpHelper::endpoint_internal_server_error(USER_RESET_PASSWORD_ROUTE_PATH, "Finding user by id", err)
    };

    // Check if user is already verified
    if user_model.is_email_verified == true {
        return HttpResponse::BadRequest().json(SRouteError { message: "User already verified" });
    }

    // Update user
    let mut user_active_model: UserActiveModel = user_model.into();
    user_active_model.is_email_verified = Set(true);

    let update_result = user_active_model.update(db.get_ref()).await;
    if let Err(err) = update_result {
        return HttpHelper::endpoint_internal_server_error(VERIFY_EMAIL_ROUTE_PATH, "Updating user", Box::new(err));
    }

    return HttpResponse::Ok().body("Verified.");
}

/*
**  send-email-verification
*/
#[utoipa::path(
    get,
    path = SEND_VERIFICATION_EMAIL_ROUTE_PATH.0,
    responses(
        (status = 200, description = "Email sent"),
        (status = 400, description = "User already verified", body = SRouteError),
    )
)]
#[get("/user/email/send-verification")]
#[rustfmt::skip]
async fn send_email_verification(
    redis_service: Data<RedisService>,
    auth_user: AdvancedAuthenticatedUser
) -> impl Responder {

    // If user is already verified there is no reason for verification code to be sent
    if auth_user.user.is_email_verified == true {
        return HttpResponse::BadRequest().json(SRouteError { message: "User already verified" });
    }

    // Generate token that will be use in link for verification or for use to manually verify
    let code: String = HttpHelper::generate_random_email_verification_code();

    match send_verification_email(&auth_user.user.username, &auth_user.user.email, &code).await {
        Ok(_) => {},
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(SEND_VERIFICATION_EMAIL_ROUTE_PATH, "Sending verification email", Box::new(err));
        }
    };

    // Store generated verification code in redis
    match HttpHelper::cache_email_verification_code(redis_service.get_ref(), auth_user.user.email.as_str(), code).await {
        Ok(_) => {},
        Err(err) => {
            return HttpHelper::endpoint_internal_server_error(SEND_VERIFICATION_EMAIL_ROUTE_PATH, "Storing verification code in redis", Box::new(err));
        }
    }

    return HttpResponse::Ok().finish();
}

/*
**  get user info
*/
#[utoipa::path(
    get,
    path = GET_USER_INFO_ROUTE_PATH.0,
    responses(
        (status = 200, description = "User info", body = UserInfoDTO),
        (status = 401, description = ""),
    )
)]
#[get("/user/me")]
#[rustfmt::skip]
async fn get_user_info(
    db: Data<DatabaseConnection>,
    auth_user: AdvancedAuthenticatedUser
) -> impl Responder {

    // Encode profile picture as base64 string
    let profile_picture_base64: Option<String> = match auth_user.user.profile_picture {
        None => None,
        Some(image_bytes) => {
            Some(base64::engine::general_purpose::STANDARD.encode(&image_bytes)) // TODO: Handle possible errors
        }
    };

    // Get all teams name in which user is member
    let team_info = match TeamMemberEntity::find()
        .filter(TeamMemberColumn::UserId.eq(auth_user.user.id))
        .find_also_related(TeamEntity)
        .find_also_related(TeamRoleEntity)
        .all(db.get_ref())
        .await 
    {
        Ok(team_records) => {
            team_records
                .into_iter()
                .filter_map(|(_, team, team_role)| {
                    match (team, team_role) {
                        (Some(t), Some(role)) => Some(TeamInfoDTO { 
                            id: t.id, 
                            name: t.name, 
                            description: t.description,
                            role_name: role.name,
                            permissions: role.permissions
                        }),
                        _ => None, // Skip if either team or role is missing
                    }
                })
                .collect::<Vec<TeamInfoDTO>>()
        },
        Err(err) => return HttpHelper::endpoint_internal_server_error(
            GET_USER_INFO_ROUTE_PATH,
            "Finding team records",
            Box::new(err)
        ),
    };

    // Create DTO object
    let user_info: UserInfoDTO = UserInfoDTO {
        username: auth_user.user.username,
        name: auth_user.user.name,
        last_name: auth_user.user.last_name,
        email: auth_user.user.email,
        is_email_verified: auth_user.user.is_email_verified,
        profile_picture: profile_picture_base64,
        
        teams_info: team_info,
        default_team_id: auth_user.user.default_team_id
    };
    
    return HttpResponse::Ok().json(user_info);
}

/*
**  check
*/
#[utoipa::path(
    get,
    path = CHECK_ROUTE_PATH.0,
    responses(
        (status = 200, description = "User logged in"),
        (status = 401, description = "User not logged in"),
    )   
)]
#[get("/user/check")]
#[rustfmt::skip]
async fn check(
    _auth_user: BasicAuthenticatedUser
) -> impl Responder {
    HttpResponse::Ok().finish()
}

// ************************************************************************************
//
// HELPER FUNCTIONS
//
// ************************************************************************************
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
/// Sends email verification email <br/>
/// Uses Resend API with custom domain to send verification email
/// Returns **Ok** or **error**
async fn send_verification_email(user_username: &str, user_email: &str, code: &str) -> Result<(), ResendError> {

    // Get resend instance
    let resend_instance: &Resend = RESEND_INSTANCE.get().unwrap();

    // Prep email data
    let from:       String = format!("Quark <{}>", RESEND_EMAIL.get().unwrap());
    let to:         [&str; 1] = [user_email];
    let subject:    &'static str = "Quark Email Verification";

    // Create email option instance
    let email = CreateEmailBaseOptions::new(&from, to, subject)
        .with_html(format!("<p>Hello {}, please click <a href='http://127.0.0.1:8080/user/email/verify/{}/{}'>HERE</a> to verify your email, or enter this code: <b>{}</b> into the app.</p>", user_username, user_email, code, code).as_str());

    // Send email
    match resend_instance.emails.send(email).await {
        Ok(_) => Ok(()),
        Err(err) => return Err(err),
    }
}

#[rustfmt::skip]
/// Decodes base64 string into bytes
/// Returns **bytes** or **error**
fn decode_base64_string(base64_string: &str, image_format: ImageFormat) -> Result<Vec<u8>, ActixWebError> {

    // Try to decode base64 string
    let image_bytes: Vec<u8> = base64::engine::general_purpose::STANDARD
        .decode(base64_string)
        .map_err(|_| actix_web::error::ErrorBadRequest("Invalid base64 string"))?;

    // Check if image is JPEG format
    let cursor: Cursor<&Vec<u8>> = Cursor::new(&image_bytes);
    
    let mut reader: ImageReader<Cursor<&Vec<u8>>> = ImageReader::new(cursor);
    reader.set_format(image_format);

    let img: DynamicImage = reader
        .decode()
        .map_err(|_| actix_web::error::ErrorBadRequest(format!("Invalid [{:?}] format", image_format)))?;

    // Resize image
    let resized_img: DynamicImage = img.resize(256, 256, FilterType::Lanczos3);

    // Convert image to bytes
    let mut out_bytes: Vec<u8> = vec![];
    let mut cursor: Cursor<&mut Vec<u8>> = Cursor::new(&mut out_bytes);

    resized_img
        .write_to(&mut cursor, image_format)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to convert image into bytes"))?;

    return Ok(out_bytes);
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
