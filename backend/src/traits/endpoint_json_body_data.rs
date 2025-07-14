// ------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------
use serde_json::{Number, Value};
use std::fmt::Debug;
use validator::{ValidationError, ValidationErrors};

// ------------------------------------------------------------------------------------
// TRAIT
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
#[allow(unused_variables)]
pub trait EndpointJsonBodyData {

    /// Runs predefined validations. <br/>
    /// Returns true if all validations are passed, otherwise returns false.
    fn validate_data(&mut self) -> Result<(), ValidationErrors>;

    /// Enforces length range for optional string.
    /// Returns Ok() if validation is passed, otherwise returns ValidationErrors
    fn enforce_length_range_optional_string(
        field_name: &'static str,
        string: &Option<String>, 
        min: Option<isize>, 
        max: Option<isize>
    ) -> Result<(), ValidationErrors> {

        fn create_validation_error_object(
            field_name: &'static str,
            value: String,
            min_value: Option<isize>,
            max_value: Option<isize>
        ) -> ValidationErrors {
            let mut validation_error: ValidationError = ValidationError::new("length");
            validation_error.add_param("value".into(), &Value::String(String::from(value)));
            
            if min_value.is_some() {
                validation_error.add_param("min".into(), &Value::Number(Number::from(min_value.unwrap())));
            }

            if max_value.is_some() {
                validation_error.add_param("max".into(), &Value::Number(Number::from(max_value.unwrap())));
            }            
                    
            let mut validation_errors: ValidationErrors = ValidationErrors::new();
            validation_errors.add(field_name, validation_error);
                    
            return validation_errors;
        }

        // If min and max are none its basically a no-op
        if min.is_none() && max.is_none() { return Ok(()); }

        if let Some(inner_string) = string {

            let inner_string_length = inner_string.len() as isize;

            // Case 1: min only 
            if min.is_some() && max.is_none() {

                let min_value: isize = min.unwrap();
                if inner_string_length < min_value {
                    return Err(create_validation_error_object(
                        field_name,
                        String::from(inner_string),
                        Some(min_value),
                        None
                    ));
                }
            }
            // Case 2: max only
            else if min.is_none() && max.is_some() {
                
                let max_value: isize = max.unwrap();
                if inner_string_length > max_value {
                    return Err(create_validation_error_object(
                        field_name,
                        String::from(inner_string),
                        None,
                        Some(max_value)
                    ));
                }
            }
            // Case 3: min and max
            else {

                let min_value: isize = min.unwrap();
                let max_value: isize = max.unwrap();
                if inner_string_length < min_value || inner_string_length > max_value {
                    return Err(create_validation_error_object(
                        field_name,
                        String::from(inner_string),
                        Some(min_value),
                        Some(max_value)
                    ));
                }
            }
        }

        return Ok(());
    }
}
