'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
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

const users = [
  {
    id: 1,
    name: "Marie Dupont",
    email: "marie.dupont@univ.fr",
    roles: ["Étudiant"],
    status: "Actif",
    lastLogin: "2024-01-15",
    profile: "Pharmacie Année 1",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Dr. Jean Martin",
    email: "jean.martin@univ.fr",
    roles: ["Enseignant", "Coordonnateur"],
    status: "Actif",
    lastLogin: "2024-01-14",
    profile: "Anatomie - Médecine",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@univ.fr",
    roles: ["RH"],
    status: "Actif",
    lastLogin: "2024-01-13",
    profile: "Service RH",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Pierre Dubois",
    email: "pierre.dubois@univ.fr",
    roles: ["Scolarité"],
    status: "Inactif",
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "Tous" || user.roles.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Inactif":
        return "bg-gray-100 text-gray-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrateur":
        return "bg-red-100 text-red-800";
      case "Enseignant":
        return "bg-blue-100 text-blue-800";
      case "Étudiant":
        return "bg-green-100 text-green-800";
      case "RH":
        return "bg-purple-100 text-purple-800";
      case "Scolarité":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouvel utilisateur au système avec ses rôles
                    appropriés.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom complet
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rôle
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Étudiant</SelectItem>
                        <SelectItem value="teacher">Enseignant</SelectItem>
                        <SelectItem value="hr">RH</SelectItem>
                        <SelectItem value="scolarite">Scolarité</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Créer l'utilisateur</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtres et recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Tous les rôles</SelectItem>
                      <SelectItem value="Étudiant">Étudiants</SelectItem>
                      <SelectItem value="Enseignant">Enseignants</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Scolarité">Scolarité</SelectItem>
                      <SelectItem value="Administrateur">
                        Administrateurs
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Liste de tous les utilisateurs du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôles</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user.profile}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="secondary"
                                className={getRoleColor(role)}
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Gérer les rôles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {user.status === "Actif" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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
      </div>
  );
}
