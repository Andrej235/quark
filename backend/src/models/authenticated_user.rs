// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::refresh_tokens::{Column as RefreshTokenColumn, Entity as RefreshTokenEntity};
use crate::{models::user_claims::UserClaims, JWT_SECRET};
use actix_web::{dev::Payload, Error as ActixError, FromRequest, HttpRequest};
use chrono::Utc;
use futures::future::LocalBoxFuture;
use jsonwebtoken::{decode, errors::Error as JWTTokenError, DecodingKey, TokenData, Validation};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
pub struct AuthenticatedUser {
    pub user_id: uuid::Uuid,
    pub claims: UserClaims,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl FromRequest for AuthenticatedUser {
    type Error = ActixError;
    type Future = LocalBoxFuture<'static, Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {

        // Get database connection
        let db= req
            .app_data::<actix_web::web::Data<DatabaseConnection>>()
            .cloned()
            .expect("DB not in app state, AuthenticatedUser");

        // Get jwt token
        let token_option = req
            .headers()
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|s| s.strip_prefix("Bearer ")
            .map(|s| s.to_string()));

        Box::pin(async move {

            // Unwrap token
            if token_option.is_none() {
                return Err(actix_web::error::ErrorUnauthorized("Unauthorized"));
            }

            let token = token_option.unwrap();


            // Verify and get claims
            let claims = verify_jwt(token.as_str())
                .map_err(|_| actix_web::error::ErrorUnauthorized("Unauthorized"))?
                .claims;


            // Verify jit
            // TODO: Remove
            _ = match RefreshTokenEntity::find()
                .filter(RefreshTokenColumn::Jit.eq(claims.jit))
                .one(db.get_ref())
                .await {
                    Ok(Some(refresh_token)) => {
                        
                        // Make sure that user id in refresh token is the same as in claims
                        // and that refresh token is not expired
                        if refresh_token.user_id != claims.user_id || 
                            refresh_token.expire_time < Utc::now().naive_utc() {
                            
                            return Err(actix_web::error::ErrorUnauthorized("Unauthorized"));
                        }
                        
                        refresh_token
                    },
                    Ok(None) => return Err(actix_web::error::ErrorUnauthorized("Unauthorized")),
                    Err(err) => return Err(actix_web::error::ErrorInternalServerError(err))
                }; 

                
            Ok(AuthenticatedUser {
                user_id: claims.user_id,
                claims: claims,
            })
        })
    }
}

// ------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------------------------
pub fn verify_jwt(token: &str) -> Result<TokenData<UserClaims>, JWTTokenError> {
    let jwt_secret: &String = JWT_SECRET.get().unwrap();

    decode::<UserClaims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &Validation::default(),
    )
}
