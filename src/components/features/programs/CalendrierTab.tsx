/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import LoadingSpinner from "@/components/LoadingSpinner"
import Badge from '@/components/custom-ui/Badge'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { useAcademicYears } from "@/hooks/feature/planifincation/useAcademicYears"
import { cn, formatDateToText, getStatusColor } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar, Edit, Eye, FileText, Loader2, Lock, MoreHorizontal, Plus, Trash2, Unlock } from "lucide-react"
import { useState } from "react"
import DialogCreateAcademicYear from "./Modal/DialogCreateAcademicYear"
import { ICreateAcademicYear, IGetAcademicYears } from "@/types/planificationType"
import { createAcademicYear } from "@/actions/planificationAction"
import { showToast } from "@/components/ui/showToast"
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable"
import ContentLayout from "@/layout/ContentLayout"

interface MyProps {
    academicYears: IGetAcademicYears[]
    isLoading: boolean;
    fetchAcademicYear: () => Promise<void>
}

const CalendrierTab = ({academicYears, fetchAcademicYear, isLoading} : MyProps) => {

    const [isCreateYearDialogOpen, setIsCreateYearDialogOpen] = useState(false);


    const handleCreateAcademicYear = async (data: ICreateAcademicYear) => {
        console.log('data', data)
        const result = await createAcademicYear(data);
        if (result.code === 'success') {
            setIsCreateYearDialogOpen(false);
            showToast({
                variant: "success-solid",
                message: 'Année académique créée avec succès',
                description: `L'année academique a été crée avec succès`,
                position: 'top-center',
            });
            fetchAcademicYear()
            // refreshData(session.curriculum_code)
            return true
        } else {
            showToast({
            variant: "error-solid",
            message: "Impossible de créer la salle de classe",
            description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
            position: 'top-center',
            });
        }
        return false
    }

    const academicYearColumns: TableColumn<IGetAcademicYears>[] = [
        {
            key: "year_code",
            label: "Code",
            render: (_, year) => (
            <div>
                <div className="font-medium">{year.year_code}</div>
                <div className="text-sm text-muted-foreground">{year.academic_year_code}</div>
            </div>
            ),
        },
        {
            key: "start_date",
            label: "Date de début",
            render: (_, year) => formatDateToText(year.start_date),
        },
        {
            key: "end_date",
            label: "Date de fin",
            render: (_, year) => formatDateToText(year.end_date),
        },
        {
            key: "status_code",
            label: "Statut",
            render: (_, year) => (
            <Badge
                variant={year.status_code === "IN_PROGRESS" ? "success" : year.status_code === "COMPLETED" ? "info" : "neutral"}
                size="sm"
                value={year.status_code}
                label={year.status_code}
            />
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, year) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" /> Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> Générer rapport
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" /> Calendrier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {year.status_code === "IN_PROGRESS" ? (
                    <DropdownMenuItem className="text-red-600">
                    <Lock className="mr-2 h-4 w-4" /> Clôturer
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem className="text-green-600">
                    <Unlock className="mr-2 h-4 w-4" /> Rouvrir
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ),
        },
    ];


    return (
        <div>
            <ContentLayout
                title="Calendrier académique"
                description="Planning des périodes d&apos;enseignement et d&apos;évaluation"
                actions={
                    <>
                    <Button
                        onClick={() => setIsCreateYearDialogOpen(true)}
                        className="text-sm w-full sm:w-fit"
                        variant={"info"}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle année académique
                    </Button></>
                }
            >
                <ResponsiveTable
                    columns={academicYearColumns}
                    data={academicYears}
                    paginate={20}
                    searchKey={["year_code", "academic_year_code"]}
                    isLoading={isLoading}
                />
            </ContentLayout>


            <DialogCreateAcademicYear
                onOpenChange={setIsCreateYearDialogOpen}
                open={isCreateYearDialogOpen}
                onSave={handleCreateAcademicYear}
            />
        </div>
    )
}

export default CalendrierTab