// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::entity::users::{Entity as UserEntity, Model as User};
use crate::{models::user_claims::UserClaims, JWT_SECRET};
use actix_web::{dev::Payload, Error as ActixError, FromRequest, HttpRequest};
use futures::future::LocalBoxFuture;
use jsonwebtoken::{decode, errors::Error as JWTTokenError, DecodingKey, TokenData, Validation};
use sea_orm::{DatabaseConnection, EntityTrait};
use tracing::error;

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
pub struct AdvancedAuthenticatedUser {
    pub user: User,
    pub claims: UserClaims,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl FromRequest for AdvancedAuthenticatedUser {
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


            // Get user
            let user: User = match UserEntity::find_by_id(claims.user_id).one(db.get_ref()).await {
                Ok(Some(user_model)) => user_model,
                Ok(None) => { return Err(actix_web::error::ErrorUnauthorized("Unauthorized")); },
                Err(err) => {
                    error!("[FAILED] [{}] Reason: {}, Error: {:?}", "Pre verficaition", "Finding user by id", err);
                    return Err(actix_web::error::ErrorInternalServerError(""));
                }
            };

                
            Ok(AdvancedAuthenticatedUser {
                user: user,
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
