import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/lib/format/format-count";
import { Permission } from "@/lib/permissions/detailed-team-permission";
import { getDetailedTeamPermissions } from "@/lib/permissions/get-detailed-team-permissions";
import { TeamPermission } from "@/lib/permissions/team-permission";
import { Edit, Edit2, Lock, Shield, Trash2, User, Users } from "lucide-react";
import { Role } from "./team-roles-settings-page";
import { Badge } from "./ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu";

interface RoleCardProps {
  role: Role;
  permissions: TeamPermission;
  isDefault: boolean;
  setAsDefault: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleCard({
  role,
  permissions,
  isDefault,
  setAsDefault,
  onEdit,
  onDelete,
}: RoleCardProps) {
  const rolePermissions = getDetailedTeamPermissions(permissions);

  const permissionsByCategory = rolePermissions.reduce(
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
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className="shadow-elegant hover:shadow-glow group border-0 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                  {role.isSystem ? (
                    <Lock className="text-primary h-5 w-5" />
                  ) : (
                    <Shield className="text-primary h-5 w-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-foreground text-lg font-semibold">
                    {role.name}
                    {role.isSystem && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        System
                      </Badge>
                    )}
                    {isDefault && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAsDefault(role)}
                    className="hover:bg-primary/10 h-8 w-8 p-0"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(role)}
                  className="hover:bg-primary/10 h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {!role.isSystem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(role)}
                    className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Count */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">
                {formatCount(role.userCount, "user", "users")}
              </span>
            </div>

            {/* Permissions by Category */}
            <div className="space-y-3">
              <h4 className="text-foreground text-sm font-medium">
                Permissions
              </h4>
              {Object.keys(permissionsByCategory).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(permissionsByCategory).map(
                    ([category, perms]) => (
                      <div key={category} className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          {category}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {perms.map((permission) => (
                            <Badge
                              key={permission.id}
                              variant="outline"
                              className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs"
                            >
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No permissions assigned
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="min-w-48">
        <ContextMenuItem onClick={() => onEdit(role)}>
          <span>Edit</span>
          <Edit2 className="ml-auto size-4" />
        </ContextMenuItem>

        {!isDefault && (
          <ContextMenuItem onClick={() => setAsDefault(role)}>
            <span>Make Default</span>
            <User className="ml-auto size-4" />
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {!role.isSystem && (
          <ContextMenuItem variant="destructive" onClick={() => onDelete(role)}>
            <span>Delete</span>
            <Trash2 className="ml-auto size-4" />
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
