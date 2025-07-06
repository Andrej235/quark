// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::{models::claims::Claims, JWT_SECRET};
use actix_web::{dev::Payload, Error as ActixError, FromRequest, HttpRequest};
use futures::future::{ready, Ready};
use jsonwebtoken::{decode, errors::Error, DecodingKey, TokenData, Validation};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
pub struct AuthenticatedUser {
    pub user_id: uuid::Uuid,
    pub claims: Claims,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
impl FromRequest for AuthenticatedUser {
    type Error = ActixError;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        use actix_web::http::header;

        let result = (|| {
            let auth_header: &str = req.headers().get(header::AUTHORIZATION)?.to_str().ok()?;
            let token: &str = auth_header.strip_prefix("Bearer ")?;
            let token_data: TokenData<Claims> = verify_jwt(token).ok()?;

            Some(AuthenticatedUser {
                user_id: token_data.claims.user_id,
                claims: token_data.claims,
            })
        })();

        match result {
            Some(user) => ready(Ok(user)),
            None => ready(Err(actix_web::error::ErrorUnauthorized("Unauthorized"))),
        }
    }
}

// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------
pub fn verify_jwt(token: &str) -> Result<TokenData<Claims>, Error> {
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &Validation::default(),
    )
}
