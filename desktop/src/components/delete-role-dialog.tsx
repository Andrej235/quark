import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users } from "lucide-react";
import React from "react";
import { Role } from "./team-roles-settings";

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  role: Role | null;
}

export const DeleteRoleDialog: React.FC<DeleteRoleDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  role,
}) => {
  if (!role) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 rounded-lg p-2">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">
                Delete Role
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-4 text-base">
            Are you sure you want to delete the role{" "}
            <span className="text-foreground font-semibold">
              &quot;{role.name}&quot;
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Role Info */}
          <div className="bg-muted space-y-2 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Role Name:</span>
              <span>{role.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Users Assigned:</span>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{role.userCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Permissions:</span>
              <Badge variant="outline">{role.permissions.length}</Badge>
            </div>
          </div>

          {/* Warning */}
          {role.userCount > 0 && (
            <div className="bg-destructive/5 border-destructive/20 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-destructive font-medium">Warning</p>
                  <p className="text-muted-foreground text-sm">
                    This role is currently assigned to {role.userCount} user
                    {role.userCount !== 1 ? "s" : ""}. Deleting this role will
                    remove all permissions from these users. Make sure to assign
                    them to another role first.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Delete Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
