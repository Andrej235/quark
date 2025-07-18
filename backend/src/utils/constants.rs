use crate::enums::type_of_request::TypeOfRequest;

// ************************************************************************************
//
// FILES PATH
//
// ************************************************************************************
pub const DEFAULT_PROFILE_PICTURE_PATH: &'static str = "images/default.png";

// ************************************************************************************
//
// TOKEN
//
// ************************************************************************************
pub const REFRESH_TOKEN_EXPIRATION_OFFSET: i64 = 7; // days
pub const JWT_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes
pub const EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes

// ************************************************************************************
//
// ENDPOINTS PATH
//
// ************************************************************************************
pub const ENDPOINTS_THAT_REQUIRE_VERIFIED_EMAIL: [&'static str; 2] = ["/team", "/team-role"];

pub const USER_SIGN_UP_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/signup", TypeOfRequest::POST);
pub const USER_LOG_IN_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/login", TypeOfRequest::POST);
pub const USER_LOG_OUT_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/logout/{refresh_token_id}", TypeOfRequest::POST);
pub const USER_RESET_PASSWORD_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/reset-password", TypeOfRequest::POST);
pub const USER_REFRESH_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/refresh", TypeOfRequest::POST);

pub const USER_UPDATE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/update", TypeOfRequest::PATCH);
pub const USER_UPDATE_PROFILE_PICTURE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/me/profile-picture", TypeOfRequest::PATCH);

pub const VERIFY_EMAIL_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/email/verify/{token}", TypeOfRequest::GET);
pub const SEND_VERIFICATION_EMAIL_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/email/send-verification", TypeOfRequest::GET);
pub const GET_USER_INFO_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/me", TypeOfRequest::GET);
pub const CHECK_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/user/check", TypeOfRequest::GET);

pub const TEAM_CREATE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team", TypeOfRequest::POST);
pub const TEAM_UPDATE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team/{team_id}", TypeOfRequest::POST);
pub const TEAM_DELETE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team/{team_id}", TypeOfRequest::POST);

pub const TEAM_ROLE_CREATE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team-role/create", TypeOfRequest::POST);
pub const TEAM_ROLE_DELETE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team-role/delete/{team_role_id}", TypeOfRequest::DELETE);
pub const TEAM_ROLE_UPDATE_ROUTE_PATH: (&'static str, TypeOfRequest) = ("/team-role/update/{team_role_id}", TypeOfRequest::PUT);
