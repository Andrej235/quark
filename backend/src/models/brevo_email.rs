use serde::Serialize;

use crate::models::{brevo_sender::BrevoSender, brevo_to_recipient::BrevoToRecipient};

#[derive(Debug, Serialize)]
#[rustfmt::skip]
pub struct BrevoEmail<'a> {
    pub sender: BrevoSender,
    pub to:     Vec<BrevoToRecipient>,

    pub subject:        &'a str,
    pub htmlContent:   &'a str,
    pub textContent:   &'a str,
}
