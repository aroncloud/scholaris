'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { getFullRoles } from "@/actions/roleandpermision/getFullRole";

type Role = {
  name: string;
  description: string;
  users: number;
  permissions: string[];
};

const RoleAndPermission = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const cached = sessionStorage.getItem("roles");
        if (cached) {
          setRoles(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const result = await getFullRoles();
        if (result.code === "success" && Array.isArray(result.data)) {
          const mappedRoles: Role[] = result.data.map((role) => ({
            name: role.title,
            description: role.description,
            users: role.user_count,
            permissions: role.permissions.map((p) => p.permission_title),
          }));
          setRoles(mappedRoles);
          sessionStorage.setItem("roles", JSON.stringify(mappedRoles));
        } else {
          setError(result.error || "Failed to fetch roles");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (roles.length === 0) return <p>No roles found.</p>;

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
