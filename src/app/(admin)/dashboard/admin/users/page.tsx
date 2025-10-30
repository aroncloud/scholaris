'use client';

import { useState } from "react";
import { UserPlus, Upload, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/components/animate/tabs';

import UserSection from "@/components/features/users/UserSection";
import RoleAndPermission from "@/components/features/users/RoleAndPermission";
import { useRoleData } from "@/hooks/feature/users/usePermissionData";
import { useUserData } from "@/hooks/feature/users/useUserData";
import PageHeader from "@/layout/PageHeader";
import { DialogCreateUser } from "@/components/features/users/Modal/DialogCreateUser";
import { showToast } from "@/components/ui/showToast";
import { IHireExistingStaff } from "@/types/userType";

// Component
export default function UsersPage() {
  const { loadingRole, roles } = useRoleData()
  const { handleCreateUser } = useUserData()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const pageTitle = "Gestion des utilisateurs";
  const pageDescription = "Gérez les utilisateurs, rôles et permissions du système";

  const handleSaveUser = async (userData: IHireExistingStaff): Promise<boolean> => {
    const result = await handleCreateUser(userData);

    if (result.success) {
      showToast({
        variant: "success-solid",
        message: 'Utilisateur créé',
        description: 'L\'utilisateur a été créé avec succès.',
        position: 'top-center',
      });
      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: result.error || 'Une erreur est survenue lors de la création de l\'utilisateur.',
        position: 'top-center',
      });
      return false;
    }
  };





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
            onClick={() => setCreateDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Nouvel utilisateur
          </Button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <Tabs defaultValue="users" className="p-6">
        <TabsList className="bg-white rounded-xl border border-slate-200 p-1 inline-flex space-x-1 shadow-sm h-auto w-full mt-6 mb-2">
          <TabsTrigger value="users"
            className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
          >Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles"
            className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
          >Rôles et permissions</TabsTrigger>
        </TabsList>
        <TabsContents>
          <TabsContent value="users" className="space-y-4">
            <UserSection roles={roles} />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RoleAndPermission loading={loadingRole} roles={roles}/>
          </TabsContent>
        </TabsContents>
      </Tabs>

      {/* Create User Dialog */}
      <DialogCreateUser
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleSaveUser}
      />
    </div>
  );
}