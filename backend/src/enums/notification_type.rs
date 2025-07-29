use num_enum::TryFromPrimitive;
use serde::Deserialize;
use serde_repr::Serialize_repr;

// ------------------------------------------------------------------------------------
// ENUM
// ------------------------------------------------------------------------------------
#[derive(Debug, Serialize_repr, Deserialize, TryFromPrimitive, Clone, Copy)]
#[repr(i32)]
pub enum NotificationType {
    TeamInvite = 0,
    TeamKick = 1,
    TeamRoleChanged = 2,
}

// ------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// ------------------------------------------------------------------------------------
impl PartialEq<NotificationType> for i16 {
    fn eq(&self, other: &NotificationType) -> bool {
        *self == *other as i16
    }
}
