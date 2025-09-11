'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

type Role = {
  name: string;
  description: string;
  users: number;
  permissions: string[];
};

type RoleAndPermissionProps = {
  roles: Role[];
};

const RoleAndPermission = ({ roles }: RoleAndPermissionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{role.name}</span>
              <Badge variant="secondary">{role.users} utilisateurs</Badge>
            </CardTitle>
            <CardDescription>{role.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Permissions :</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {role.permissions.map((permission) => (
                  <li key={permission} className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Shield className="h-4 w-4 mr-2" />
              Gérer les permissions
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoleAndPermission;
