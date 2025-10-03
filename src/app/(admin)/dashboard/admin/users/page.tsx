/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { UserPlus, Upload, Download } from "lucide-react";


import { IGetUser } from "@/types/staffType";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/components/animate/tabs';

import UserSection from "@/components/features/users/UserSection";
import RoleAndPermission from "@/components/features/users/RoleAndPermission";
import { useUserData } from "@/hooks/feature/users/useUserData";
import { useRoleData } from "@/hooks/feature/users/usePermissionData";
import PageHeader from "@/layout/PageHeader";
import { assignRolesToUser, removeUserRoles } from "@/actions/userAction";
import { showToast } from "@/components/ui/showToast";

// Component
export default function UsersPage() {
  const { loading, userList, fetchUserList } = useUserData();
  const { loadingRole, roles } = useRoleData()
  const pageTitle = "Gestion des utilisateurs";
  const pageDescription = "Gérez les utilisateurs, rôles et permissions du système";


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
  


  return (
    <div>
      {/* Header */}
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      >
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" /> Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
          <Button
            variant="info"
            onClick={() => {
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Nouvel utilisateur
          </Button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <Tabs defaultValue="users" className="p-6">
        <TabsList className="flex w-full">
          <TabsTrigger value="users" className="w-full">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
        </TabsList>
        <TabsContents>
          <TabsContent value="users" className="space-y-4">
            <UserSection
              fetchUserList={fetchUserList}
              userList={
                userList.filter((user: IGetUser) => 
                user.profiles?.some(profile => profile.role_code != "STUDENT")
              )} 
              loading={loading}
              onUpdateUserRoles={handleUpdateUserRole}
              roles={roles}
            />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RoleAndPermission loading={loadingRole} roles={roles}/>
          </TabsContent>
        </TabsContents>
      </Tabs>
    
    </div>
  );
}