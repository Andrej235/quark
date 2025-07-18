import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteRoleDialog } from "./delete-role-dialog";
import { RoleCard } from "./role-card";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export type Permission = {
  id: string;
  enumValue: number;
  name: string;
  description: string;
  category: string;
  requires?: string[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem?: boolean;
};

const AVAILABLE_PERMISSIONS: Permission[] = [
  // User Management
  {
    id: "users.view",
    enumValue: 1 << 0,
    name: "View Users",
    description: "Can view info about all team members",
    category: "User Management",
  },
  {
    id: "users.invite",
    enumValue: 1 << 1,
    name: "Invite Users",
    description: "Can invite new users to the team",
    category: "User Management",
  },
  {
    id: "users.edit",
    enumValue: 1 << 2,
    name: "Edit Users",
    description: "Can assign roles to users",
    category: "User Management",
    requires: ["users.view"],
  },
  {
    id: "users.remove",
    enumValue: 1 << 3,
    name: "Remove Users",
    description: "Can remove users from the team",
    category: "User Management",
    requires: ["users.view"],
  },

  // Prospect Management
  {
    id: "prospects.view",
    enumValue: 1 << 4,
    name: "View Prospects",
    description: "Can view all prospect data",
    category: "Content Management",
  },
  {
    id: "prospects.create",
    enumValue: 1 << 5,
    name: "Create Prospects",
    description: "Can create new prospects",
    category: "Content Management",
  },
  {
    id: "prospects.edit",
    enumValue: 1 << 6,
    name: "Edit Prospects",
    description: "Can modify existing prospects' data",
    category: "Content Management",
    requires: ["prospects.view"],
  },
  {
    id: "prospects.delete",
    enumValue: 1 << 7,
    name: "Delete Prospects",
    description: "Can remove prospects from the system",
    category: "Content Management",
    requires: ["prospects.view"],
  },

  // Email Management
  {
    id: "emails.view",
    enumValue: 1 << 8,
    name: "View Emails",
    description: "Can view all emails",
    category: "Content Management",
  },
  {
    id: "emails.create",
    enumValue: 1 << 9,
    name: "Create Emails",
    description: "Can create new emails",
    category: "Content Management",
  },
  {
    id: "emails.edit",
    enumValue: 1 << 10,
    name: "Edit Emails",
    description: "Can modify existing emails",
    category: "Content Management",
    requires: ["emails.view"],
  },
  {
    id: "emails.delete",
    enumValue: 1 << 11,
    name: "Delete Emails",
    description: "Can remove emails from the system",
    category: "Content Management",
    requires: ["emails.view"],
  },
  {
    id: "emails.send",
    enumValue: 1 << 12,
    name: "Send Emails",
    description: "Can send emails to prospects",
    category: "Content Management",
    requires: ["emails.edit"],
  },
  {
    id: "emails.schedule",
    enumValue: 1 << 13,
    name: "Schedule Emails",
    description: "Can schedule emails to be sent in the future",
    category: "Content Management",
    requires: ["emails.send", "emails.view"],
  },

  // System Administration
  {
    id: "admin.settings",
    enumValue: 1 << 14,
    name: "Team Settings",
    description: "Can modify team-wide settings",
    category: "System Administration",
  },
  {
    id: "admin.roles",
    enumValue: 1 << 15,
    name: "Manage Roles",
    description: "Can create and modify user roles",
    category: "System Administration",
  },
  {
    id: "admin.billing",
    enumValue: 1 << 16,
    name: "View Billing",
    description: "Can view billing information and past invoices",
    category: "System Administration",
  },
  {
    id: "admin.delete",
    enumValue: 1 << 17,
    name: "Delete Team",
    description: "Can delete the entire team",
    category: "System Administration",
  },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
    userCount: 2,
    isSystem: true,
  },
  {
    id: "2",
    name: "Editor",
    description: "Can create and edit content",
    permissions: [
      "emails.view",
      "emails.create",
      "emails.edit",
      "emails.delete",
      "emails.send",
      "emails.schedule",
      "prospects.view",
      "prospects.create",
      "prospects.edit",
      "prospects.delete",
      "users.view",
    ],
    userCount: 12,
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to content and users",
    permissions: ["users.view", "prospects.view", "emails.view"],
    userCount: 28,
  },
];

export default function TeamRolesSettings() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
    setDeletingRole(null);
  };

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Team Roles</CardTitle>
            <CardDescription>
              Create and manage roles to control what team members can access
            </CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>

            <DialogContent>Test</DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              permissions={AVAILABLE_PERMISSIONS}
              onDelete={(role) => setDeletingRole(role)}
            />
          ))}
        </div>
      </CardContent>

      <DeleteRoleDialog
        isOpen={deletingRole !== null}
        onOpenChange={(open) => setDeletingRole(open ? deletingRole : null)}
        onConfirm={() => handleDeleteRole(deletingRole!.id)}
        role={deletingRole}
      />
    </Card>
  );
}
