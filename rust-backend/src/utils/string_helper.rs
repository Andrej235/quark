// ------------------------------------------------------------------------------------
// STRUCT
// ------------------------------------------------------------------------------------
pub struct StringHelper {}

// ------------------------------------------------------------------------------------
// IMPLEMENTATION
// ------------------------------------------------------------------------------------
#[rustfmt::skip]
impl StringHelper {

    /// Checks if string is not empty <br/>
    /// NOTE: Doesn't trim string before checking <br/>
    /// Returns **true** if string is not empty, otherwise **false**
    pub fn is_some_and_not_empty<S>(string: Option<S>) -> bool 
    where S: AsRef<str> {
        if let Some(string) = string {
            if string.as_ref().is_empty() {
                return false;
            }
        }

        return true;
    }

    /// Trims string if it is not None
    pub fn trim_string_if_some(stirng: &mut Option<String>) {
        if let Some(string) = stirng {
            let trimmed = string.trim().to_string();
            *string = trimmed;
        }
    }

    /// Checks if all strings are not empty <br/>
    /// NOTE: Doesn't trim strings before checking <br/>
    /// Returns **true** if all strings are not empty, otherwise **false**
    pub fn are_all_strings_full<A, I>(strings: A) -> bool
    where A: IntoIterator<Item = I>, I: AsRef<str> {
        for string in strings {
            if string.as_ref().is_empty() {
                return false;
            }
        }

        return true;
    }

    /// Trims all strings <br/>
    pub fn trim_all_strings(strings: &mut Vec<&mut String>) {
        for s in strings {
            let trimmed = s.trim().to_string();
            **s = trimmed;
        }
    }    
}
