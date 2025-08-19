import { TeamPermission } from "./team-permission";

export type Permission = {
  id: string;
  enumValue: TeamPermission;
  name: string;
  description: string;
  category: string;
  requires?: string[];
};

export const detailedTeamPermissions: Permission[] = [
  // User Management
  {
    id: "users.view",
    enumValue: TeamPermission.CanViewUsers,
    name: "View Users",
    description: "Can view info about all team members",
    category: "User Management",
  },
  {
    id: "users.invite",
    enumValue: TeamPermission.CanInviteUsers,
    name: "Invite Users",
    description: "Can invite new users to the team",
    category: "User Management",
  },
  {
    id: "users.edit",
    enumValue: TeamPermission.CanEditUsers,
    name: "Edit Users",
    description: "Can assign roles to users",
    category: "User Management",
    requires: ["users.view"],
  },
  {
    id: "users.remove",
    enumValue: TeamPermission.CanRemoveUsers,
    name: "Remove Users",
    description: "Can remove users from the team",
    category: "User Management",
    requires: ["users.view"],
  },

  // Prospect Management
  {
    id: "prospects.view",
    enumValue: TeamPermission.CanViewProspects,
    name: "View Prospects",
    description: "Can view all prospect data",
    category: "Prospects Management",
  },
  {
    id: "prospects.create",
    enumValue: TeamPermission.CanCreateProspects,
    name: "Create Prospects",
    description: "Can create new prospects",
    category: "Prospects Management",
  },
  {
    id: "prospects.archive",
    enumValue: TeamPermission.CanArchiveProspects,
    name: "Archive Prospects",
    description: "Can archive prospects",
    category: "Prospects Management",
  },
  {
    id: "prospects.edit",
    enumValue: TeamPermission.CanEditProspects,
    name: "Edit Prospects",
    description: "Can modify existing prospects' data",
    category: "Prospects Management",
    requires: ["prospects.view"],
  },
  {
    id: "prospects.layout",
    enumValue: TeamPermission.CanEditProspectLayout,
    name: "Edit Prospect Layout",
    description: "Can modify the layout of prospects",
    category: "Prospects Management",
    requires: ["prospects.view"],
  },

  // Email Management
  {
    id: "emails.view",
    enumValue: TeamPermission.CanViewEmails,
    name: "View Emails",
    description: "Can view all emails",
    category: "Email Management",
  },
  {
    id: "emails.create",
    enumValue: TeamPermission.CanCreateEmails,
    name: "Create Emails",
    description: "Can create new emails",
    category: "Email Management",
  },
  {
    id: "emails.edit",
    enumValue: TeamPermission.CanEditEmails,
    name: "Edit Emails",
    description: "Can modify existing emails",
    category: "Email Management",
    requires: ["emails.view"],
  },
  {
    id: "emails.delete",
    enumValue: TeamPermission.CanDeleteEmails,
    name: "Delete Emails",
    description: "Can remove emails from the system",
    category: "Email Management",
    requires: ["emails.view"],
  },
  {
    id: "emails.send",
    enumValue: TeamPermission.CanSendEmails,
    name: "Send Emails",
    description: "Can send emails to prospects",
    category: "Email Management",
    requires: ["emails.edit"],
  },
  {
    id: "emails.schedule",
    enumValue: TeamPermission.CanScheduleEmails,
    name: "Schedule Emails",
    description: "Can schedule emails to be sent in the future",
    category: "Email Management",
    requires: ["emails.send", "emails.view"],
  },

  // Team Administration
  {
    id: "admin.settings",
    enumValue: TeamPermission.CanEditSettings,
    name: "Team Settings",
    description: "Can modify team-wide settings",
    category: "Team Administration",
  },
  {
    id: "admin.roles",
    enumValue: TeamPermission.CanEditRoles,
    name: "Manage Roles",
    description: "Can create and modify user roles",
    category: "Team Administration",
  },
  {
    id: "admin.billing",
    enumValue: TeamPermission.CanViewBilling,
    name: "View Billing",
    description: "Can view billing information and past invoices",
    category: "Team Administration",
  },
  {
    id: "admin.delete",
    enumValue: TeamPermission.CanDeleteTeam,
    name: "Delete Team",
    description: "Can delete the entire team",
    category: "Team Administration",
  },
];
