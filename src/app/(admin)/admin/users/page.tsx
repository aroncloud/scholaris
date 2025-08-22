'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { createUser, deactivateUser, deleteUser, getUserList, updateUser } from "@/actions/userAction";
import { toast } from "sonner";
import { ICreateUser, IListUser } from "@/types/userTypes";
import { getStatusColor } from "@/lib/utils";
import UserSection from "./UserSection";
import { ACTION } from "@/constant";
import ModalUser from "@/components/modal/users/ModalUser";
import ModaleDesactivateDeleteUser from "@/components/modal/users/ModaleDesactivateDeleteUser";

const users = [
  {
    id: 1,
    name: "Marie Dupont",
    email: "marie.dupont@univ.fr",
    roles: ["Étudiant"],
    status: "ACTIVE",
    lastLogin: "2024-01-15",
    profile: "Pharmacie Année 1",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Dr. Jean Martin",
    email: "jean.martin@univ.fr",
    roles: ["Enseignant", "Coordonnateur"],
    status: "ACTIVE",
    lastLogin: "2024-01-14",
    profile: "Anatomie - Médecine",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@univ.fr",
    roles: ["RH"],
    status: "ACTIVE",
    lastLogin: "2024-01-13",
    profile: "Service RH",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Pierre Dubois",
    email: "pierre.dubois@univ.fr",
    roles: ["Scolarité"],
    status: "InACTIVE",
    lastLogin: "2024-01-10",
    profile: "Service Scolarité",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.wilson@univ.fr",
    roles: ["Étudiant"],
    status: "En attente",
    lastLogin: "Jamais",
    profile: "Médecine Année 2",
    avatar: "/placeholder.svg",
  },
];

const roles = [
  {
    name: "Administrateur",
    description: "Accès complet au système",
    users: 2,
    permissions: [
      "Gestion des utilisateurs",
      "Configuration système",
      "Rapports avancés",
    ],
  },
  {
    name: "Scolarité",
    description: "Gestion des étudiants et programmes",
    users: 5,
    permissions: [
      "Gestion étudiants",
      "Validation demandes",
      "Gestion maquettes",
    ],
  },
  {
    name: "RH",
    description: "Gestion des ressources humaines",
    users: 3,
    permissions: ["Gestion enseignants", "Candidatures", "Profils personnel"],
  },
  {
    name: "Enseignant",
    description: "Accès pédagogique",
    users: 24,
    permissions: ["Saisie notes", "Emploi du temps", "Documents pédagogiques"],
  },
  {
    name: "Étudiant",
    description: "Portail étudiant",
    users: 2847,
    permissions: ["Consultation dossier", "Demandes", "Documents personnels"],
  },
];

const userRoleList = [
  {
    lable: 'Enseignant',
    value: 'TEACHER',
  },
  {
    lable: 'Coordonnateur',
    value: 'COORDINATOR',
  
  },
]

export default function UsersPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelUserDialogOpen, setIsCancelUserDialogOpen] = useState(false);
  const [action, setAction] = useState<ACTION>('CREATE');
  const [userList, setUserList] = useState<IListUser[]>([]);
  const [userFormData, setUserFormData] = useState<Partial<ICreateUser>>({});
  const [selectedUser, setSelectedUser] = useState<IListUser | null>(null);

  useEffect(() => {
      init();
  }, [])

  
  const handleSaveUserInfo = async () => {
    if(action === "CREATE"){
      const payload = {
        ...userFormData,
      } as ICreateUser

      const result = await createUser(payload)
      console.log('result-->', result);
      if(result.code == 'success'){
        await init();
        setIsEditDialogOpen(false);
      } else {
        toast("Erreur lors de la creation de l'etudiant", {
          description: result.error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    } else {
      const payload = {
        ...userFormData,
      } as ICreateUser

      const result = await updateUser(payload)
      console.log('result-->', result);
      if(result.code == 'success'){
        
        await init();
        setIsEditDialogOpen(false);
      } else {
        toast("Erreur lors de la mise a jour de l'etudiant", {
          description: result.error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    }
  };

  const handleDeleteUser = async () => {
    if(selectedUser){
      const result = await deleteUser(selectedUser.user_code);
      if(result.code == 'success'){
        await init();
        setIsEditDialogOpen(false);
        toast("Creation de l'utilisateur", {
          description: 'Utilisateur créé avec succes',
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      } else {
        toast("Creation de l'utilisateur", {
          description: result.error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    }
  }

  const handleDesactivate = async () => {
    if(selectedUser){
      const result = await deactivateUser(selectedUser.user_code);
      if(result.code == 'success'){
        await init();
        setIsEditDialogOpen(false);
        toast("Creation de l'utilisateur", {
          description: 'Utilisateur créé avec succes',
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      } else {
        toast("Creation de l'utilisateur", {
          description: result.error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    }
  }


  const init = async () => {
      const result = await getUserList();
    if(result.code == 'success') {
        setUserList(result.data.body);
    } else {
        toast("Recuperation des donnes utilisateurs", {
          description: result.error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    console.log('getUserList.result', result)
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Gestion des utilisateurs
            </h2>
            <p className="text-muted-foreground">
              Gérez les utilisateurs, rôles et permissions du système
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button
              variant="info"
              onClick={() => {setIsEditDialogOpen(true); setAction('CREATE')}}
              className="text-sm w-full sm:w-fit flex-1 sm:flex-none"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
          </TabsList>

          <UserSection
            userList={userList}
            userRoleList={userRoleList}
            setAction={setAction}
            setUserFormData={setUserFormData}
            setIsCancelUserDialogOpen={setIsCancelUserDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            setSelectedUser={setSelectedUser}

          />

          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{role.name}</span>
                      <Badge variant="secondary">
                        {role.users} utilisateurs
                      </Badge>
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Permissions :</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {role.permissions.map((permission) => (
                          <li key={permission} className="flex items-center">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2" />
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Shield className="h-4 w-4 mr-2" />
                      Gérer les permissions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <ModalUser
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={userFormData}
          setFormData={setUserFormData}
          onConfirm={handleSaveUserInfo}
          action={action}
        />

        <ModaleDesactivateDeleteUser 
          isOpen={isCancelUserDialogOpen}
          onClose={()=> {setIsCancelUserDialogOpen(false); setSelectedUser(null)}}
          onDeactivate={handleDesactivate}
          onDelete={handleDeleteUser}
        />
      </div>
  );
}
