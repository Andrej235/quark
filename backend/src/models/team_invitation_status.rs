use bitflags::bitflags;

bitflags! {
    #[derive(Default, PartialEq, Eq, Clone, Copy)]
    pub struct TeamInvitationStatus: i32 {
        const SENT = 1<<0;
        const ACCEPTED = 1<<1;
        const DECLINED = 1<<2;
    }
}