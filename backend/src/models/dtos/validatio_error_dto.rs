// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use serde::Serialize;
use serde_json::Value;
use std::{borrow::Cow, collections::HashMap};
use utoipa::ToSchema;
use validator::{ValidationErrors, ValidationErrorsKind};

// ------------------------------------------------------------------------------------
// STRUCTS
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ValidationErrorDTO<'a> {
    pub errors: Vec<ValidationErrorInfo<'a>>
}

#[rustfmt::skip]
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ValidationErrorInfo<'a> {
    pub field: Cow<'a, str>,
    pub errors_info: Vec<ErrorInfo<'a>>
}

#[rustfmt::skip]
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ErrorInfo<'a> {
    pub code: Cow<'a, str>,
    pub message: Option<Cow<'a, str>>,
    pub params: HashMap<Cow<'a, str>, Value>,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl<'a> ValidationErrorDTO<'a> {

    pub fn from(validation_error: ValidationErrors) -> Self {
        
        // Create vector that will store all validation errors
        let mut errors: Vec<ValidationErrorInfo> = vec![];

        // Map validation errors
        for error_info in validation_error.errors().iter() {
           
            // Get field name
            let field_name: &Cow<'_, str> = error_info.0;

            // Map actual field validation errors
            let mut errors_info: Vec<ErrorInfo> = vec![];

            match error_info.1 {
                ValidationErrorsKind::Field(validation_errors) => {

                    for error_info in validation_errors.iter() {
                        let error_info_obj: ErrorInfo = ErrorInfo {
                            code: error_info.code.clone(),
                            message: error_info.message.clone(),
                            params: error_info.params.clone(),
                        };

                        errors_info.push(error_info_obj);
                    }
                },
                ValidationErrorsKind::List(_) => { panic!("List validation errors are not supported") },
                ValidationErrorsKind::Struct(_) => { panic!("Struct validation errors are not supported") },
            }

            let validation_error_info: ValidationErrorInfo = ValidationErrorInfo {
                field: field_name.clone(), // This does not clone underlying data only reference
                errors_info: errors_info
            };

            errors.push(validation_error_info);
        }

        return ValidationErrorDTO { errors };
    }
}
