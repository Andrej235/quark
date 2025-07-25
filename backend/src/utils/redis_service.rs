// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use bb8::{Pool, PooledConnection};
use bb8_redis::RedisConnectionManager;
use redis::{AsyncCommands, AsyncIter, FromRedisValue, RedisError, ToRedisArgs};

// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
#[derive(Debug)]
pub struct RedisService {
    pub pool: Pool<RedisConnectionManager>,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl<'a> RedisService {

    pub fn set_pool(pool: Pool<RedisConnectionManager>) -> Self {
        RedisService {
            pool,
        }
    }

    pub fn create_key(prefix: &'static str, unique_identifier: &str) -> String {
        return format!("{}:{}", prefix, unique_identifier);
    }

    pub async fn get_connection(&self) -> Result<PooledConnection<'_, RedisConnectionManager>, RedisError> {
        let redis_connection = self.pool.get().await.map_err(|e| {
            RedisError::from((redis::ErrorKind::IoError, "Redis Pool Error", format!("{}", e)))
        })?;

        return Ok(redis_connection);
    }


    pub async fn save_value<K, V, RV>(&self, key: K, value: V, exp_time: u64)
        -> Result<(), RedisError>
    where
        K: ToRedisArgs + Send + Sync + 'a,
        V: ToRedisArgs + Send + Sync + 'a,
        RV: FromRedisValue,
    {
        let mut redis_connection: PooledConnection<'_, RedisConnectionManager> = self.get_connection()
            .await
            .map_err(|e| { e })?;

        redis_connection.set_ex::<K, V, RV>(key, value, exp_time).await?;

        return Ok(());
    }


    pub async fn get_value<K, RV>(&self, key: K) 
        -> Result<RV, RedisError>
    where
        K: ToRedisArgs + Send + Sync + 'a,
        RV: FromRedisValue,
    { 
        let mut redis_connection: PooledConnection<'_, RedisConnectionManager> = self.get_connection()
            .await
            .map_err(|e| { e })?;

        let result: RV = redis_connection.get::<K, RV>(key).await?;

        return Ok(result);
    }


    pub async fn delete_value<K, RV>(&self, key: K) 
        -> Result<RV, RedisError>
    where
        K: ToRedisArgs + Send + Sync + 'a,
        RV: FromRedisValue,
    { 
        let mut redis_connection: PooledConnection<'_, RedisConnectionManager> = self.get_connection()
            .await
            .map_err(|e| { e }).unwrap();
        
        let result: RV = redis_connection.del::<K, RV>(key).await?;

        return Ok(result);
    }


    pub async fn find_matching_keys<P>(&self, pattern: P)
        -> Result<Vec<String>, RedisError>
    where
        P: ToRedisArgs,
    {

        let mut redis_connection: PooledConnection<'_, RedisConnectionManager> = self.get_connection()
            .await
            .map_err(|e| { e }).unwrap();

        // Itterate over all keys and get thoes that match the pattern
        let mut itter: AsyncIter<String> = redis_connection.scan_match(pattern).await?;

        let mut result: Vec<String> = vec![];

        while let Some(key) = itter.next_item().await {
            result.push(key?);
        }

        return Ok(result);
    }

    pub async fn delete_matching_keys<P>(&self, pattern: P)
        -> Result<(), RedisError>
    where
        P: ToRedisArgs,
    {

        let mut redis_connection: PooledConnection<'_, RedisConnectionManager> = self.get_connection()
            .await
            .map_err(|e| { e }).unwrap();

        // Delete matching keys
        let keys: Vec<String> = self.find_matching_keys(pattern).await?;
        redis_connection.del::<_, ()>(keys).await?;

        return Ok(());
    }
}
