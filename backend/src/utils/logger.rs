use std::error::Error;
use tracing::error;

pub struct Logger;

#[rustfmt::skip]
impl Logger {
    
    /// Logs error
    pub fn error(message: &'static str) {
        error!("{}", message);
    }

    pub fn error_detailed(message: &'static str, error: Box<dyn Error>) {
        error!("Message: {}, Error: {:?}", message, error);
    }
}
