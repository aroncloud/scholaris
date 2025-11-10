'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { Absence } from "@/types/studentmyabsencesTypes";
import MyAbsencesListSection from "@/components/features/student-my-absences/MyAbsencesListSection";
import DialogMyAbsencesViewDetail from "@/components/features/student-my-absences/modal/DialogMyAbsencesViewDetail";
import DialogCreateSubmitJustification from "@/components/features/student-my-absences/modal/DialogCreateSubmitJustification";
import { useStudentAbsenceData } from "@/hooks/feature/student-my-absences/useStudentMyAbsenceData";
import PageHeader from "@/layout/PageHeader";


export default function MyAbsencesPage() {
  const { absences, loading, refetch } = useStudentAbsenceData();
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubmitJustificationOpen, setIsSubmitJustificationOpen] = useState(false);
  const [selectedAbsences, setSelectedAbsences] = useState<number[]>([]);



  const handleViewDetails = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmitJustification = () => {
    setIsSubmitJustificationOpen(true);
  };

  const handleAbsenceSelection = (absenceId: number, checked: boolean) => {
    if (checked) {
      setSelectedAbsences([...selectedAbsences, absenceId]);
    } else {
      setSelectedAbsences(selectedAbsences.filter(id => id !== absenceId));
    }
  };

  const handleJustificationSuccess = async () => {
    setSelectedAbsences([]);
    await refetch();
  };

  return (
    <>
      {/* Header */}
      <PageHeader
        title="Mes Absences"
        description="Tableau de bord d&apos;assiduité et gestion de vos justificatifs"
      >
        <div className="flex items-center space-x-3 w-full">
          <Button
            variant="outline"
            onClick={async () => {
              await refetch();
            }}
            disabled={loading} className="flex-1"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Actualisation..." : "Actualiser"}
          </Button>

          <Button onClick={handleSubmitJustification} variant={"info"} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Soumettre un justificatif
          </Button>
        </div>
      </PageHeader>

      {/* MyAbsencesListprops */}
      <MyAbsencesListSection
        filteredAbsences={absences}
        handleViewDetails={handleViewDetails}
        handleSubmitJustification={handleSubmitJustification}
        loading = {loading}
      />

      {/* ViewDetailprops */}
      <DialogMyAbsencesViewDetail
        isDetailsDialogOpen={isDetailsDialogOpen}
        setIsDetailsDialogOpen={setIsDetailsDialogOpen}
        selectedAbsence={selectedAbsence}
        handleSubmitJustification={handleSubmitJustification}
      />

      {/* SubmitJustificationprops */}
      <DialogCreateSubmitJustification
        isSubmitJustificationOpen={isSubmitJustificationOpen}
        setIsSubmitJustificationOpen={setIsSubmitJustificationOpen}
        absencesData={absences} 
        selectedAbsences={selectedAbsences}
        handleAbsenceSelection={handleAbsenceSelection}
        onJustificationSubmitted={handleJustificationSuccess}
      />
    </>
  );
}