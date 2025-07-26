use crate::types::aliases::EndpointPathInfo;

#[cfg(debug_assertions)]
use std::time::Instant;
use tracing::warn;

#[cfg(debug_assertions)]
pub struct Timer {
    pub endpoint_path: EndpointPathInfo,
    pub timer_instance: Instant,
}

#[cfg(debug_assertions)]
impl Timer {
    pub fn new(endpoint_path: EndpointPathInfo) -> Self {
        Self {
            endpoint_path,
            timer_instance: Instant::now(),
        }
    }
}

#[cfg(debug_assertions)]
impl Drop for Timer {
    fn drop(&mut self) {
        warn!(
            "[TIME] [{:?}][{}] {} ms",
            self.endpoint_path.1,
            self.endpoint_path.0,
            self.timer_instance.elapsed().as_millis()
        );
    }
}

#[cfg(not(debug_assertions))]
pub struct Timer;
#[cfg(not(debug_assertions))]
impl Timer {
    pub fn new(_endpoint_path: EndpointPathInfo) -> Self {
        Self
    }
}
