import useQuery from "@/api-dsl/use-query";
import { TeamPermission } from "@/lib/permissions/team-permission";
import { useTeamStore } from "@/stores/team-store";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteRoleDialog } from "./delete-role-dialog";
import LoadingIndicator from "./loading-indicator";
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

export default function TeamRolesSettings() {
  const teamId = useTeamStore((x) => x.activeTeam?.id ?? null);

  const roles = useQuery("/team-roles/{teamId}", {
    queryKey: ["team-roles", teamId],
    parameters: {
      teamId: teamId || "",
    },
    enabled: !!teamId,
  });
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const handleDeleteRole = async (roleId: string) => {
    if (!teamId) return;

    await queryClient.setQueryData(
      ["team-roles", teamId],
      roles.data?.filter((role) => role.id !== roleId),
    );
    setDeletingRole(null);
  };

  if (roles.isLoading) {
    return <LoadingIndicator />;
  }

  if (!roles.data) return null;

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
          {roles.data.map((role) => (
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
