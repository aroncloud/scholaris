/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Filter,
  Search,
  Download,
  Loader2,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

// Import des fonctions et types
import { formatDateToText, getStatusColor } from "@/lib/utils";
import { showToast } from "@/components/ui/showToast";
import { getAbsencesDetail, getAbsencesList } from "@/actions/attendeesAction";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { IGetAbsencesListRequest, IGetAcademicYearsSchedulesForCurriculum, IGetJustificationDetail } from "@/types/planificationType";
import { useFactorizedProgramStore } from "@/store/programStore";
import { getListAcademicYearsSchedulesForCurriculum } from "@/actions/programsAction";
import { IGetStudentAbsence } from "@/types/absenceTypes";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminAbsenceDashboard() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | undefined>(undefined);
  const [selectedSchedule, setSelectedSchedule] = useState<string | undefined>(undefined);
  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { academicYears, selectedAcademicYear, setSelectedAcademicYear } = useAcademicYearStore();
  const [absences, setAbsences] = useState<IGetStudentAbsence[]>([]);

  const [selectedAbsence, setSelectedAbsence] = useState<IGetStudentAbsence | null>(null);
  const [selectedJustification, setSelectedJustification] = useState<IGetJustificationDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    action: '' as 'APPROVE' | 'REJECT' | '',
    comment: ''
  });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
    // Logique pour charger les séquences...
    const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
    if (result.code === 'success') {
      setScheduleList(result.data.body);
    }
  }

  const loadStudentAbsences = useCallback(async () => {
    if (selectedCurriculum && selectedSchedule) {
      setIsLoadingData(true);
      const payload: IGetAbsencesListRequest = {
        curriculumn_code: selectedCurriculum,
        limit: 100,
        offset: 0,
        schedule_code: selectedSchedule
      };
      const result = await getAbsencesList(payload);
      if (result.code === 'success') {
        setAbsences(result.data.body);
      } else {
        setAbsences([]);
        showToast({
          variant: "error-solid",
          message: "Erreur",
          description: "Impossible de charger les absences.",
        });
      }
      setIsLoadingData(false);
    }
  }, [selectedCurriculum, selectedSchedule]);

  useEffect(() => {
    if (selectedCurriculum && selectedAcademicYear) {
      fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
    }
  }, [selectedAcademicYear, selectedCurriculum]);

  // Fonctions de gestion des actions
  const handleViewDetails = async (absence: IGetStudentAbsence) => {
    console.log('-->absence', absence)
    const result = await getAbsencesDetail(absence.absence_code);
    if(result.code === 'success' && result.data.body) {
      setSelectedJustification(result.data.body);
    }
    console.log('-->absence detail', result);
    setSelectedAbsence(absence);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (absence: IGetStudentAbsence) => {
    setSelectedAbsence(absence);
    setIsApproveModalOpen(true);
  };

  const handleReject = (absence: IGetStudentAbsence) => {
    setSelectedAbsence(absence);
    setIsRejectModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedAbsence) return;
    // TODO: Implémenter la logique d'appel API pour approuver l'absence
    console.log("Approving absence:", selectedAbsence.absence_code);
    showToast({ variant: "success-solid", message: "Absence approuvée avec succès." });
    setIsApproveModalOpen(false);
    setSelectedAbsence(null);
    // Optionnel: Recharger les données pour refléter le changement de statut
    // loadStudentAbsences(); 
  };

  const confirmReject = () => {
    if (!selectedAbsence) return;
    // TODO: Implémenter la logique d'appel API pour rejeter l'absence
    console.log("Rejecting absence:", selectedAbsence.absence_code);
    showToast({ variant: "error-solid", message: "Absence rejetée." });
    setIsRejectModalOpen(false);
    setSelectedAbsence(null);
     // Optionnel: Recharger les données pour refléter le changement de statut
    // loadStudentAbsences();
  };

  const handleReviewSubmit = async () => {
    
  };
  // Définition des colonnes pour la ResponsiveTable
  const absenceColumns: TableColumn<IGetStudentAbsence>[] = [
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
        return <Badge className={getStatusColor(status) + "capitalize"}>{status?.toLowerCase() || 'N/A'}</Badge>;
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
            <DropdownMenuItem onClick={() => handleApprove(absence)} className="text-green-600 focus:text-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReject(absence)} className="text-red-600 focus:text-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Absences</h1>
            <p className="text-muted-foreground mt-1">
              Vue d'ensemble et traitement des absences des étudiants.
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Curriculum" /></SelectTrigger>
                  <SelectContent className="w-full">
                    {curriculumList.map((c) => (
                      <SelectItem key={c.curriculum_code} value={c.curriculum_code}>{c.curriculum_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Séquence" /></SelectTrigger>
                  <SelectContent className="w-full">
                    {scheduleList.map((ays) => (
                      <SelectItem key={ays.schedule_code} value={ays.schedule_code}>{ays.sequence_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={loadStudentAbsences} disabled={isLoadingData || !selectedCurriculum || !selectedSchedule}>
                  {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Charger
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Liste des Absences
              </span>
              <Badge variant="secondary">{absences.length} absence(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveTable
              columns={absenceColumns}
              data={absences}
              searchKey={["last_name", "first_name", "student_number", "course_unit_name"]}
              paginate={10}
            />
          </CardContent>
        </Card>
      </div>

    

      {
        (selectedAbsence && selectedJustification) && 
        <>

          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAbsence?.status_code === 'PENDING' ? (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      Traiter la justification
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5" />
                      Détails de la justification
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {selectedAbsence && (
                    <div className="space-y-2 ">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{selectedAbsence.first_name} {selectedAbsence.last_name}</span>
                        <span>•</span>
                        <span>{selectedAbsence.status_code}</span>
                        <span>•</span>
                        <span>{selectedAbsence.course_unit_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>{formatDateToText(selectedAbsence.recorded_at)}</span>
                        <span>•</span>
                        <span>{selectedAbsence.start_time} - </span>
                      </div>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Détails de l'étudiant */}

                {/* Détails de la justification */}
                {/* {selectedJustification?.absence_status !== 'NOT_SUBMITTED' && ( */}
                  <div className="space-y-4">
                    <div>
                      <Label className=" font-medium text-gray-700">Motif de l'absence</Label>
                      <div className="mt-1 p-3 bg-white border rounded-md ">
                        {selectedJustification?.justification?.reason}
                      </div>
                    </div>

                  </div>

                {/* Formulaire de traitement pour les justifications en attente */}
                {/* {selectedAbsence?.status_code === 'PENDING' && ( */}
                  <div className="space-y-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Décision</h4>
                    
                    <div>
                      <Label className=" font-medium text-gray-700">Action *</Label>
                      <Select 
                        value={reviewData.action} 
                        onValueChange={(value: 'APPROVE' | 'REJECT') => setReviewData(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Sélectionnez une action" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="APPROVE">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              Approuver la justification
                            </div>
                          </SelectItem>
                          <SelectItem value="REJECT">
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              Rejeter la justification
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className=" font-medium text-gray-700">Commentaire pour l'étudiant *</Label>
                      <Textarea
                        placeholder={reviewData.action === 'APPROVE' 
                          ? "Expliquez pourquoi la justification est acceptée..."
                          : "Expliquez pourquoi la justification est rejetée et donnez des conseils..."
                        }
                        value={reviewData.comment}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                        className="mt-1"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Ce commentaire sera visible par l'étudiant. Soyez constructif et précis.
                      </p>
                    </div>
                  </div>
                {/* )} */}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  {selectedAbsence?.status_code === 'PENDING' ? 'Annuler' : 'Fermer'}
                </Button>
                
                {selectedAbsence?.status_code === 'PENDING' && (
                  <Button
                    onClick={handleReviewSubmit}
                    disabled={isSubmitting || !reviewData.action || !reviewData.comment.trim()}
                    className={`flex items-center gap-2 ${
                      reviewData.action === 'APPROVE' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : reviewData.action === 'REJECT'
                        ? 'bg-red-600 hover:bg-red-700'
                        : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : reviewData.action === 'APPROVE' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    {isSubmitting 
                      ? 'Traitement...' 
                      : reviewData.action === 'APPROVE' 
                      ? 'Approuver' 
                      : 'Rejeter'
                    }
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        
        </>
      }
    </div>
  );
}