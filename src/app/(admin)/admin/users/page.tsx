/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ACTION } from "@/constant";
import { UserPlus, Upload, Download } from "lucide-react";

import { 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserList, 
  deactivateUser 
} from "@/actions/userAction";

import { ICreateUser, IUserList } from "@/types/staffType";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import UserSection from "@/components/features/users/UserSection";
import RoleAndPermission from "@/components/features/users/RoleAndPermission";
import { useUserData } from "@/hooks/feature/users/useUserData";
import { useRoleData } from "@/hooks/feature/users/usePermissionData";

// Component
export default function UsersPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [action, setAction] = useState<ACTION>('CREATE');
  const [userFormData, setUserFormData] = useState<ICreateUser | null>(null);
  const {error, fetchUserList, loading, userList} = useUserData();
  const { loadingRole, roles } = useRoleData()









  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les utilisateurs, rôles et permissions du système</p>
        </div>
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
              setIsEditDialogOpen(true);
              setAction('CREATE');
              setUserFormData(null);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6 ">
        <TabsList className="flex w-full">
          <TabsTrigger value="users" className="w-full">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
        </TabsList>
          <TabsContent value="users" className="space-y-4">
            <UserSection userList={userList.filter((user: IUserList) => 
              user.profiles?.some(profile => profile.role_code !== "STUDENT")
            )} loading={loading} roles={roles}/>
          </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Gestion des rôles</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez les rôles et leurs permissions dans le système
                </p>
              </div>
            </div>
            <RoleAndPermission loading={loadingRole} roles={roles}/>
          </div>
        </TabsContent>
      </Tabs>
      
    </div>
  );
}

// Skeleton Component
const UserTableSkeleton = () => {
  const rows = new Array(5).fill(null);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom complet</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Département</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Dernière connexion</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-6" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
