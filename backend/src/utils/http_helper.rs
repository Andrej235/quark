// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use crate::enums::type_of_request::TypeOfRequest;
use crate::models::permission::Permission;
use crate::models::sroute_error::SRouteError;
use crate::{RESEND_EMAIL, RESEND_INSTANCE};
use actix_web::HttpResponse;
use base64::Engine;
use rand::distr::Alphanumeric;
use rand::Rng;
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::Resend;
use sea_orm::error::DbErr;
use sea_orm::{DatabaseConnection, DatabaseTransaction, TransactionTrait};
use std::error::Error;
use tracing::error;

pub struct HttpHelper;

#[rustfmt::skip]
impl HttpHelper {

    // ************************************************************************************
    //
    // HELPER FUNCTIONS
    //
    // ************************************************************************************
    pub fn endpoint_internal_server_error(
        endpoint_path: (&'static str, TypeOfRequest),
        what_failed: &'static str,
        error: Box<dyn Error>
    ) -> HttpResponse {
        error!("[FAILED] [{:?}][{}] Reason: {}, Error: {:?}", endpoint_path.1, endpoint_path.0, what_failed, error);
        return HttpResponse::InternalServerError().finish();
    }
    
    /// Creates random 6 character long string <br/>
    /// String contains letters and number <br/>
    /// Returns **random string**
    pub fn generate_random_email_verification_code() -> String {
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect();
    
        random_string.to_uppercase()
    }

    /// Creates random 8 character long string <br/>
    /// String contains letters and number <br/>
    /// Returns **random string**
    pub fn generate_team_invitation_code() -> String {
        let random_string: String = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(8)
            .map(char::from)
            .collect();
    
        random_string.to_uppercase()
    }
    
    // Sends email with provided subject and html content
    /// Returns **Ok** or **ResendError**
    pub async fn send_email(
        reciever_email: &str, 
        email_subject: &'static str,
        html: &str
    ) -> Result<(), resend_rs::Error> {

        let resend_instance: &Resend = RESEND_INSTANCE.get().unwrap();

        // Prep email data
        let from: String = format!("Quark <{}>", RESEND_EMAIL.get().unwrap());
        let to: [&str; 1] = [reciever_email];

        // Generate email
        let email: CreateEmailBaseOptions = CreateEmailBaseOptions::new(&from, to, email_subject)
            .with_html(html);

        // Send email
        match resend_instance.emails.send(email).await {
            Ok(_) => Ok(()),
            Err(err) => return Err(err),
        }
    }

    /// Begins transaction <br/>
    /// Returns: InternalServerError transaction creation fails
    /// Returns: DatabaseTransaction
    pub async fn begin_transaction(
        endpoint_path: (&'static str, TypeOfRequest),
        db: &DatabaseConnection
    ) -> Result<DatabaseTransaction, HttpResponse> {
        match db.begin().await {
            Ok(transaction) => Ok(transaction),
            Err(err) => Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Creating transaction", Box::new(err))),
        }
    }

    /// Commits transaction <br/>
    /// Returns: InternalServerError transaction commit or rollback fails <br/>
    /// Returns: Ok 
    pub async fn commit_transaction(
        endpoint_path: (&'static str, TypeOfRequest),
        transaction: DatabaseTransaction,
        transaction_result: Result<(), DbErr>
    ) -> Result<(), HttpResponse> {
        match transaction_result {
            Ok(_) => {
                if let Err(e) = transaction.commit().await {
                    return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Committing transaction", Box::new(e)));
                }

                return Ok(());
            }
            Err(err) => {
                if let Err(e) = transaction.rollback().await {
                    return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Rolling back transaction", Box::new(e)));
                }

                return Err(HttpHelper::endpoint_internal_server_error(endpoint_path, "Creating team", Box::new(err)));
            }
        }
    }

    /// Converts image to base64 string
    pub fn convert_image_to_base64(image: Option<Vec<u8>>) -> Option<String> {
        match image {
            None => None,
            Some(image_bytes) => {
                Some(base64::engine::general_purpose::STANDARD.encode(&image_bytes))
            }
        }
    }

    /// Checks if all required permissions are present
    /// Returns (), otherwise status forbidden
    pub fn check_permissions(
        permissions: i32,
        required_permissions: Vec<Permission>
    ) -> Result<(), HttpResponse> {
    
        let perm = Permission::from_bits(permissions)
            .ok_or_else(|| HttpResponse::Forbidden().json(SRouteError { message: "Invalid permissions" }))?;
    
        let required = required_permissions.into_iter().fold(Permission::empty(), |acc, p| acc | p);
    
        if (perm & required) == required {
            Ok(())
        } else {
            Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }))
        }
    }
    
    /// Checks if required permission is present
    /// Returns (), otherwise status forbidden
    pub fn check_permission(
        permissions: i32,
        required_permission: Permission
    ) -> Result<(), HttpResponse> {
    
        let perm: Permission = match Permission::from_bits(permissions) {
            Some(perm) => perm,
            None => return Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }))
        };
    
        if perm.contains(required_permission) == false {
            return Err(HttpResponse::Forbidden().json(SRouteError { message: "Permission too low" }));
        }
    
        return Ok(());
    }
}
