use serde::Serialize;

#[derive(Debug, Serialize)]
#[rustfmt::skip]
pub struct BrevoSender {
    pub name:   String,
    pub email:  String,
}
