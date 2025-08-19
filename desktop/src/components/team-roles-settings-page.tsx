import { TeamPermission } from "@/lib/permissions/team-permission";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteRoleDialog } from "./delete-role-dialog";
import RoleCard from "./role-card";
import { RoleDialog } from "./role-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: TeamPermission;
  userCount: number;
  isSystem?: boolean;
};

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: TeamPermission.All,
    userCount: 2,
    isSystem: true,
  },
  {
    id: "2",
    name: "Editor",
    description: "Can create and edit content",
    permissions:
      TeamPermission.ViewAll |
      TeamPermission.ManageProspects |
      TeamPermission.ManageEmails |
      TeamPermission.ManageUsers,
    userCount: 12,
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to content and users",
    permissions: TeamPermission.ViewAll,
    userCount: 28,
  },
];

export default function TeamRolesSettings() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
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

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              permissions={role.permissions}
              onEdit={(role) => setEditingRole(role)}
              onDelete={(role) => setDeletingRole(role)}
            />
          ))}
        </div>
      </CardContent>

      <RoleDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={(x) => console.log(x)}
        title="Create New Role"
        description="Define a new role with specific permissions for your team members."
      />

      <RoleDialog
        isOpen={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        onSubmit={(x) => console.log(x)}
        initialData={editingRole || undefined}
        title="Edit Role"
        description="Modify the role name, description, and permissions."
      />

      <DeleteRoleDialog
        isOpen={deletingRole !== null}
        onOpenChange={(open) => setDeletingRole(open ? deletingRole : null)}
        onConfirm={() => handleDeleteRole(deletingRole!.id)}
        role={deletingRole}
      />
    </Card>
  );
}
