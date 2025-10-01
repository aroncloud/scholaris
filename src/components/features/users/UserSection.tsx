'use client';

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";
import { Role } from "@/types/userType";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import Link from "next/link";
import { IUserList } from "@/types/staffType";
import DialogManageUserRole from "./Modal/DialogManageUserRole";
import ContentLayout from "@/layout/ContentLayout";
import { ConfirmActionDialog } from "@/components/ConfirmActionDialog";
import { useUserData } from "@/hooks/feature/users/useUserData";
import { showToast } from "@/components/ui/showToast";

interface MyProps {
  userList: IUserList[];
  loading: boolean;
  roles: Role[];
  onUpdateUserRoles?: (userId: string, selectedRoles: string[]) => Promise<void>;
  fetchUserList: () => Promise<void>
}

export default function UserSection({ loading, userList, roles, onUpdateUserRoles, fetchUserList }: MyProps) {
  const [roleModal, setRoleModal] = useState<{ user: IUserList | null; open: boolean }>({
    user: null,
    open: false,
  });
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState("")

  const {
    handleDesactivateUser,
    handleDeleteUser,
  } = useUserData();


  const handleSaveRoles = async (userId: string, selectedRoles: string[]) => {
    if (!onUpdateUserRoles) return;
    
    try {
      setIsUpdatingRoles(true);
      await onUpdateUserRoles(userId, selectedRoles);
      setRoleModal({ user: null, open: false });
      // You might want to show a success toast here
    } catch (error) {
      console.error('Error updating user roles:', error);
      // You might want to show an error toast here
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  const userColumns: TableColumn<IUserList>[] = useMemo(() => [
    {
      key: "user",
      label: "Utilisateur",
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {(user.first_name + " " + user.last_name).split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "profiles",
      label: "Rôles",
      render: (_, user) =>
        user.profiles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.profiles.map(role => (
              <Badge key={role.profile_code} variant="secondary" className={getRoleColor(role.role_title)}>
                {role.role_title}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center">-</div>
        ),
    },
    {
      key: "status_code",
      label: "Statut",
      render: value => <Badge variant="secondary" className={getStatusColor(value)}>{value}</Badge>,
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
              onClick={() => setRoleModal({ user, open: true })}
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
    },
  ], []);


  const handleDeactivate = async () => {
    
    setProcessing(true);
    try {
      const result = await handleDesactivateUser(selectedUser);
      if (result.success) {
        setDeactivateDialogOpen(false);
        showToast({
          variant: "success-solid",
          message: 'Utilisateur désactivé',
          description: 'L\'utilisateur a été désactivé avec succès.',
          position: 'top-center',
        });
        fetchUserList();
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Impossible de désactiver l\'utilisateur.',
        position: 'top-center',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    
    setProcessing(true);
    try {
      const result = await handleDeleteUser(selectedUser);
      if (result.success) {
        setDeleteDialogOpen(false);
        showToast({
          variant: "success-solid",
          message: 'Utilisateur supprimé',
          description: 'L\'utilisateur a été supprimé définitivement.',
          position: 'top-center',
        });
        fetchUserList();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Impossible de supprimer l\'utilisateur.',
        position: 'top-center',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <ContentLayout
        title={`Utilisateurs (${userList.length})`}
        description="Liste de tous les utilisateurs du système"
        actions
      >

        <ResponsiveTable
          columns={userColumns}
          data={userList}
          searchKey={["first_name", "last_name", "email"]}
          paginate={10}
          isLoading={loading}
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