use validator::ValidationErrors;

#[rustfmt::skip]
#[allow(unused_variables)]
pub trait EndpointJsonBodyData {

    /// Runs predefined validations. <br/>
    /// Returns true if all validations are passed, otherwise returns false.
    fn validate_data(&mut self) -> Result<(), ValidationErrors> { todo!() }
}
