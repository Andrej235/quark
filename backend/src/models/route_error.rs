#[derive(Debug, PartialEq)]
pub struct RouteError {
    message: String,
}

#[rustfmt::skip]
impl RouteError {    
    pub fn new(message: String) -> Self{
        RouteError { message: message }
    }
}
