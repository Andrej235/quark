use sea_orm::DatabaseConnection;

#[rustfmt::skip]
#[allow(unused_variables)]
pub trait EndpointJsonBodyData {

    /// Runs predefined validations. <br/>
    /// Returns true if all validations are passed, otherwise returns false.
    fn validate(&mut self) -> bool { todo!() }

    /// Same as **validate(&mut self)** but with database access. <br/>
    /// Returns true if all validations are passed, otherwise returns false.
    fn validate_with_db(&mut self, db: &DatabaseConnection) -> bool { todo!() }
}
