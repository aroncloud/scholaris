'use client';

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX, X } from "lucide-react";
import { IUserList } from "@/types/staffType";
import { getRoleColor, getStatusColor } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import Link from "next/link";
import RoleActionForm from "@/components/custom-ui/modal/modalrole";

// Role translations for dynamic role generation
const roleTranslations = {
  fr: {
    ADMIN_SUPER: "Super Administrateur",
    ADMIN_HR: "Administrateur RH",
    ADMIN_ACADEMIC: "Administrateur Académique",
    FINANCE: "Comptable / Service Financier",
    DEPT_HEAD: "Chef de Département",
    TEACHER: "Enseignant",
    STUDENT: "Étudiant",
    STAFF: "Personnel / Collaborateur",
  },
};

type Props = {
  userList: IUserList[];
};

export default function UserSection({ userList }: Props) {
  const [users, setUsers] = useState<IUserList[]>(userList);
  const [roleModal, setRoleModal] = useState<{ user: IUserList | null; open: boolean }>({
    user: null,
    open: false,
  });



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
        <>
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
                  href={`/admin/users/${user.userId ?? "userdetail"}`}
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

          {/* Roles Modal */}
          {roleModal.open && roleModal.user && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/30"
              onClick={() => setRoleModal({ user: null, open: false })}
            >
              <div
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-3xl w-115 max-h-[85vh] overflow-auto relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setRoleModal({ user: null, open: false })}
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold">Gestion des rôles</h2>
                <p>Assigner ou retirer des rôles à cet utilisateur</p>

                <RoleActionForm
                  userCode={roleModal.user.user_code}
                  userProfiles={roleModal.user.profiles}
                  availableRoles={Object.entries(roleTranslations.fr)
                    .map(([value, label]) => ({ value, label }))}
                  locale="fr"
                  onClose={result => {
                    setRoleModal({ user: null, open: false });
                    if (result) {
                      setUsers(prev =>
                        prev.map(u => {
                          if (u.user_code !== result.userCode) return u;
                          let updatedProfiles = [...u.profiles];
                          if (result.action === "assign" && result.roles?.length) {
                            result.roles.forEach((role, i) => {
                              updatedProfiles.push({
                                profile_code: `${result.userCode}@${role}`,
                                role_code: role,
                                role_title: result.translatedRoleNames?.[i] || role,
                              });
                            });
                          }
                          if (result.action === "remove" && Array.isArray(result.profileCodes) && result.profileCodes.length) {
                            updatedProfiles = updatedProfiles.filter(
                              p => !result.profileCodes!.includes(p.profile_code)
                            );
                          }
                          return { ...u, profiles: updatedProfiles };
                        })
                      );
                    }
                  }}
                />
              </div>
            </div>
          )}
        </>
      ),
    },
  ], [roleModal]);

  return (
    <TabsContent value="users" className="space-y-4">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Utilisateurs ({users.length})</CardTitle>
          <CardDescription>Liste de tous les utilisateurs du système</CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <ResponsiveTable
            columns={userColumns}
            data={users}
            searchKey={["first_name", "last_name", "email"]}
            paginate={10}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
