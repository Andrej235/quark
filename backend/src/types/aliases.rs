use actix_web::HttpResponse;

use crate::enums::type_of_request::TypeOfRequest;

pub type EndpointPathInfo = (&'static str, TypeOfRequest);
pub type EmptyHttpResponse = Result<(), HttpResponse>;
pub type PermissionBits = i32;
