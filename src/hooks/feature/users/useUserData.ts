/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useCallback } from "react";
import {
  createUser,
  deactivateUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUser,
} from "@/actions/userAction";
import { ICreateUser, IGetUserDetail, IUpdateUserForm, IGetUser } from "@/types/staffType";

export type OperationResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

export function useUserData() {
  const [userList, setUserList] = useState<IGetUser[]>([]);
  const [userDetail, setUserDetail] = useState<IGetUserDetail | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [processing, setIsProcessing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const fetchUserList = useCallback(async (): Promise<OperationResult<IGetUser[]>> => {
    setLoadingUserData(true);
    setFetchError(null);
    
    const result = await getUserList();
    
    if (result.code === "success") {
      const data = result.data.body ?? [];
      console.log('-->Before.userList', userList)
      console.log('-->Before.userList', data)
      setUserList(data);
      setLoadingUserData(false);
      return { success: true, data };
    } else {
      const errorMsg = result.error ?? "Erreur lors du chargement de la liste des utilisateurs";
      setFetchError(errorMsg);
      setLoadingUserData(false);
      return { success: false, error: errorMsg };
    }
  }, []);
  
  const fetchUserDetail = useCallback(
    async (user_code: string): Promise<OperationResult<IGetUserDetail | null>> => {
      setLoadingUserData(true);
      setFetchError(null);
      setUserDetail(null);
      
      const result = await getUserDetail(user_code);
      
      if (result.code === "success") {
        const data = result.data.body ?? null;
        setUserDetail(data);
        setLoadingUserData(false);
        return { success: true, data };
      } else {
        const errorMsg = result.error ?? "Erreur lors du chargement des détails utilisateur";
        setFetchError(errorMsg);
        setLoadingUserData(false);
        return { success: false, error: errorMsg };
      }
    },
    []
  );
  
  const handleCreateUser = useCallback(
    async (payload: ICreateUser): Promise<OperationResult> => {
      setIsProcessing(true);
      const result = await createUser(payload);
      setIsProcessing(false);
    
      
      if (result.code === "success") {
        setLoadingUserData(true);
        await fetchUserList();
        setLoadingUserData(false);
        return { success: true, data: result.data.body };
      } else {
        return { 
          success: false, 
          error: result.error ?? "Erreur lors de la création de l'utilisateur" 
        };
      }
    },
    [fetchUserList]
  );
  
  const handleUpdateUser = useCallback(
    async (payload: IUpdateUserForm, user_code: string): Promise<OperationResult> => {
      
      setIsProcessing(true);
      
      const result = await updateUser(payload, user_code);
      
      setIsProcessing(false);
      
      if (result.code === "success") {
        setUserList(prev =>
          prev.map(user =>
            user.user_code === user_code
            ? { ...user, ...payload }
            : user
          )
        );
        
        if (userDetail?.user_code === user_code) {
          setLoadingUserData(true);
          await fetchUserDetail(user_code);
          setLoadingUserData(false);
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error ?? "Erreur lors de la mise à jour de l'utilisateur" 
        };
      }
    },
    [userDetail, fetchUserDetail]
  );
  
  const handleDeleteUser = useCallback(
    async (user_code: string): Promise<OperationResult> => {
      setIsProcessing(true);
      
      const result = await deleteUser(user_code);
      
      setIsProcessing(false);
      
      if (result.code === "success") {
        setUserList(prev => prev.filter(user => user.user_code !== user_code));
        
        if (userDetail?.user_code === user_code) {
          setUserDetail(null);
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error ?? "Erreur lors de la suppression de l'utilisateur" 
        };
      }
    },
    [userDetail]
  );
  
  const handleDeactivateUser = useCallback(
    async (user_code: string): Promise<OperationResult> => {
      setIsProcessing(true);
      
      const result = await deactivateUser(user_code);
      
      setIsProcessing(false);
      
      if (result.code === "success") {
        setUserList(prev =>
          prev.map(user =>
            user.user_code === user_code
            ? { ...user, is_active: false }
            : user
          )
        );
        
        if (userDetail?.user_code === user_code) {
          setUserDetail(prev => prev ? { ...prev, is_active: false } : null);
        }
        
        return { success: true, error: 'Utilisateur désactivé avec succès' };
      } else {
        return { 
          success: false, 
          error: result.error ?? "Erreur lors de la désactivation de l'utilisateur" 
        };
      }
    },
    [userDetail]
  );
  
  const clearFetchError = useCallback(() => {
    setFetchError(null);
  }, []);
  
  return {
    userList,
    userDetail,
    loadingUserData,
    fetchError,
    clearFetchError,
    fetchUserList,
    fetchUserDetail,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDeactivateUser,
    processing,
  };
}