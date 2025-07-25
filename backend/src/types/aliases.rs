use crate::enums::type_of_request::TypeOfRequest;
use actix_web::HttpResponse;
use sea_orm::ConnectionTrait;
use uuid::Uuid;

pub type EndpointPathInfo = (&'static str, TypeOfRequest);
pub type DBConnection = dyn ConnectionTrait + Send + Sync;

pub type HttpResult<T> = Result<T, HttpResponse>;
pub type OptionHttpResult<T> = Result<Option<T>, HttpResponse>; 

pub type EmptyHttpResult = HttpResult<()>;

pub type PermissionBits = i32;
pub type UserId = Uuid;
pub type TeamId = Uuid;