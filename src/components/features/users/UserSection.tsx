/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import Link from "next/link";
import { IGetRole, IGetUser } from "@/types/staffType";
import DialogManageUserRole from "./Modal/DialogManageUserRole";
import ContentLayout from "@/layout/ContentLayout";
import { ConfirmActionDialog } from "@/components/ConfirmActionDialog";
import { useUserData } from "@/hooks/feature/users/useUserData";
import { showToast } from "@/components/ui/showToast";
import { assignRolesToUser, removeUserRoles } from "@/actions/userAction";
import { Avatar } from "@/components/custom-ui/Avatar";

interface MyProps {
  roles: IGetRole[];
  userData: ReturnType<typeof useUserData>;
}

export default function UserSection({ roles, userData }: MyProps) {
  const [roleModal, setRoleModal] = useState<{ user: IGetUser | null; open: boolean }>({
    user: null,
    open: false,
  });
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("")

  const {
    handleDeactivateUser,
    handleDeleteUser,
    handleUpdateUser,
    processing,
    loadingUserData,
    userList,
    fetchUserList
  } = userData;
  
  const handleUpdateUserRole = async (userId: string, _rolesToRemove: string[], _rolesToAdd: string[]) => {
    console.log("-->_roleToRemove", _rolesToRemove)
    console.log("-->_roleToAdd", _rolesToAdd);
    
    if(_rolesToRemove.length > 0 ) {
      const removeResult = await removeUserRoles(userId, _rolesToAdd);
      if(removeResult.code == 'success') {
        showToast({
          variant: "success-solid",
          message: 'Action éffectuée avec succès',
          description: `${_rolesToAdd.length} rôle(s) ajouté(s) avec succès`,
          position: 'top-center',
        });
      } else {
        showToast({
          variant: "error-solid",
          message: 'Erreur',
          description: `Une erreur est survenue lors de la suppréssion des rôles`,
          position: 'top-center',
        });
      }
    }
    if(_rolesToAdd.length > 0 ) {
      const addResult = await assignRolesToUser(userId, _rolesToAdd);
      if(addResult.code == 'success') {
        showToast({
          variant: "success-solid",
          message: 'Action éffectuée avec succès',
          description: `${_rolesToAdd.length} rôle(s) ajouté(s) avec succès`,
          position: 'top-center',
        });
      } else {
        showToast({
          variant: "error-solid",
          message: 'Erreur',
          description: `Une erreur est survenue lors de l\'assignation des rôles`,
          position: 'top-center',
        });
      }
      
    }
    
    
    return false
  }
  
  const handleSaveRoles = async (userId: string, rolesToRemove: string[], rolesToAdd: string[]) => {
    try {
      setIsUpdatingRoles(true);
      await handleUpdateUserRole(userId, rolesToRemove, rolesToAdd);
      setRoleModal({ user: null, open: false });
    } catch (error) {
      console.error('Error updating user roles:', error);
    } finally {
      setIsUpdatingRoles(false);
    }
  };
  
  const userColumns: TableColumn<IGetUser>[] = useMemo(() => [
    {
      key: "user",
      label: "Utilisateur",
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <Avatar
            fallback={(user.first_name + " " + user.last_name)}
            variant={"info"}
            className="hidden sm:flex"
          />
        <div>
        <div className="font-medium">{user.first_name} {user.last_name}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        </div>
      ),
      priority: "low"
    },
    {
      key: "profiles",
      label: "Rôles",
      render: (_, user) =>
        user.profiles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
        {user.profiles.map(role => (
          <Badge key={role.profile_code} size="sm" value={role.role_title} label={role.role_title} />
        ))}
        </div>
      ) : (
        <div className="text-center">-</div>
      ),
      priority: "low"
    },
    {
      key: "status_code",
      label: "Statut",
      render: value => <Badge size="sm" value={value} label={value} />,
      priority: "low"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
              href={`/dashboard/admin/users/${user.user_code}`}
              className="flex items-center cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" /> Plus de détail
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => {
                console.log("-->user", user)
                setSelectedUser(user.user_code)
                setRoleModal({ user, open: true })
              }}
              className="flex items-center cursor-pointer"
            >
              <Shield className="mr-2 h-4 w-4" /> Gérer les rôles
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
              <DropdownMenuItem onClick={() => {
                setDeactivateDialogOpen(true)
                setSelectedUser(user.user_code)}
              }>
                {user.status_code === "ACTIVE" ? (
                  <><UserX className="mr-2 h-4 w-4" /> Désactiver</>
                ) : (
                  <><UserCheck className="mr-2 h-4 w-4" /> Activer</>
                )}
              </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-red-600" onClick={() => {
              setSelectedUser(user.user_code)
              setDeleteDialogOpen(true)
            }}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      priority: "high"
    },
  ], []);
  
  
  const handleDeactivate = async () => {
    const result = await handleDeactivateUser(selectedUser);
    if (result.success) {
      setDeactivateDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Utilisateur désactivé',
        description: 'L\'utilisateur a été désactivé avec succès.',
        position: 'top-center',
      });
    } else {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: result.error,
        position: 'top-center',
      });
    }
  };
  
  
  const handleDelete = async () => {
    console.log("-->selectedUser", selectedUser)
    const result = await handleDeleteUser(selectedUser);
    if (result.success) {
      setDeleteDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Utilisateur supprimé',
        description: 'L\'utilisateur a été supprimé définitivement.',
        position: 'top-center',
      });
    } else {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: result.error,
        position: 'top-center',
      });
    }
  };
  
  useEffect(() => {
    fetchUserList()
  }, [fetchUserList])
  
  return (
    <>
      <ContentLayout
        title={`Utilisateurs (${userList.filter((user: IGetUser) =>
                !user.profiles?.some(profile => profile.role_code === "STUDENT")).length})`}
        description="Liste de tous les utilisateurs du système"
        actions
      >

        <ResponsiveTable
          columns={userColumns}
          data={userList.filter((user: IGetUser) =>
                !user.profiles?.some(profile => profile.role_code === "STUDENT"))}
          searchKey={["first_name", "last_name", "email"]}
          paginate={10}
          isLoading={loadingUserData}
        />
      </ContentLayout>
      
      
      {/* Role Management Modal */}
      <DialogManageUserRole
        open={roleModal.open}
        onOpenChange={(open) => setRoleModal(prev => ({ ...prev, open }))}
        user={roleModal.user}
        availableRoles={roles}
        onSave={handleSaveRoles}
        loading={isUpdatingRoles}
      />
      
      <ConfirmActionDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={handleDeactivate}
        title="Désactiver l'utilisateur"
        description="Êtes-vous sûr de vouloir désactiver cet utilisateur ? Cette action peut être annulée ultérieurement."
        confirmLabel="Désactiver"
        cancelLabel="Annuler"
        variant="warning"
        loading={processing}
        loadingText="Désactivation..."
      />
      
      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer définitivement l'utilisateur"
        description="Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées. Êtes-vous absolument sûr ?"
        confirmLabel="Supprimer définitivement"
        cancelLabel="Annuler"
        variant="danger"
        loading={processing}
        loadingText="Suppression..."
      />
    </>
  );
}