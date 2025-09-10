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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { v4 as uuidv4 } from "uuid";
import { ICreateUser, IUserList } from "@/types/staffType";
import { ACTION, USER_ROLE, USER_TABLE_HEADERS } from "@/constant";
import { getRoleColor, getStatusColor } from "@/lib/utils";

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
                {USER_ROLE.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>Liste de tous les utilisateurs du système</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="hover:bg-transparent">
                {USER_TABLE_HEADERS.map((header, index) => (
                  <TableHead 
                    key={index}
                    className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-3"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={USER_TABLE_HEADERS.length} className="text-center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={uuidv4()}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
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
                          <div className="font-medium">{user.first_name + " " + user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
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
                      <Badge variant="secondary" className={getStatusColor(user.status_code)}>
                        {user.status_code}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_login_at ?? "-"}
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
                              setAction("UPDATE");
                              setUserFormData({
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                gender: 'MALE', // Default value
                                phone_number: '', // Default empty
                                password_plaintext: '', // Empty for security
                                user_code: user.user_code,
                                // Optional fields with defaults
                                staff_number: `STAFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                                job_title: 'Staff',
                                department: 'General',
                                hiring_date: new Date().toISOString().split('T')[0],
                                salary: 0,
                                profiles: user.profiles || []
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" /> Gérer les rôles
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => {
                              setIsCancelUserDialogOpen(true);
                              setUserFormData({
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                gender: 'MALE',
                                phone_number: '',
                                password_plaintext: '',
                                user_code: user.user_code,
                                staff_number: `STAFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                                job_title: 'Staff',
                                department: 'General',
                                hiring_date: new Date().toISOString().split('T')[0],
                                salary: 0,
                                profiles: user.profiles || []
                              });
                              setAction(user.status_code === "ACTIVE" ? "DESACTIVATE" : "ACTIVATE");
                            }}
                          >
                            {user.status_code === "ACTIVE" ? (
                              <><UserX className="mr-2 h-4 w-4" /> Désactiver</>
                            ) : (
                              <><UserCheck className="mr-2 h-4 w-4" /> Activer</>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setUserFormData({
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                gender: 'MALE',
                                phone_number: '',
                                password_plaintext: '',
                                user_code: user.user_code,
                                staff_number: `STAFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                                job_title: 'Staff',
                                department: 'General',
                                hiring_date: new Date().toISOString().split('T')[0],
                                salary: 0,
                                profiles: user.profiles || []
                              });
                              setAction("DELETE");
                              setIsCancelUserDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default UserSection;





// 'use client'

// import { Dispatch, SetStateAction, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { TabsContent } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Search,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Shield,
//   UserCheck,
//   UserX,
//   Filter,
// } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";
// import { ICreateUser, IUserList } from "@/types/userTypes";
// import { ACTION, USER_ROLE, USER_TABLE_HEADERS } from "@/constant";
// import { getRoleColor, getStatusColor } from "@/lib/utils";

// type MyComponentProps = {
//   userList: IUserList[];
//   userRoleList: { lable: string; value: string }[];
//   setAction: Dispatch<SetStateAction<ACTION>>;
//   setUserFormData: Dispatch<SetStateAction<ICreateUser | null>>;
//   setSelectedUser: Dispatch<SetStateAction<IUserList | null>>;
//   setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
//   setIsCancelUserDialogOpen: Dispatch<SetStateAction<boolean>>;
// };

// // Mapping constant values to actual role titles in your data
// const ROLE_MAPPING: Record<string, string> = {
//   ALL: "ALL",
//   STUDENT: "Étudiant",
//   TEACHER: "Enseignant",
//   RH: "RH",
//   REGISTAR_OFFICE: "Scolarité",
//   ADMIN: "Administrateurs",
// };

// const UserSection = ({
//   userList,
//   userRoleList,
//   setAction,
//   setUserFormData,
//   setSelectedUser,
//   setIsEditDialogOpen,
//   setIsCancelUserDialogOpen,
// }: MyComponentProps) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRole, setSelectedRole] = useState("ALL");

//   // Filter users based on search term and selected role
//   const filteredUsers = userList.filter((user) => {
//     const matchesSearch =
//       (user.last_name + " " + user.first_name)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());

//     const mappedRole = ROLE_MAPPING[selectedRole];

//     const matchesRole =
//       selectedRole === "ALL" ||
//       user.profiles.some((role) => role.role_title === mappedRole);

//     return matchesSearch && matchesRole;
//   });

//   return (
//     <TabsContent value="users" className="space-y-4">

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Filtres et recherche</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex space-x-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Rechercher un utilisateur..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//             </div>

//             <Select value={selectedRole} onValueChange={setSelectedRole}>
//               <SelectTrigger className="w-[200px]">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {USER_ROLE.map((role) => (
//                   <SelectItem key={role.value} value={role.value}>
//                     {role.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Users Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
//           <CardDescription>Liste de tous les utilisateurs du système</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 {USER_TABLE_HEADERS.map((header, index) => (
//                   <TableHead key={index}>{header}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={USER_TABLE_HEADERS.length} className="text-center">
//                     Aucun utilisateur trouvé
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <TableRow key={uuidv4()}>
//                     <TableCell>
//                       <div className="flex items-center space-x-3">
//                         <Avatar>
//                           <AvatarFallback>
//                             {(user.first_name + " " + user.last_name)
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="font-medium">{user.first_name + " " + user.last_name}</div>
//                           <div className="text-sm text-muted-foreground">{user.email}</div>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex flex-wrap gap-2">
//                         {user.profiles.length > 0 ? (
//                           user.profiles.map((role) => (
//                             <Badge
//                               key={uuidv4()}
//                               variant="secondary"
//                               className={getRoleColor(role.role_title)}
//                             >
//                               {role.role_title}
//                             </Badge>
//                           ))
//                         ) : (
//                           <div className="text-center">-</div>
//                         )}
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <Badge variant="secondary" className={getStatusColor(user.status_code)}>
//                         {user.status_code}
//                       </Badge>
//                     </TableCell>

//                     <TableCell className="text-sm text-muted-foreground">
//                       {user.last_login_at ?? "-"}
//                     </TableCell>

//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>

//                           <DropdownMenuItem
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setAction("UPDATE");
//                               setUserFormData({
//                                 email: user.email,
//                                 first_name: user.first_name,
//                                 gender: "MALE",
//                                 last_name: user.last_name,
//                                 password_plaintext: "",
//                                 phone_number: "",
//                                 user_code: user.user_code,
//                                 profiles: [], 
//                               });
//                               setIsEditDialogOpen(true);
//                             }}
//                           >
//                             <Edit className="mr-2 h-4 w-4" /> Modifier
//                           </DropdownMenuItem>

//                           <DropdownMenuItem>
//                             <Shield className="mr-2 h-4 w-4" /> Gérer les rôles
//                           </DropdownMenuItem>

//                           <DropdownMenuSeparator />

//                           <DropdownMenuItem
//                             onClick={() => {
//                               setIsCancelUserDialogOpen(true);
//                               setUserFormData({
//                                 email: user.email,
//                                 first_name: user.first_name,
//                                 gender: "MALE",
//                                 last_name: user.last_name,
//                                 password_plaintext: "",
//                                 phone_number: "",
//                                 user_code: user.user_code,
//                                 profiles: [], 
//                               });
//                               setAction(user.status_code === "ACTIVE" ? "DESACTIVATE" : "ACTIVATE");
//                             }}
//                           >
//                             {user.status_code === "ACTIVE" ? (
//                               <><UserX className="mr-2 h-4 w-4" /> Désactiver</>
//                             ) : (
//                               <><UserCheck className="mr-2 h-4 w-4" /> Activer</>
//                             )}
//                           </DropdownMenuItem>

//                           <DropdownMenuSeparator />

//                           <DropdownMenuItem
//                             className="text-red-600"
//                             onClick={() => {
//                               setUserFormData({
//                                 email: user.email,
//                                 first_name: user.first_name,
//                                 gender: "MALE",
//                                 last_name: user.last_name,
//                                 password_plaintext: "",
//                                 phone_number: "",
//                                 user_code: user.user_code,
//                                 profiles: [], 
//                               });
//                               setAction("DELETE");
//                               setIsCancelUserDialogOpen(true);
//                             }}
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" /> Supprimer
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default UserSection;
