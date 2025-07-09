/// Checks if all strings in vector are not empty <br/>
/// All strings are expected to be trimed before calling this function <br/>
/// Returns true if all strings are not empty, otherwise false
#[rustfmt::skip]
pub fn are_all_strings_full<A, I>(strings: A) -> bool
where
    A: IntoIterator<Item = I>,
    I: AsRef<str>,
{
    for string in strings {
        if string.as_ref().is_empty() {
            return false;
        }
    }

    return true;
}
