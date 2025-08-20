export enum TeamPermission {
  None = 0,
  CanViewUsers = 1 << 0,
  CanInviteUsers = 1 << 1,
  CanEditUsers = 1 << 2,
  CanRemoveUsers = 1 << 3,
  CanViewProspects = 1 << 4,
  CanCreateProspects = 1 << 5,
  CanEditProspects = 1 << 6,
  CanArchiveProspects = 1 << 7,
  CanViewEmails = 1 << 8,
  CanCreateEmails = 1 << 9,
  CanEditEmails = 1 << 10,
  CanDeleteEmails = 1 << 11,
  CanSendEmails = 1 << 12,
  CanScheduleEmails = 1 << 13,
  CanEditSettings = 1 << 14,
  CanEditRoles = 1 << 15,
  CanViewBilling = 1 << 16,
  CanDeleteTeam = 1 << 17,
  CanEditProspectLayout = 1 << 18,
  All = (1 << 19) - 1,
  ViewAll = CanViewUsers | CanViewProspects | CanViewEmails,
  ManageUsers = CanViewUsers | CanInviteUsers | CanEditUsers | CanRemoveUsers,
  ManageProspects = CanViewProspects |
    CanCreateProspects |
    CanEditProspects |
    CanArchiveProspects,
  ManageEmails = CanViewEmails |
    CanCreateEmails |
    CanEditEmails |
    CanDeleteEmails |
    CanSendEmails |
    CanScheduleEmails,
}
