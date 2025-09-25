/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ModalUser from "@/components/modal/users/ModalUser";
import ModaleDesactivateDeleteUser from "@/components/modal/users/ModaleDesactivateDeleteUser";

const userRoleList = [
  { label: 'Enseignant', value: 'TEACHER' },
  { label: 'Coordonnateur', value: 'COORDINATOR' },
];

// Sample role data for the RoleAndPermission component
const sampleRoles = [
  {
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités du système',
    users: 3,
    permissions: [
      'Gestion des utilisateurs',
      'Gestion des rôles',
      'Configuration du système',
      'Rapports avancés'
    ]
  },
  {
    name: 'Enseignant',
    description: 'Accès aux fonctionnalités pédagogiques',
    users: 25,
    permissions: [
      'Gestion des cours',
      'Saisie des notes',
      'Communication avec les étudiants',
      'Accès aux emplois du temps'
    ]
  },
  {
    name: 'Étudiant',
    description: 'Accès aux fonctionnalités étudiantes',
    users: 350,
    permissions: [
      'Consultation des notes',
      'Inscription aux cours',
      'Accès aux ressources pédagogiques',
      'Consultation des emplois du temps'
    ]
  }
];

// Component
export default function UsersPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelUserDialogOpen, setIsCancelUserDialogOpen] = useState(false);
  const [action, setAction] = useState<ACTION>('CREATE');
  const [userList, setUserList] = useState<IUserList[]>([]);
  const [userFormData, setUserFormData] = useState<ICreateUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUserList | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the component
  const init = async () => {
    try {
      setLoading(true);
      const result = await getUserList();
      if (result.code === 'success') {
        if (result.data?.body?.length > 0) {
          const users = result.data.body.filter((user: IUserList) => 
            user.profiles?.some(profile => profile.role_code !== "STUDENT")
          );
          setUserList(users);
        }
        
      } else {
        toast.error('Erreur lors du chargement des utilisateurs', {
          description: result.error || 'Une erreur est survenue',
        });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs', {
        description: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  interface ApiResponse {
    code: 'success' | 'error';
    message?: string;
    status?: number;
    data?: any;
    error?: any;
  }

  const handleSaveUserInfo = async (formData?: ICreateUser): Promise<1 | ApiResponse> => {
    if (!formData) {
      return {
        code: 'error',
        message: 'No form data provided',
        status: 400,
        data: null
      };
    }

    setLoading(true);
    try {
      const payload: ICreateUser = {
        ...formData,
        staff_number: formData.staff_number || `STAFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        job_title: formData.job_title || 'Staff',
        department: formData.department || 'General',
        hiring_date: formData.hiring_date || new Date().toISOString().split('T')[0],
        profiles: formData.profiles || [{
          profile_code: 'STAFF',
          role_code: 'STAFF',
          role_title: 'Staff'
        }]
      };

      const apiAction = action === 'CREATE' ? createUser : updateUser;
      const payloadToSend = action === 'CREATE' 
        ? payload 
        : { ...payload, user_code: formData.user_code };
      
      const result = await apiAction(payloadToSend as any);

      // Remove all toast calls here
      if (result && 'code' in result && result.code === 'success') {
        await init();
        setIsEditDialogOpen(false);
        return 1; // success indicator for ModalUser
      } else {
        return {
          code: 'error',
          message: (result as any)?.message || 'Une erreur est survenue lors de la sauvegarde',
          status: (result as any)?.status || 500,
          data: result?.data || null
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      console.error('Error in handleSaveUserInfo:', error);
      return {
        code: 'error',
        message: errorMessage,
        status: 500,
        data: null
      };
    } finally {
      setLoading(false);
    }
  };




  const handleDeleteUser = async () => {
    if (userFormData?.user_code) {
      const result = await deleteUser(userFormData.user_code);
      if (result.code === 'success') {
        await init();
        setIsEditDialogOpen(false);
        toast.success("Utilisateur supprimé avec succès");
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    }
  };

  const handleDesactivate = async () => {
    if (userFormData?.user_code) {
      const result = await deactivateUser(userFormData.user_code);
      if (result.code === 'success') {
        await init();
        setIsEditDialogOpen(false);
        toast.success("Utilisateur désactivé avec succès");
      } else {
        toast.error(result.error || "Erreur lors de la désactivation");
      }
    }
  };

  return (
    <div className="space-y-6">
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
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
        </TabsList>

        {loading ? (
          <UserTableSkeleton />
        ) : (
          <UserSection
            userList={userList}
            userRoleList={userRoleList}
            setAction={setAction}
            setUserFormData={setUserFormData}
            setIsCancelUserDialogOpen={setIsCancelUserDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            setSelectedUser={setSelectedUser}
          />
        )}

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Gestion des rôles</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez les rôles et leurs permissions dans le système
                </p>
              </div>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" /> Créer un rôle
              </Button>
            </div>
            <RoleAndPermission roles={sampleRoles} />
          </div>
        </TabsContent>
      </Tabs>

      <ModalUser
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setUserFormData(null);
          setAction('CREATE' as ACTION);
        }}
        initialData={userFormData}
        action={action === 'UPDATE' ? 'UPDATE' : 'CREATE'}
        roles={userRoleList}
        onSave={handleSaveUserInfo}
      />

      <ModaleDesactivateDeleteUser
        isOpen={isCancelUserDialogOpen}
        onClose={() => { setIsCancelUserDialogOpen(false); setSelectedUser(null); }}
        handleAction={handleDesactivate}
        action={action}
      />
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
