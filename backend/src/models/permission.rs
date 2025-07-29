use bitflags::bitflags;

bitflags! {
    #[derive(Default, PartialEq, Eq, Clone, Copy)]
    pub struct Permission: i32 {
        const CAN_VIEW_USERS = 1<<0;
        const CAN_INVITE_USERS = 1<<1;
        const CAN_EDIT_USERS = 1<<2;
        const CAN_REMOVE_USERS = 1<<3;
        const CAN_VIEW_PROSPECTS = 1<<4;
        const CAN_CREATE_PROSPECTS = 1<<5;
        const CAN_EDIT_PROSPECTS = 1<<6;
        const CAN_DELETE_PROSPECTS = 1<<7;
        const CAN_VIEW_EMAILS = 1<<8;
        const CAN_CREATE_EMAILS = 1<<9;
        const CAN_EDIT_EMAILS = 1<<10;
        const CAN_DELETE_EMAILS = 1<<11;
        const CAN_SEND_EMAILS = 1<<12;
        const CAN_SCHEDULE_EMAILS = 1<<13;
        const CAN_EDIT_SETTINGS = 1<<14;
        const CAN_EDIT_ROLES = 1<<15;
        const CAN_VIEW_BILLING = 1<<16;
        const CAN_DELETE_TEAM = 1<<17;
    }
}
