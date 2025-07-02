use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[rustfmt::skip]
pub struct CreateUser {
    pub username:   String,
    pub name:       String,
    pub last_name:  String,
    pub email:      String,
}
