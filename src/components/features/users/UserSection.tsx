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

interface MyProps {
  userList: IUserList[];
  loading: boolean;
  roles: Role[];
  onUpdateUserRoles?: (userId: string, selectedRoles: string[]) => Promise<void>;
}

export default function UserSection({ loading, userList, roles, onUpdateUserRoles }: MyProps) {
  const [roleModal, setRoleModal] = useState<{ user: IUserList | null; open: boolean }>({
    user: null,
    open: false,
  });
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);

  // Handle role update
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
                href={`/admin/users/${user.user_code}`}
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

            <DropdownMenuItem>
              {user.status_code === "ACTIVE" ? (
                <><UserX className="mr-2 h-4 w-4" /> Désactiver</>
              ) : (
                <><UserCheck className="mr-2 h-4 w-4" /> Activer</>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

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
    </>
  );
}