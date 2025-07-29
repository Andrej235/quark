use redis::RedisError;
use uuid::Uuid;

use crate::utils::{
    constants::{REDIS_USER_TEAM_PERMISSIONS_EXPIRATION, USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX},
    redis_service::RedisService,
};

pub struct UserTeamPermissionsCache;

#[rustfmt::skip]
impl UserTeamPermissionsCache {

    pub async fn cache(
        redis: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
        permissions: i32
    ) -> Result<(), RedisError> {
        
        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        let _: () = redis.save_value::<String, i32, ()>(redis_key, permissions, REDIS_USER_TEAM_PERMISSIONS_EXPIRATION).await?;
        return Ok(());
    }
    
    pub async fn get(
        redis: &RedisService,
        user_id: Uuid,
        team_id: Uuid
    ) -> Result<Option<i32>, RedisError> {
        
        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        return redis.get_value(redis_key).await;
    }

    pub async fn delete(
        redis: &RedisService,
        user_id: Uuid,
        team_id: Uuid,
    ) -> Result<(), RedisError> {
        
        let redis_key: String = RedisService::create_key(USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, format!("{}:{}", user_id, team_id).as_str());
        let _: () = redis.delete_value::<String, ()>(redis_key).await?;
        return Ok(());
    }

    pub async fn delete_for_all_users(
        redis: &RedisService,
        team_id: Uuid,
        user_ids: Vec<Uuid>
    ) -> Result<(), RedisError> {

        for user_id in user_ids {
            let redis_pattern: String = format!("{}:{}:{}", USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, user_id, team_id);
            let _: () = redis.delete_matching_keys(redis_pattern).await?;
        }

        return Ok(());
    }

    pub async fn wipe(
        redis: &RedisService,
        team_id: Uuid
    ) -> Result<(), RedisError> {

        let redis_pattern: String = format!("{}:*:{}", USER_TEAM_PERMISSIONS_REDIS_KEY_PREFIX, team_id);
        let _: () = redis.delete_matching_keys(redis_pattern).await?;
        return Ok(());
    }
}
