'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { getUserList } from "@/actions/userAction";
import { toast } from "sonner";
import { ICreateUser, IUserList } from "@/types/userTypes";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { ACTION } from "@/constant";

type MyComponentProps = {
    userList: IUserList[];
    userRoleList: {lable: string, value: string}[];
    setAction: Dispatch<SetStateAction<ACTION>>;
    setUserFormData: Dispatch<React.SetStateAction<ICreateUser | null>>;
    setSelectedUser: Dispatch<SetStateAction<IUserList | null>>;
    setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
    setIsCancelUserDialogOpen: Dispatch<SetStateAction<boolean>>;

};
const UserSection = ({userList, userRoleList, setAction, setUserFormData, setSelectedUser, setIsEditDialogOpen, setIsCancelUserDialogOpen }: MyComponentProps) => {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterFiliere, setFilterFiliere] = useState("all");
    const [filterStatut, setFilterStatut] = useState("all");
    const [currentUserList, setCurrentUserList] = useState<IUserList[]>([]);
    const [selectedRole, setSelectedRole] = useState('All');


    const filteredUsers = userList.filter((user) => {
        const matchesSearch =
        (user.last_name + " " + user.first_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesRole =
        // selectedRole === "Tous" || 'STUDENT'.includes(selectedRole);
        return matchesSearch;
    });
    const router = useRouter()
    return (
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
                        <SelectItem value="ALL">Tous les rôles</SelectItem>
                        <SelectItem value="STUDENT">Étudiants</SelectItem>
                        <SelectItem value="TEACHER">Enseignants</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                        <SelectItem value="REGISTAR_OFFICE">Scolarité</SelectItem>
                        <SelectItem value="ADMIN">
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
                <CardTitle>Utilisateurs ({userList.length})</CardTitle>
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
                    {userList.map((user) => (
                        <TableRow key={uuidv4()}>
                        <TableCell>
                            <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarFallback>
                                {(user.first_name + " " + user.last_name)
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{(user.first_name + " " + user.last_name)}</div>
                                <div className="text-sm text-muted-foreground">
                                {user.email}
                                </div>
                                {/* <div className="text-xs text-muted-foreground">
                                {user.profile}
                                Service Scolarité
                                </div> */}
                            </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-2">
                                {user.profiles.length > 0 ? (
                                    user.profiles.map((role) => (
                                    <Badge
                                        key={uuidv4()}
                                        variant="secondary"
                                        className={getRoleColor(role.role_title)}
                                    >
                                        {role.role_title}
                                    </Badge>
                                    ))
                                ) : (
                                    <div className="text-center">-</div>
                                )}
                                </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                            variant="secondary"
                            className={getStatusColor(user.status_code)}
                            >
                            {user.status_code}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {user.last_login_at ?? '-'}
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
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setAction('UPDATE')
                                        setUserFormData(
                                            {
                                                email: user.email,
                                                first_name: user.first_name,
                                                gender: 'MALE',
                                                last_name: user.last_name,
                                                password_plaintext: '',
                                                phone_number: '',
                                                user_code: user.user_code,

                                            }
                                        );
                                        setIsEditDialogOpen(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Gérer les rôles
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={()=>{
                                        setIsCancelUserDialogOpen(true)
                                        setUserFormData(
                                            {
                                                email: user.email,
                                                first_name: user.first_name,
                                                gender: 'MALE',
                                                last_name: user.last_name,
                                                password_plaintext: '',
                                                phone_number: '',
                                                user_code: user.user_code,

                                            }
                                        );
                                        setAction("DESACTIVATE")
                                    }}>
                                        {user.status_code === "ACTIVE" ? (
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
                                <DropdownMenuItem className="text-red-600"
                                    onClick={
                                        ()=>{
                                            setUserFormData(
                                                {
                                                    email: user.email,
                                                    first_name: user.first_name,
                                                    gender: 'MALE',
                                                    last_name: user.last_name,
                                                    password_plaintext: '',
                                                    phone_number: '',
                                                    user_code: user.user_code,

                                                }
                                            );
                                            console.log('DELETE')
                                            setAction("DELETE")
                                            setIsCancelUserDialogOpen(true)
                                        }
                                    }
                                >
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
    )
}

export default UserSection