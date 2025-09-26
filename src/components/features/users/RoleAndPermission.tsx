import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Role } from "@/types/userType";

interface MyProps {
  roles: Role[];
  loading: boolean;
}

const RoleAndPermission = ({loading, roles}: MyProps) => {

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );



  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.name} className="flex flex-col justify-between h-full">
          <div>
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
            </CardContent>
          </div>
          <div className="p-4 pt-0">
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Gérer les permissions
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RoleAndPermission;
