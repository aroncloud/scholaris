'use client';

import { getFullRoles } from "@/actions/roleandpermision/getFullRole";
import { Role } from "@/types/userType";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useRoleData() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRole, setLoading] = useState(true);
  const [errorRole, setError] = useState<string | null>(null);

  const fetchRoleList = useCallback(async () => {
    setLoading(true);
    try {
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
        const errMsg = result.error || "Failed to fetch roles";
        setError(errMsg);
        toast("Erreur lors de la récupération des rôles", { description: errMsg });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch roles");
      toast("Erreur lors de la récupération des rôles", { description: err.message || "Erreur réseau" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoleList();
  }, [fetchRoleList]);


  return {
    roles,
    loadingRole,
    errorRole,
    fetchRoleList,
  };
}
