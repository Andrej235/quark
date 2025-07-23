use num_enum::{IntoPrimitive, TryFromPrimitive};

// ------------------------------------------------------------------------------------
// ENUM
// ------------------------------------------------------------------------------------
#[derive(Debug, Clone, Copy, TryFromPrimitive, IntoPrimitive)]
#[repr(i16)]
pub enum TeamInvitationStatus {
    SENT = 0,
    ACCEPTED = 1,
    DECLINED = 2,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
impl PartialEq<TeamInvitationStatus> for i16 {
    fn eq(&self, other: &TeamInvitationStatus) -> bool {
        *self == *other as i16
    }
}