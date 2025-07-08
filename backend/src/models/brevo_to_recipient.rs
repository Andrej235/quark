use serde::Serialize;

#[derive(Debug, Serialize)]
#[rustfmt::skip]
pub struct BrevoToRecipient {
    pub email:  String,
    pub name:   String,
}
