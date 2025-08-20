import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getEnumKeys } from "@/lib/enums/get-enum-keys";
import { hasFlag } from "@/lib/enums/has-flag";
import { Permission } from "@/lib/permissions/detailed-team-permission";
import { getCategoryTeamPermissions } from "@/lib/permissions/get-category-team-permissions";
import { getDetailedTeamPermissions } from "@/lib/permissions/get-detailed-team-permissions";
import { TeamPermission } from "@/lib/permissions/team-permission";
import React, { useEffect, useState } from "react";
import { Role } from "./team-roles-settings-page";

interface RoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (role: Omit<Role, "id" | "userCount">) => void;
  initialData?: Role;
  title: string;
  description: string;
}

export const RoleDialog: React.FC<RoleDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  description,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: TeamPermission.None,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        permissions: initialData.permissions,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: TeamPermission.None,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      permissions: TeamPermission.None,
    });
  };

  const togglePermission = (permission: TeamPermission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: hasFlag(prev.permissions, permission)
        ? prev.permissions & ~permission
        : prev.permissions | permission,
    }));
  };

  const toggleCategoryPermissions = (category: string) => {
    const categoryPerms = getCategoryTeamPermissions(category);
    if (categoryPerms === TeamPermission.None) return;

    const allSelected = hasFlag(formData.permissions, categoryPerms);

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions & ~categoryPerms
        : prev.permissions | categoryPerms,
    }));
  };

  const permissionsByCategory = getDetailedTeamPermissions(
    TeamPermission.All,
  ).reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-[min(64rem,90vw)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this role can do"
                  rows={3}
                />
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="mb-2 font-medium">Selected Permissions</h4>
                <p className="text-muted-foreground text-sm">
                  {getEnumKeys(formData.permissions, TeamPermission).length} of{" "}
                  {getEnumKeys(TeamPermission.All, TeamPermission).length}{" "}
                  permissions selected
                </p>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <Label>Permissions</Label>
              <ScrollArea className="h-80 rounded-md border">
                <div className="space-y-4 p-4">
                  {Object.entries(permissionsByCategory).map(
                    ([category, categoryPermissions]) => {
                      const selectedCount = categoryPermissions.filter((x) =>
                        hasFlag(formData.permissions, x.enumValue),
                      ).length;
                      const allSelected =
                        selectedCount === categoryPermissions.length;

                      return (
                        <Card key={category} className="border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={() =>
                                  toggleCategoryPermissions(category)
                                }
                              />
                              {category}
                              <span className="text-muted-foreground text-sm font-normal">
                                ({selectedCount}/{categoryPermissions.length})
                              </span>
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {categoryPermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-start gap-3"
                                >
                                  <Checkbox
                                    checked={hasFlag(
                                      formData.permissions,
                                      permission.enumValue,
                                    )}
                                    onCheckedChange={() =>
                                      togglePermission(permission.enumValue)
                                    }
                                    className="mt-1"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                      {permission.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {initialData ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
