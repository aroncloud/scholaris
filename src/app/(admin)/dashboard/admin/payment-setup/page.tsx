/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { v4 as uuidv4 } from "uuid"
import { 
  Plus,
  DollarSign,
  Filter,
} from "lucide-react"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { useFactorizedProgramStore } from "@/store/programStore"
import PageHeader from "@/layout/PageHeader"
import PlanCard from "@/components/features/payment/Cards/PlanCard"
import ContentLayout from "@/layout/ContentLayout"
import { useAcademicYearStore } from "@/store/useAcademicYearStore"
import { Combobox } from "@/components/ui/Combobox"
import DialogCreatePlan from "@/components/features/payment/DialogCreatePlan"
import DialogEditPlan from "@/components/features/payment/DialogEditPlan"
import DialogEditInstallment from "@/components/features/payment/DialogEditInstallment"
import DialogAddInstallment from "@/components/features/payment/DialogAddInstallment"
import { showToast } from "@/components/ui/showToast"
import { IGetPlan, IInstallment } from "@/types/financialTypes"


export default function GrilleTarifairePage() {
  const {
    planData,
    listAllPlan,
    loadingFinData,
    listAllFeeTypes,
    feeList,
    createPlanWithInstallments,
    processingFinData,
    updatePlan,
    deletePlan,
    addInstallmentToExistingPlan,
    updateInstallment,
    deleteInstallment
  } = useFinancialData()
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // États pour les dialogs d'édition
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<IGetPlan | null>(null)

  const [isEditInstallmentDialogOpen, setIsEditInstallmentDialogOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<IInstallment | null>(null)

  const [isAddInstallmentDialogOpen, setIsAddInstallmentDialogOpen] = useState(false)
  const [selectedFeeCode, setSelectedFeeCode] = useState<string>("")


  const { selectedAcademicYear, academicYears } = useAcademicYearStore();
  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  useEffect(() => {
    listAllPlan();
    listAllFeeTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtrer les plans par programme
  const filteredPlanData = selectedProgramFilter
    ? planData.filter(plan => {
        const curriculum = curriculumList.find(c => c.curriculum_code === plan.curriculum_code);
        return curriculum?.program_code === selectedProgramFilter;
      })
    : planData;

  // Options pour le combobox des programmes
  const programOptions = factorizedPrograms.map(fp => ({
    value: fp.program.program_code,
    label: fp.program.program_name
  }));

  const handleAjouterEcheance = () => {
    
  }

  const handleSupprimerEcheance = (id: string) => {

  }

  const handleUpdateEcheance = (id: string) => {
    
  }

  const calculerMontantEcheance = (pourcentage: number) => {
  }


  const handleSauvegarder = () => {
    
  }

  const handleReset = () => {
   
  }

  const handleCreatePlan = async (data: any) => {
    const result = await createPlanWithInstallments(data);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Création réussie",
        description: "La grille tarifaire a été créée avec succès",
        position: "top-center",
      });

      // Rafraîchir la liste des plans
      listAllPlan();

      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de la création de la grille tarifaire",
        position: "top-center",
      });

      return false;
    }
  }

  const handleDeletePlan = async (fee_code: string) => {
    // Confirmation avant suppression
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette grille tarifaire ? Cette action est irréversible.")) {
      return;
    }

    const result = await deletePlan(fee_code);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Suppression réussie",
        description: "La grille tarifaire a été supprimée avec succès",
        position: "top-center",
      });
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de la suppression de la grille tarifaire",
        position: "top-center",
      });
    }
  }

  const handleEditPlan = (plan: IGetPlan) => {
    setSelectedPlan(plan);
    setIsEditPlanDialogOpen(true);
  }

  const handleSubmitEditPlan = async (feeCode: string, data: { total_amount?: string; is_active?: number }) => {
    const result = await updatePlan(feeCode, data);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Plan mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
        position: "top-center",
      });
      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de la mise à jour du plan",
        position: "top-center",
      });
      return false;
    }
  }

  const handleEditInstallment = (installment: IInstallment) => {
    setSelectedInstallment(installment);
    setIsEditInstallmentDialogOpen(true);
  }

  const handleSubmitEditInstallment = async (
    installmentCode: string,
    data: { title?: string; amount?: number; due_date?: string }
  ) => {
    const result = await updateInstallment(installmentCode, data);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Échéance mise à jour",
        description: "Les modifications ont été enregistrées avec succès",
        position: "top-center",
      });
      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de la mise à jour de l'échéance",
        position: "top-center",
      });
      return false;
    }
  }

  const handleDeleteInstallment = async (installmentCode: string) => {
    const result = await deleteInstallment(installmentCode);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Échéance supprimée",
        description: "L'échéance a été supprimée avec succès",
        position: "top-center",
      });
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de la suppression de l'échéance",
        position: "top-center",
      });
    }
  }

  const handleAddInstallment = (feeCode: string) => {
    setSelectedFeeCode(feeCode);
    setIsAddInstallmentDialogOpen(true);
  }

  const handleSubmitAddInstallment = async (data: {
    fee_code: string;
    type_code: string;
    title: string;
    amount: number;
    due_date: string;
  }) => {
    const result = await addInstallmentToExistingPlan(data);

    if (result.code === "success") {
      showToast({
        variant: "success-solid",
        message: "Échéance ajoutée",
        description: "Une nouvelle échéance a été ajoutée au plan",
        position: "top-center",
      });
      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: result.error || "Erreur lors de l'ajout de l'échéance",
        position: "top-center",
      });
      return false;
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Gestion des frais universirtaires"
        description="Configurez les droits universitaires pour chacun des curriculums"
        Icon={DollarSign}
        // loading={loadingFinData}
      >
        <Button
          size="lg"
          className="gap-2 w-full sm:w-auto"
          variant={"info"}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nouvelle Grille
        </Button>
      </PageHeader>

      <ContentLayout
        title={academicYears.find(item => (item.academic_year_code ==  selectedAcademicYear))?.year_code}
        description = {filteredPlanData.length + " grille(s) configurée(s)"}
        className="p-6"
        actions = {
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Filtrer par programme :
              </Label>
              <div className="w-full sm:w-80">
                <Combobox
                  value={selectedProgramFilter}
                  onChange={setSelectedProgramFilter}
                  options={[
                    { value: "", label: "Tous les programmes" },
                    ...programOptions
                  ]}
                  placeholder="Sélectionner un programme..."
                />
              </div>
            </div>
          </div>
        }
      >
        {/* Filtre par programme */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
          {filteredPlanData.map((plan) => (
            <PlanCard
              key={uuidv4()}
              plan={plan}
              curriculumName={curriculumList.find(item => item.curriculum_code ==  plan.curriculum_code)?.curriculum_name}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
              onEditInstallment={handleEditInstallment}
              onAddInstallment={handleAddInstallment}
            />
          ))}
        </div>

        {filteredPlanData.length === 0 && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucune grille trouvée
              </h3>
              <p className="text-slate-500 mb-6">
                Essayez de modifier vos filtres ou créez une nouvelle grille
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une grille
              </Button>
            </CardContent>
          </Card>
        )}

      </ContentLayout>

      {/* Dialog de création */}
      <DialogCreatePlan
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        curriculumList={curriculumList}
        onSubmit={handleCreatePlan}
        isLoading={processingFinData}
      />

      {/* Dialog d'édition d'un plan */}
      <DialogEditPlan
        open={isEditPlanDialogOpen}
        onOpenChange={setIsEditPlanDialogOpen}
        plan={selectedPlan}
        curriculumName={
          selectedPlan
            ? curriculumList.find(item => item.curriculum_code === selectedPlan.curriculum_code)?.curriculum_name
            : undefined
        }
        onSubmit={handleSubmitEditPlan}
        isLoading={processingFinData}
      />

      {/* Dialog d'édition d'une échéance */}
      <DialogEditInstallment
        open={isEditInstallmentDialogOpen}
        onOpenChange={setIsEditInstallmentDialogOpen}
        installment={selectedInstallment}
        onSubmit={handleSubmitEditInstallment}
        onDelete={handleDeleteInstallment}
        isLoading={processingFinData}
      />

      {/* Dialog d'ajout d'une échéance */}
      <DialogAddInstallment
        open={isAddInstallmentDialogOpen}
        onOpenChange={setIsAddInstallmentDialogOpen}
        feeCode={selectedFeeCode}
        onSubmit={handleSubmitAddInstallment}
        isLoading={processingFinData}
      />

    </div>
  )
}