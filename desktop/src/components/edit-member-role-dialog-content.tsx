import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import useQuery from "@/api-dsl/use-query";
import { useTeamStore } from "@/stores/team-store";
import { useEffect, useState } from "react";
import RoleCard from "./role-card";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function EditMemberRoleDialogContent({
  open,
  defaultSelectedName,
  onSave,
}: {
  open: boolean;
  defaultSelectedName?: string;
  onSave: (role: Schema<"TeamRoleResponseDto">) => void;
}) {
  const team = useTeamStore((x) => x.activeTeam);
  const teamId = team?.id;
  const roles = useQuery("/team-roles/{teamId}", {
    queryKey: ["team-roles", teamId],
    parameters: {
      teamId: teamId || "",
    },
    enabled: !!teamId && open,
    retryOnMount: false,
  });

  const [selectedRole, setSelectedRole] =
    useState<Schema<"TeamRoleResponseDto"> | null>(null);

  useEffect(() => {
    if (!defaultSelectedName) return;

    const role = roles.data?.find((r) => r.name === defaultSelectedName);
    setSelectedRole(role || null);
  }, [defaultSelectedName, roles.data]);

  function handleClick() {
    if (!selectedRole || selectedRole.name === defaultSelectedName) return;
    onSave(selectedRole);
  }

  return (
    <DialogContent className="max-w-[70vw]!">
      <DialogHeader>
        <DialogTitle>Edit Member Role</DialogTitle>
        <DialogDescription>
          Change the role of this team member.
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-128 grid grid-cols-1 gap-6 overflow-auto pt-4 lg:grid-cols-2">
        {roles.data?.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            permissions={role.permissions}
            mode="select"
            isSelected={selectedRole === role}
            onSelect={() => setSelectedRole(role)}
          />
        ))}
      </div>

      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <Button onClick={handleClick}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
