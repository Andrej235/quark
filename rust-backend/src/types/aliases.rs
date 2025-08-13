use crate::enums::type_of_request::TypeOfRequest;
use actix_web::HttpResponse;
use uuid::Uuid;

pub type EndpointPathInfo = (&'static str, TypeOfRequest);

pub type HttpResult<T> = Result<T, HttpResponse>;
pub type OptionalHttpResult<T> = Result<Option<T>, HttpResponse>;
pub type EmptyHttpResult = HttpResult<()>;

pub type StructStringPropSize = u64;
pub type PermissionBits = i32;
pub type UserId = Uuid;
pub type TeamId = Uuid;
pub type TeamRoleId = i64;
pub type RefreshTokenId = Uuid;
