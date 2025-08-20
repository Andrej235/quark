import sendApiRequest from "@/api-dsl/send-api-request";
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
  const setTeam = useTeamStore((x) => x.setActiveTeam);
  const team = useTeamStore((x) => x.activeTeam);
  const teamId = team?.id;
  const defaultRoleId = team?.defaultRoleId;

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

  async function handleDeleteRole(roleId: string) {
    if (!teamId) return;

    const { isOk } = await sendApiRequest(
      "/team-roles/{teamId}/{roleId}",
      {
        method: "delete",
        parameters: {
          teamId,
          roleId,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Deleting role, please wait...",
          success: "Role deleted successfully!",
          error: (x) => x.message || "Failed to delete role, please try again",
        },
      },
    );

    if (!isOk) return;

    await queryClient.setQueryData(
      ["team-roles", teamId],
      roles.data?.filter((role) => role.id !== roleId),
    );
    setDeletingRole(null);
  }

  async function handleCreateRole(role: {
    name: string;
    description: string;
    permissions: TeamPermission;
  }) {
    if (!teamId) return;

    const { isOk, response } = await sendApiRequest(
      "/team-roles",
      {
        method: "post",
        payload: {
          teamId,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Creating role, please wait...",
          success: "Role created successfully!",
          error: (x) => x.message || "Failed to create role, please try again",
        },
      },
    );

    if (!isOk || !response) return;

    await queryClient.setQueryData(
      ["team-roles", teamId],
      [...roles.data!, response],
    );
    setIsCreateDialogOpen(false);
  }

  async function handleEditRole(role: {
    name: string;
    description: string;
    permissions: TeamPermission;
  }) {
    if (!teamId || !editingRole) return;

    const { isOk } = await sendApiRequest(
      "/team-roles",
      {
        method: "put",
        payload: {
          teamId,
          id: editingRole.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Saving role, please wait...",
          success: "Role edited successfully!",
          error: (x) => x.message || "Failed to edit role, please try again",
        },
      },
    );

    if (!isOk) return;

    await queryClient.setQueryData(
      ["team-roles", teamId],
      roles.data?.map((r) =>
        r.id === editingRole.id ? { ...editingRole, ...role } : r,
      ) ?? [],
    );
    setEditingRole(null);
  }

  async function setAsDefaultRole(role: { id: string }) {
    if (!teamId) return;

    const { isOk } = await sendApiRequest(
      "/teams/{teamId}/default-role",
      {
        method: "patch",
        parameters: {
          teamId,
        },
        payload: {
          roleId: role.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Setting default role, please wait...",
          success: "Default role set successfully!",
          error: (x) =>
            x.message || "Failed to set default role, please try again",
        },
      },
    );

    if (!isOk) return;

    setTeam({
      ...team,
      defaultRoleId: role.id,
    });
  }

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
              isDefault={role.id === defaultRoleId}
              setAsDefault={setAsDefaultRole}
              onEdit={(role) => setEditingRole(role)}
              onDelete={(role) => setDeletingRole(role)}
            />
          ))}
        </div>
      </CardContent>

      <RoleDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRole}
        title="Create New Role"
        description="Define a new role with specific permissions for your team members."
      />

      <RoleDialog
        isOpen={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        onSubmit={handleEditRole}
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
