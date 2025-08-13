use redis::RedisError;

use crate::utils::{
    constants::{EMAIL_VERIFICATION_REDIS_KEY_PREFIX, REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION},
    redis_service::RedisService,
};

pub struct EmailVerificationCache;

#[rustfmt::skip]
impl EmailVerificationCache {

    pub async fn cache_code(
        redis_service: &RedisService,
        user_email: &str,
        email_verification_code: String
    ) -> Result<(), RedisError> {
    
        let redis_key: String = RedisService::create_key(EMAIL_VERIFICATION_REDIS_KEY_PREFIX, user_email);
        let _: () = redis_service.save_value::<String, String, ()>(redis_key, email_verification_code, REDIS_EMAIL_VERIFICATION_CODE_EXPIRATION).await?;
        return Ok(());
    }

    pub async fn verify_code(
        redis_service: &RedisService,
        user_email: &str,
        email_verification_code: &str
    ) -> Result<bool, RedisError> {

        let redis_key: String = RedisService::create_key(EMAIL_VERIFICATION_REDIS_KEY_PREFIX, user_email);
        let stored_code: Option<String> = redis_service.get_value(&redis_key).await?;

        match stored_code {
            Some(code) => {
                if code == email_verification_code {
                    // Delete the code after successful verification (optional but recommended)
                    let _: () = redis_service.delete_value(redis_key).await?;
                    return Ok(true);
                }
            },
            None => {}
        }

        return Ok(false);
    }
}
