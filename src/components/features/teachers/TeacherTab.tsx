/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useMemo } from "react";
import {
    Calendar,
    Download,
    Edit,
    Eye,
    FileText,
    Lock,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Unlock,
    Upload,
    UserX,
} from "lucide-react";
import { CreateTeacherRequest, Teacher } from "../../../app/(admin)/admin/teachers/types";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/lib/utils";
import { CreateTeacherDialog } from "./CreateTeacherDialog";
import { UpdateTeacherDialog } from "./UpdateTeacherDialog";
import { TeacherDialog } from "./TeacherDialog";
import { createTeacher } from "@/actions/teacherActions";
import { toast } from "sonner";

interface ComponentProps {
    teachers: Teacher[];
    setIExportModalOpen: (open: boolean) => void;
    setIsImportModalOpen: (open: boolean) => void;
    setIsCreateTeacherOpen: (open: boolean) => void;
    isExportModalOpen: boolean;
    isImportModalOpen: boolean;
    isCreateTeacherOpen: boolean;
}


const TeacherTab = ({
    teachers,
    isCreateTeacherOpen,
    setIsCreateTeacherOpen,
    isExportModalOpen,
    setIExportModalOpen,
    isImportModalOpen,
    setIsImportModalOpen
}: ComponentProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartement, setFilterDepartement] = useState("all");
    const [filterStatut, setFilterStatut] = useState("all");
    
    const [isUpdateTeacherOpen, setIsUpdateTeacherOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    
    // Filtrage optimisé avec useMemo
    const filteredTeachers = useMemo(() => {
        return teachers.filter((t) => {
            const matchesSearch =
            `${t.nom} ${t.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept =
            filterDepartement === "all" || t.departement === filterDepartement;
            const matchesStatut =
            filterStatut === "all" || t.statut === filterStatut;
            return matchesSearch && matchesDept && matchesStatut;
        });
    }, [teachers, searchTerm, filterDepartement, filterStatut]);
    
    const handleCreateTeacher = async (teacher: CreateTeacherRequest) => {
        const response = await createTeacher(teacher);
        if (response.code === 'success') {
            setIsCreateTeacherOpen(false);
            toast("Enseignant créé avec succès")
        } else {
            toast("Impossible de créer l'enseignant")
        }
    }

    const handleUpdateTeacher = (teacher: CreateTeacherRequest) => {
        console.log("Creating teacher:", teacher);
    }

    return (
        <>
            <TabsContent value="enseignants" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Personnel enseignant</CardTitle>
                        <CardDescription>Gestion du corps professoral</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Barre de filtres */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                                    <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filtrer par département" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="all">Tous les départements</SelectItem>
                                    <SelectItem value="Sciences Médicales">Sciences Médicales</SelectItem>
                                    <SelectItem value="Sciences Biologiques">Sciences Biologiques</SelectItem>
                                    <SelectItem value="Sciences Chimiques">Sciences Chimiques</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterStatut} onValueChange={setFilterStatut}>
                                    <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filtrer par statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="actif">Actif</SelectItem>
                                    <SelectItem value="suspendu">Suspendu</SelectItem>
                                    <SelectItem value="conge">En congé</SelectItem>
                                    <SelectItem value="archive">Archivé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tableau des enseignants */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Enseignant</TableHead>
                                <TableHead>Spécialité</TableHead>
                                <TableHead>Contrat</TableHead>
                                <TableHead>Date d&apos;embauche</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {teacher.prenom} {teacher.nom}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{teacher.matricule}</div>
                                                <div className="text-sm text-muted-foreground">{teacher.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{teacher.specialite}</div>
                                                <div className="text-sm text-muted-foreground">{teacher.departement}</div>
                                                <div className="text-sm text-muted-foreground">{teacher.qualification}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {teacher.typeCode && (
                                                <Badge className={getStatusColor(teacher.statut)}>
                                                {teacher.statut}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(teacher.statut)}>
                                            {teacher.statut}
                                            </Badge>
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
                                                    <DropdownMenuItem onClick={() => {}}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Voir le dossier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {}}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Contrat
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Planning
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Envoyer notification
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Contacter
                                                        </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {teacher.statut === "actif" ? (
                                                        <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {}}
                                                        >
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Suspendre
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                        className="text-green-600"
                                                        onClick={() => {}}
                                                        >
                                                        <Unlock className="mr-2 h-4 w-4" />
                                                        Réactiver
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => {}}>
                                                        <UserX className="mr-2 h-4 w-4" />
                                                        Archiver
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {}}>
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



            {/* Create Teacher Dialog */}
            <CreateTeacherDialog
                open={isCreateTeacherOpen}
                onOpenChange={setIsCreateTeacherOpen}
                onSave={handleCreateTeacher}
            />

            {/* Update Teacher Dialog */}
            <UpdateTeacherDialog
                open={isUpdateTeacherOpen}
                onOpenChange={setIsUpdateTeacherOpen}
                teacher={selectedTeacher}
                onSave={handleUpdateTeacher}
            />

            {/* Edit Teacher Dialog */}
            {/* <TeacherDialog
                open={isTeacherDialogOpen}
                onOpenChange={setIsTeacherDialogOpen}
                teacher={selectedTeacher}
                isEditing={true}
                onSave={(updatedData) => {
                    if (selectedTeacher) {
                    // setTeachers((teachers) =>
                    //   teachers.map((t) =>
                    //     t.id === selectedTeacher.id ? { ...t, ...updatedData } : t,
                    //   ),
                    // );
                    setIsTeacherDialogOpen(false);
                    setSelectedTeacher(null);
                    setFormData({});
                    }
                }}
            /> */}
        </>    
    );
};

export default TeacherTab;
