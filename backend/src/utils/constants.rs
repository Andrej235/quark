#[rustfmt::skip]
// ------------------------------------------------------------------------------------
//
// TOKEN
//
// ------------------------------------------------------------------------------------
pub const REFRESH_TOKEN_EXPIRATION_OFFSET: i64 = 7; // days
pub const JWT_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes
pub const EMAIL_VERIFICATION_TOKEN_EXPIRATION_OFFSET: i64 = 15; // minutes

// ------------------------------------------------------------------------------------
//
// URLS
//
// ------------------------------------------------------------------------------------
pub const SIGN_UP_ROUTE_PATH: &'static str = "/user/signup";
pub const LOG_IN_ROUTE_PATH: &'static str = "/user/login";
pub const LOG_OUT_ROUTE_PATH: &'static str = "/user/logout/{refresh_token_id}";
pub const REFRESH_ROUTE_PATH: &'static str = "/user/refresh";
pub const RESET_PASSWORD_ROUTE_PATH: &'static str = "/user/reset-password";
pub const USER_UPDATE_ROUTE_PATH: &'static str = "/user/update";
pub const CHECK_ROUTE_PATH: &'static str = "/user/check";

pub const VERIFY_EMAIL_ROUTE_PATH: &'static str = "/user/email/verify/{token}";
pub const SEND_VERIFICATION_EMAIL_ROUTE_PATH: &'static str = "/user/email/send-verification";

pub const TEAM_CREATE_ROUTE_PATH: &'static str = "/team/create";
pub const TEAM_DELETE_ROUTE_PATH: &'static str = "/team/delete/{team_id}";
pub const TEAM_UPDATE_ROUTE_PATH: &'static str = "/team/update/{team_id}";

pub const TEAM_ROLE_CREATE_ROUTE_PATH: &'static str = "/team-role/create";
pub const TEAM_ROLE_DELETE_ROUTE_PATH: &'static str = "/team-role/delete/{team_role_id}";
pub const TEAM_ROLE_UPDATE_ROUTE_PATH: &'static str = "/team-role/update/{team_role_id}";
