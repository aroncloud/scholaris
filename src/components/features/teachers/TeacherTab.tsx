/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useMemo } from "react";
import {
    Calendar,
    Edit,
    Eye,
    FileText,
    Lock,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Search,
    Trash2,
    Unlock,
} from "lucide-react";
import { CreateTeacherRequest, Teacher } from "../../../types/teacherTypes";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDateToText, getStatusColor } from "@/lib/utils";
import { DialogCreateTeacher } from "./modal/DialogCreateTeacher";
import { DialogUpdateTeacher } from "./modal/DialogUpdateTeacher";
import { createTeacher } from "@/actions/teacherActions";
import { toast } from "sonner";
import { TeacherTabSkeleton } from "./skeleton/TeacherTabSkeleton";
import { showToast } from "@/components/ui/showToast";

interface ComponentProps {
    teachers: Teacher[];
    setIExportModalOpen: (open: boolean) => void;
    setIsImportModalOpen: (open: boolean) => void;
    setIsCreateTeacherOpen: (open: boolean) => void;
    isExportModalOpen: boolean;
    isImportModalOpen: boolean;
    isCreateTeacherOpen: boolean;
    isDataLoading: boolean;
    refresh: () => void;
}


const TeacherTab = ({
    teachers,
    isCreateTeacherOpen,
    setIsCreateTeacherOpen,
    isExportModalOpen,
    setIExportModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isDataLoading,
    refresh
}: ComponentProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState("all");
    
    const [isUpdateTeacherOpen, setIsUpdateTeacherOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<CreateTeacherRequest | null>(null);
    
    const filteredTeachers = useMemo(() => {
        return teachers.filter((t) => {
            const matchesSearch =
            `${t.last_name} ${t.first_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatut =
            filterStatut === "all" || t.status_code === filterStatut;
            return matchesSearch  && matchesStatut;
        });
    }, [teachers, searchTerm, filterStatut]);
    
    const handleCreateTeacher = async (teacher: CreateTeacherRequest) => {
        const response = await createTeacher(teacher);
        console.log("Create teacher response:", response);
        if (response.code === 'success') {
            setIsCreateTeacherOpen(false);
            showToast({
                variant: "success-solid",
                message: 'Enseignant créé avec succès',
                description: `${teacher.first_name} ${teacher.last_name} a été ajouté.`,
                position: 'top-center',
            })
            refresh()
        } else {
            toast("Impossible de créer l'enseignant")
            showToast({
                variant: "error-solid",
                message: "Impossible de créer l'enseignant",
                description: response.code,
                position: 'top-center',
            })
        }
    }

    const handleUpdateTeacher = async (teacher: CreateTeacherRequest) => {
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
                            {/* Search */}
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-full"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 flex-col md:flex-row">
                                <Select value={filterStatut} onValueChange={setFilterStatut}>
                                    <SelectTrigger className="w-full md:w-48">
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
                        {
                            isDataLoading ? <TeacherTabSkeleton /> : <>
                        
                                <div className="overflow-x-auto border rounded-lg">
                                    <Table className="min-w-full border-collapse">
                                        <TableHeader className="bg-gray-100 border-b">
                                        <TableRow>
                                            <TableHead className="border-r px-4 py-2 text-left">Enseignant</TableHead>
                                            <TableHead className="border-r px-4 py-2 text-left">Spécialité</TableHead>
                                            <TableHead className="border-r px-4 py-2 text-left">Contrat</TableHead>
                                            <TableHead className="border-r px-4 py-2 text-left">Date d&apos;embauche</TableHead>
                                            <TableHead className="border-r px-4 py-2 text-left">Statut</TableHead>
                                            <TableHead className="px-4 py-2 text-left">Actions</TableHead>
                                        </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {filteredTeachers.map((teacher) => (
                                                <TableRow
                                                    key={teacher.user_code}
                                                    className="hover:bg-gray-50 border-b last:border-b-0"
                                                    >
                                                    <TableCell className="border-r px-4 py-2">
                                                        <div>
                                                            <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
                                                            <div className="text-sm text-muted-foreground">{teacher.teacher_number}</div>
                                                            <div className="text-sm text-muted-foreground">{teacher.email}</div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="border-r px-4 py-2">
                                                        <div>
                                                            <div className="font-medium">{teacher.specialty}</div>
                                                            <div className="text-sm text-muted-foreground">{teacher.qualifications}</div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="border-r px-4 py-2">
                                                        {teacher.type_code && (
                                                        <Badge className={getStatusColor(teacher.type_code)}>
                                                            {teacher.type_code}
                                                        </Badge>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="border-r px-4 py-2">
                                                        {formatDateToText(teacher.hiring_date)}
                                                    </TableCell>

                                                    <TableCell className="border-r px-4 py-2">
                                                        <Badge className={getStatusColor(teacher.status_code)}>
                                                        {teacher.status_code}
                                                        </Badge>
                                                    </TableCell>

                                                
                                                    <TableCell className=" text-center">
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
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedTeacher({
                                                                        email: teacher.email,
                                                                        first_name: teacher.first_name,
                                                                        last_name: teacher.last_name,
                                                                        gender: teacher.gender ?? "MALE",
                                                                        phone_number: teacher.phone_number ?? "",
                                                                        teacher_number: teacher.teacher_number,
                                                                        specialty: teacher.specialty,
                                                                        hiring_date: teacher.hiring_date, // à adapter si tu as la date
                                                                        salary: teacher.salary ?? 0,
                                                                        qualifications: teacher.qualifications
                                                                    });
                                                                    setIsUpdateTeacherOpen(true);
                                                                }}>
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
                                                                {teacher.status_code === "ACTIVE" ? (
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
                                </div>

                            </>
                        }

                    </CardContent>
                </Card>
            </TabsContent>



            {/* Create Teacher Dialog */}
            <DialogCreateTeacher
                open={isCreateTeacherOpen}
                onOpenChange={setIsCreateTeacherOpen}
                onSave={handleCreateTeacher}
            />

            {/* Update Teacher Dialog */}
            {(selectedTeacher && isUpdateTeacherOpen) && <DialogUpdateTeacher
                open={isUpdateTeacherOpen}
                onOpenChange={setIsUpdateTeacherOpen}
                teacher={selectedTeacher}
                onSave={handleUpdateTeacher}
            />}
        </>    
    );
};

export default TeacherTab;
