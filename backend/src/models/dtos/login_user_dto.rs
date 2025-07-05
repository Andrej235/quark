use serde::{Deserialize, Serialize};

#[rustfmt::skip]
#[derive(Debug, Serialize, Deserialize)]
pub struct LoginUserDTO {
    pub email: String,
    pub password: String,
}

#[rustfmt::skip]
impl LoginUserDTO {
    
    /*
        If any new strings are added to this struct make sure to add new check in function below
    */
    /// Makes sure that all strings in struct are not empty <br/>
    /// Returns true if all strings are not empty, otherwise returns false
    pub fn check_if_all_strings_are_not_empty(&self) -> bool {
        
        if  self.email.is_empty()       == true ||
            self.password.is_empty()    == true
        {
            return  false;
        }        

        return true;
    }

    /*
        If any new strings need to be trimmed in this struct (on function call) add them in function below
    */
    /// Removes empty spaces from start and end of strings
    pub fn trim_strings(&mut self) {
        self.email      = self.email.trim().to_string();
        self.password   = self.password.trim().to_string();
    }
}
