'use client';

import { getFullRoles } from "@/actions/userAction";
import { showToast } from "@/components/ui/showToast";
import { IGetRole } from "@/types/staffType";
import { useState, useEffect, useCallback } from "react";

export function useRoleData() {
  const [roles, setRoles] = useState<IGetRole[]>([]);
  const [loadingRole, setLoading] = useState(true);
  const [errorRole, setError] = useState<string | null>(null);

  const fetchRoleList = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFullRoles();
      console.log('getFullRoles:', result)
      if (result.code === "success") {
        setRoles(result.data.body);
      } else {
        const errMsg = result.error || "Failed to fetch roles";
        setError(errMsg);
        showToast({
          variant: "error-solid",
          message: "Erreur lors de la récupération des rôles",
          description: result.code,
          position: 'top-center',
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch roles");
      console.log("Erreur lors de la récupération des rôles", { description: err.message || "Erreur réseau" });
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
