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
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import ContentLayout from "@/layout/ContentLayout";

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

    const teacherColumns: TableColumn<Teacher>[] = [
        {
            key: "teacher",
            label: "Enseignant",
            render: (_, t) => (
            <div>
                <div className="font-medium">{t.first_name} {t.last_name}</div>
                <div className="text-sm text-muted-foreground">{t.teacher_number}</div>
                <div className="text-sm text-muted-foreground">{t.email}</div>
            </div>
            ),
        },
        {
            key: "specialty",
            label: "Spécialité",
            render: (_, t) => (
            <div>
                <div className="font-medium">{t.specialty}</div>
                <div className="text-sm text-muted-foreground">{t.qualifications}</div>
            </div>
            ),
        },
        {
            key: "type_code",
            label: "Contrat",
            render: (_, t) => t.type_code ? <Badge className={getStatusColor(t.type_code)}>{t.type_code}</Badge> : "-",
        },
        {
            key: "hiring_date",
            label: "Date d'embauche",
            render: (_, t) => formatDateToText(t.hiring_date),
        },
        {
            key: "status_code",
            label: "Statut",
            render: (_, t) => <Badge className={getStatusColor(t.status_code)}>{t.status_code}</Badge>,
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, t) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {/* Voir dossier */}}>
                    <Eye className="mr-2 h-4 w-4" /> Voir dossier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* Modifier */}}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* Contrat */}}>
                    <FileText className="mr-2 h-4 w-4" /> Contrat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {/* Planning */}}>
                    <Calendar className="mr-2 h-4 w-4" /> Planning
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {t.status_code === "ACTIVE" ? (
                    <DropdownMenuItem className="text-red-600" onClick={() => {/* Suspendre */}}>
                    <Lock className="mr-2 h-4 w-4" /> Suspendre
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem className="text-green-600" onClick={() => {/* Réactiver */}}>
                    <Unlock className="mr-2 h-4 w-4" /> Réactiver
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {/* Supprimer */}}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ),
        },
    ];


    return (
        <>
            <ContentLayout
                title={`Personnel enseignant`}
                description="Gestion du corps professoral"
                actions
            >
                <ResponsiveTable
                    data={filteredTeachers}
                    columns={teacherColumns}
                    paginate={20}
                    searchKey={["first_name", "last_name", "email"]}
                    isLoading={isDataLoading}
                />
            </ContentLayout>
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
