use once_cell::sync::Lazy;
use regex::Regex;

use crate::{enums::type_of_request::TypeOfRequest, types::aliases::{EndpointPathInfo, StructStringPropSize}};

// ************************************************************************************
//
// FILES PATH
//
// ************************************************************************************
pub const DEFAULT_PROFILE_PICTURE_PATH: &'static str = "images/default.png";

// ************************************************************************************
//
// REGEXS
//
// ************************************************************************************
pub static TEAM_NAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"^[A-Za-z0-9\-]+$").unwrap());

// ************************************************************************************
//
// TIME
//
// ************************************************************************************
pub const REFRESH_TOKEN_EXPIRATION_OFFSET: i64 = 7; // days
pub const JWT_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes
pub const EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes
pub const TEAM_INVITATION_EXPIRATION_OFFSET: i64 = 5; // days

pub const REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION: u64 = 300; // seconds (5 minutes)
pub const REDIS_USER_TEAM_PERMISSIONS_EXPIRATION: u64 = 3_600; // seconds (1 hour)

// ************************************************************************************
//
// SIZE
//
// ************************************************************************************
pub const USER_USERNAME_MIN_LENGTH: StructStringPropSize = 1;
pub const USER_USERNAME_MAX_LENGTH: StructStringPropSize = 50;

// ************************************************************************************
//
// REDIS
//
// ************************************************************************************
pub const EMAIL_VERIFICATION_REDIS_KEY_PREFIX: &'static str = "emvrf";
pub const USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX: &'static str = "utpr";

// ************************************************************************************
//
// ENDPOINTS PATH
//
// ************************************************************************************
pub const ENDPOINTS_THAT_REQUIRE_VERIFIED_EMAIL: [&'static str; 4] = [
    "/team", "/team-role", "/team-invitations", "/team_members"
];

pub const DEFAULT_TEAM_ROLE_NAMES: [&'static str; 3] = ["Owner", "Moderator", "Member"];

pub const USER_SIGN_UP_ROUTE_PATH: EndpointPathInfo = ("/user/signup", TypeOfRequest::POST);
pub const USER_LOG_IN_ROUTE_PATH: EndpointPathInfo = ("/user/login", TypeOfRequest::POST);
pub const USER_LOG_OUT_ROUTE_PATH: EndpointPathInfo = ("/user/logout/{refresh_token_id}", TypeOfRequest::POST);
pub const USER_RESET_PASSWORD_ROUTE_PATH: EndpointPathInfo = ("/user/reset-password", TypeOfRequest::POST);
pub const USER_REFRESH_ROUTE_PATH: EndpointPathInfo = ("/user/refresh", TypeOfRequest::POST);
pub const USER_UPDATE_ROUTE_PATH: EndpointPathInfo = ("/user/me", TypeOfRequest::PUT);
pub const USER_UPDATE_PROFILE_PICTURE_ROUTE_PATH: EndpointPathInfo = ("/user/me/profile-picture", TypeOfRequest::PATCH);
pub const USER_UPDATE_DEFAULT_TEAM_ROUTE_PATH: EndpointPathInfo = ("/user/me/default-team/{team_id}", TypeOfRequest::PATCH);
pub const VERIFY_EMAIL_ROUTE_PATH: EndpointPathInfo = ("/user/email/verify/{email}/{code}", TypeOfRequest::GET);
pub const SEND_VERIFICATION_EMAIL_ROUTE_PATH: EndpointPathInfo = ("/user/email/send-verification", TypeOfRequest::GET);
pub const GET_USER_INFO_ROUTE_PATH: EndpointPathInfo = ("/user/me", TypeOfRequest::GET);
pub const CHECK_ROUTE_PATH: EndpointPathInfo = ("/user/check", TypeOfRequest::GET);


pub const TEAM_CREATE_ROUTE_PATH: EndpointPathInfo = ("/team", TypeOfRequest::POST);
pub const TEAM_UPDATE_ROUTE_PATH: EndpointPathInfo = ("/team/{team_id}", TypeOfRequest::PUT);
pub const TEAM_DELETE_ROUTE_PATH: EndpointPathInfo = ("/team/{team_id}", TypeOfRequest::DELETE);
pub const TEAM_LEAVE_ROUTE_PATH: EndpointPathInfo = ("/team/leave/{team_id}", TypeOfRequest::DELETE);


pub const TEAM_ROLE_CREATE_ROUTE_PATH: EndpointPathInfo = ("/team-role/create", TypeOfRequest::POST);
pub const TEAM_ROLE_UPDATE_ROUTE_PATH: EndpointPathInfo = ("/team-role/update/{team_role_id}", TypeOfRequest::PUT);
pub const TEAM_ROLE_CHANGE_ROUTE_PATH: EndpointPathInfo = ("/team-role/change/{team_id}/{role_id}", TypeOfRequest::PATCH);
pub const TEAM_ROLE_GET_ROUTE_PATH: EndpointPathInfo = ("/team-role/{team_id}", TypeOfRequest::GET);
pub const TEAM_ROLE_DELETE_ROUTE_PATH: EndpointPathInfo = ("/team-role/delete/{team_role_id}", TypeOfRequest::DELETE);


pub const TEAM_INVITATION_SEND_ROUTE_PATH: EndpointPathInfo = ("/team-invitations", TypeOfRequest::POST);
pub const TEAM_INVITATION_ACCEPT_ROUTE_PATH: EndpointPathInfo = ("/team-invitations/accept/{code}", TypeOfRequest::PATCH);
pub const TEAM_INVITATION_DECLINE_ROUTE_PATH: EndpointPathInfo = ("/team-invitations/decline/{code}", TypeOfRequest::PATCH);

pub const TEAM_MEMBERS_GET_ROUTE_PATH: EndpointPathInfo = ("/team/members/{team_id}", TypeOfRequest::GET);
pub const TEAM_MEMBERS_KICK_ROUTE_PATH: EndpointPathInfo = ("/team_members/kick/{team_id}", TypeOfRequest::DELETE);
