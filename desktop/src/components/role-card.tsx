import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/lib/format-count";
import { formatUserCount } from "@/lib/format-user-count";
import { Edit, Lock, LucideDot, Shield, Trash2 } from "lucide-react";
import React from "react";
import { Permission, Role } from "./team-roles-settings-page";
import { Link } from "react-router-dom";

interface RoleCardProps {
  role: Role;
  permissions: Permission[];
  onDelete: (role: Role) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  permissions,
  onDelete,
}) => {
  return (
    <Card className="group gap-0 border-0">
      <CardHeader className="flex items-start justify-between pb-4">
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
            </CardTitle>

            <p className="text-muted-foreground flex items-center text-sm">
              <span>{formatUserCount(role.userCount)}</span>
              <LucideDot />
              <span>
                {formatCount(permissions.length, "permission", "permissions")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="size-8">
            <Link to={role.id}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          {!role.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(role)}
              className="size-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">{role.description}</p>
      </CardContent>
    </Card>
  );
};
