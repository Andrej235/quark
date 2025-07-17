use serde::Serialize;
use utoipa::ToSchema;

#[derive(Debug, PartialEq, Serialize, ToSchema)]
pub struct RouteError {
    pub message: String,
}

#[rustfmt::skip]
impl RouteError {    
    pub fn new(message: String) -> Self{
        RouteError { message: message }
    }
}
