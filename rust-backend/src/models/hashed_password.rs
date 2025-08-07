pub struct HashedPassword {
    pub salt: String,
    pub hash: String,
}

impl HashedPassword {
    pub fn new(salt: String, hash: String) -> HashedPassword {
        Self {
            salt,
            hash,
        }
    }
}
