/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  createUser,
  deactivateUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUser,
} from "@/actions/userAction";
import { ICreateUser, IGetUserDetail, IUpdateUserForm, IUserList } from "@/types/staffType";
import { showToast } from "@/components/ui/showToast";

export function useUserData() {
  const [userList, setUserList] = useState<IUserList[]>([]);
  const [userDetail, setUserDetail] = useState<IGetUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserList = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserList();
      if (result.code === "success") {
        setUserList(result.data.body ?? []);
      } else {
        setError(result.error ?? "Erreur inconnue");
        toast("Erreur de récupération des utilisateurs", { description: result.error });
      }
    } catch (err) {
      setError("Erreur réseau");
      toast("Erreur de récupération des utilisateurs", { description: "Erreur réseau" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserDetail = async (user_code: string) => {
    setLoading(true);
    const result = await getUserDetail(user_code);
    console.log("fetchUserDetail result:", result);
    if (result.code === "success") {
      setUserDetail(result.data.body ?? []);
    } else {
      setError(result.error ?? "Erreur inconnue");
      showToast({
        variant: "error-solid",
        message: "Erreur lors du chargement",
        description: result.error ?? "Une erreur est survenue lors du chargement des données utilisateur.",
        position: 'top-center',
      });
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleCreateUser = async (payload: ICreateUser) => {
    const result = await createUser(payload);
    if (result.code === "success") {
      await fetchUserList();
      return { success: true };
    } else {
      toast("Erreur lors de la création de l'utilisateur", { description: result.error });
      return { success: false, error: result.error };
    }
  };

  const handleUpdateUser = async (payload: IUpdateUserForm, user_code: string) => {
    const result = await updateUser(payload, user_code);
    if (result.code === "success") {
      await fetchUserList();
      return { success: true };
    } else {
      toast("Erreur lors de la mise à jour de l'utilisateur", { description: result.error });
      return { success: false, error: result.error };
    }
  };

  const handleDeleteUser = async (user_code: string) => {
    const result = await deleteUser(user_code);
    if (result.code === "success") {
      await fetchUserList();
      return { success: true };
    } else {
      toast("Erreur lors de la suppression de l'utilisateur", { description: result.error });
      return { success: false, error: result.error };
    }
  };

  const handleDesactivateUser = async (user_code: string) => {
    const result = await deactivateUser(user_code);
    if (result.code === "success") {
      await fetchUserList();
      return { success: true };
    } else {
      toast("Erreur lors de la désactivation de l'utilisateur", { description: result.error });
      return { success: false, error: result.error };
    }
  };

  return {
    userList,
    loading,
    error,
    fetchUserList,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDesactivateUser,
    fetchUserDetail,
    userDetail
  };
}