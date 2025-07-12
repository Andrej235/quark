// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{
    models::dtos::validatio_error_dto::ValidationErrorDTO,
    traits::endpoint_json_body_data::EndpointJsonBodyData,
};
use actix_web::{dev::Payload, web::Json, Error as ActixError, FromRequest, HttpRequest};
use futures::future::LocalBoxFuture;
use serde::de::DeserializeOwned;
use validator::Validate;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug)]
pub struct ValidatedJson<T> 
where 
    T: DeserializeOwned + Validate + EndpointJsonBodyData + 'static
{
    data: T
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl<T> FromRequest for ValidatedJson<T>
where
    T: DeserializeOwned + Validate + EndpointJsonBodyData + 'static
{
    type Error = ActixError;
    type Future = LocalBoxFuture<'static, Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {

        // Get json from request
        let fut = Json::<T>::from_request(req, payload);
        
        Box::pin(async move {
            
            // Unwrap json
            let mut json = fut.await?;

            // Run incoming data validation
            if let Err(err) = json.validate_data() {
                return Err(actix_web::error::ErrorUnprocessableEntity(ValidationErrorDTO::from(err)));
            }

            Ok(ValidatedJson { data: json.into_inner() })
        })
    }
}

#[rustfmt::skip]
impl<T> ValidatedJson<T>
where
    T: DeserializeOwned + Validate + EndpointJsonBodyData + Clone + 'static 
{
    pub fn get_data(&self) -> &T {
        return &self.data;
    }
}
