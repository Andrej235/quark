use bitflags::bitflags;

bitflags! {
    #[derive(Default)]
    pub struct Permission: i32 {
        const CAN_UPDATE_TEAM        = 1 << 0;
        const CAN_DELETE_TEAM        = 1 << 1;
        const CAN_ADD_TEAM_MEMBER    = 1 << 2;
        const CAN_REMOVE_TEAM_MEMBER = 1 << 3;
        const CAN_ADD_TEAM_ROLE      = 1 << 4; 
        const CAN_REMOVE_TEAM_ROLE   = 1 << 5;
        const CAN_UPDATE_TEAM_ROLE   = 1 << 6;
    }
}