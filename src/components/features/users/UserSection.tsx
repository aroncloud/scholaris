/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Dispatch, SetStateAction, useState } from "react";
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
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import { ICreateUser, IUserList } from "@/types/staffType";
import { ACTION, USER_ROLE } from "@/constant";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";

type MyComponentProps = {
  userList: IUserList[];
  userRoleList: {
  label: string;
  value: string;
}[];
  setAction: Dispatch<SetStateAction<ACTION>>;
  setUserFormData: Dispatch<SetStateAction<ICreateUser | null>>;
  setSelectedUser: Dispatch<SetStateAction<IUserList | null>>;
  setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsCancelUserDialogOpen: Dispatch<SetStateAction<boolean>>;
};

// Mapping constant values to actual role titles in your data
const ROLE_MAPPING: Record<string, string> = {
  ALL: "ALL",
  STUDENT: "Étudiant",
  TEACHER: "Enseignant",
  RH: "RH",
  REGISTAR_OFFICE: "Scolarité",
  ADMIN: "Administrateurs",
};

const UserSection = ({
  userList,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userRoleList,
  setAction,
  setUserFormData,
  setSelectedUser,
  setIsEditDialogOpen,
  setIsCancelUserDialogOpen,
}: MyComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  // Filter users based on search term and selected role
  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      (user.last_name + " " + user.first_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const mappedRole = ROLE_MAPPING[selectedRole];

    const matchesRole =
      selectedRole === "ALL" ||
      user.profiles.some((role) => role.role_title === mappedRole);

    return matchesSearch && matchesRole;
  });


  const userColumns: TableColumn<IUserList>[] = [
    {
      key: "user",
      label: "Utilisateur",
      render: (_, user) => (
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
            <div className="font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "profiles",
      label: "Rôles",
      render: (_, user) => (
        <div className="flex flex-wrap gap-2">
          {user.profiles.length > 0 ? (
            user.profiles.map((role) => (
              <Badge key={role.profile_code} variant="secondary" className={getRoleColor(role.role_title)}>
                {role.role_title}
              </Badge>
            ))
          ) : (
            <div className="text-center">-</div>
          )}
        </div>
      ),
    },
    {
      key: "status_code",
      label: "Statut",
      render: (value) => <Badge variant="secondary" className={getStatusColor(value)}>{value}</Badge>,
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

            <DropdownMenuItem onClick={() => {}}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" /> Gérer les rôles
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() =>{} }>
              {user.status_code === "ACTIVE" ? (
                <><UserX className="mr-2 h-4 w-4" /> Désactiver</>
              ) : (
                <><UserCheck className="mr-2 h-4 w-4" /> Activer</>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600" onClick={() => {}}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];



  return (
    <TabsContent value="users" className="space-y-4">

      {/* Filters */}
      

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>Liste de tous les utilisateurs du système</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable<IUserList>
            columns={userColumns}        
            data={filteredUsers}         
            paginate={10}                
            searchKey={["first_name"]}      
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default UserSection;