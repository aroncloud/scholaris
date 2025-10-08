/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FileText,
  Search,
  Loader2,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FilterIcon,
} from "lucide-react";

// Import des fonctions et types
import { formatDateToText, getStatusColor } from "@/lib/utils";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { useFactorizedProgramStore } from "@/store/programStore";
import { IGetStudentAbsence } from "@/types/absenceTypes";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import { DialogReviewJustification } from "@/components/features/attendee/DialogReviewJustification";
import PageHeader from "@/layout/PageHeader";
import ContentLayout from "@/layout/ContentLayout";
import { Combobox } from "@/components/ui/Combobox";
import { useAbsenceData } from "@/hooks/feature/attendance/useAbsenceData";

export default function AdminAbsenceDashboard() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | undefined>(undefined);
  const [selectedSchedule, setSelectedSchedule] = useState<string | undefined>(undefined);
  const { factorizedPrograms } = useFactorizedProgramStore();
  const { selectedAcademicYear } = useAcademicYearStore();

  const [selectedAbsence, setSelectedAbsence] = useState<IGetStudentAbsence | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isLoadingJustification, setIsLoadingJustification] = useState(false);

  // Utilisation du custom hook
  const {
    absences,
    scheduleList,
    isLoadingData,
    hasSearched,
    selectedJustification,
    loadAbsences,
    loadJustificationDetail,
    handleReviewJustification,
    setSelectedJustification
  } = useAbsenceData(selectedCurriculum, selectedSchedule, selectedAcademicYear);

  console.log('--absences', absences)
  console.log('--selectedJustification', selectedJustification)
  // Mémorisation de la liste des curriculums
  const curriculumList = useMemo(() =>
    factorizedPrograms.flatMap((fp) => fp.curriculums),
    [factorizedPrograms]
  );

  // Fonction pour voir les détails
  const handleViewDetails = async (absence: IGetStudentAbsence) => {
    setSelectedAbsence(absence);
    setIsReviewDialogOpen(true);
    setIsLoadingJustification(true);

    await loadJustificationDetail(absence.absence_code);
    setIsLoadingJustification(false);
  };

  // Fonction pour soumettre la review
  const handleReviewSubmit = async (action: 'APPROVE' | 'REJECT', comment: string) => {
    if (!selectedJustification) return;

    const success = await handleReviewJustification(
      action,
      selectedJustification.justification.justification_code,
      comment
    );

    if (success) {
      setIsReviewDialogOpen(false);
      setSelectedAbsence(null);
      setSelectedJustification(null);
    }
  };

  // Fermeture du dialog
  const handleDialogClose = (open: boolean) => {
    setIsReviewDialogOpen(open);
    if (!open) {
      setSelectedAbsence(null);
      setSelectedJustification(null);
    }
  };

  // Colonnes du tableau mémorisées
  const absenceColumns: TableColumn<IGetStudentAbsence>[] = useMemo(() => [
    {
      key: "last_name",
      label: "Étudiant",
      render: (_, absence) => (
        <div>
          <div className="font-medium">{absence.last_name} {absence.first_name}</div>
          <div className=" text-muted-foreground">{absence.student_number}</div>
        </div>
      ),
    },
    {
      key: "course_unit_name",
      label: "Cours / Séance",
      render: (_, absence) => (
        <div>
          <div className="font-medium">{absence.course_unit_name}</div>
          <div className=" text-muted-foreground">{absence.session_title}</div>
        </div>
      ),
    },
    {
      key: "recorded_at",
      label: "Date / Heure",
      render: (_, absence) => (
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDateToText(absence.recorded_at)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{absence.start_time}</span>
          </div>
        </div>
      )
    },
    {
      key: "status_code",
      label: "Statut",
      render: (status) => {
        return <Badge className={getStatusColor(status) + " capitalize"}>{status?.toLowerCase() || 'N/A'}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, absence) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(absence)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleViewDetails(absence)}
              className="text-green-600 focus:text-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewDetails(absence)}
              className="text-red-600 focus:text-red-700"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  return (
    <div>
      <div className=" mx-auto space-y-6">
        <PageHeader
          title="GESTION DES ABSCENCES"
          description="Vue d'ensemble et traitement des absences des étudiants."
        />
        <div className="p-6 space-y-6">
          <ContentLayout
            icon={<FilterIcon className="h-6 w-6" />}
            title="Filtres"
            description="Affinez les résultats en filtrant par curriculum et séquence, puis chargez les données correspondantes."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Combobox
                options={curriculumList.map(curriculum => ({
                    value: curriculum.curriculum_code,
                    label: curriculum.curriculum_name
                }))}
                value={selectedCurriculum}
                onChange={setSelectedCurriculum}
                placeholder="Sélectionner un curriculum"
                className='py-5'
              />
              <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Séquence" /></SelectTrigger>
                <SelectContent className="w-full">
                  {scheduleList.map((ays) => (
                    <SelectItem key={ays.schedule_code} value={ays.schedule_code}>{ays.sequence_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={loadAbsences} disabled={isLoadingData || !selectedCurriculum || !selectedSchedule} variant={'info'}>
                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Charger
              </Button>
            </div>
          </ContentLayout>


          <ContentLayout
            title="Liste des Absences"
            description={`${absences.length} absence(s)`}
          >
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Chargement des absences...</p>
                  <p className="text-sm text-muted-foreground">Veuillez patienter pendant la récupération des données</p>
                </div>
              </div>
            ) : !hasSearched ? (
              <div className="border-2 border-dashed rounded-xl bg-blue-50/50">
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                  <div className="rounded-full bg-background p-5 border shadow-sm">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Commencez votre recherche d'absences
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pour afficher les données, veuillez sélectionner un{' '}
                      <span className="font-semibold text-primary/90">curriculum</span> et une{' '}
                      <span className="font-semibold text-primary/90">séquence</span> dans les filtres
                      ci-dessus, puis cliquez sur{' '}
                      <span className="font-semibold text-primary/90">Charger</span>.
                    </p>
                  </div>
                </div>
              </div>
            ) : absences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="rounded-full bg-muted p-6">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-lg font-medium">Aucune absence trouvée</p>
                  <p className="text-sm text-muted-foreground">
                    Aucune absence n'a été enregistrée pour le curriculum et la séquence sélectionnés. Essayez de modifier vos filtres de recherche.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveTable
                columns={absenceColumns}
                data={absences}
                searchKey={["last_name", "first_name", "student_number", "course_unit_name"]}
                paginate={10}
              />
            )}
          </ContentLayout>
        </div>
      </div>

      {selectedAbsence && (
        <DialogReviewJustification
          onOpenChange={handleDialogClose}
          open={isReviewDialogOpen}
          absence={selectedAbsence}
          justification={selectedJustification}
          isLoading={isLoadingJustification}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
