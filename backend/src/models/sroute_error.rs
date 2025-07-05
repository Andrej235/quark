use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
/// This is same as normal RouteError but its more optimized and should be used when possible
pub struct SRouteError {
    pub message: &'static str,
}
