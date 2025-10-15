/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { v4 as uuidv4 } from "uuid"
import { 
  Plus,
  X,
  Save,
  DollarSign,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { useFactorizedProgramStore } from "@/store/programStore"
import PageHeader from "@/layout/PageHeader"
import PlanCard from "@/components/features/payment/Cards/PlanCard"
import ContentLayout from "@/layout/ContentLayout"
import { useAcademicYearStore } from "@/store/useAcademicYearStore"
import { Combobox } from "@/components/ui/Combobox"
import DialogCreatePlan from "@/components/features/payment/DialogCreatePlan"
import { showToast } from "@/components/ui/showToast"

// Types
interface Echeance {
  id: string
  libelle: string
  pourcentage: number
  dateEcheance: string
}

interface GrilleTarifaire {
  id: string
  filiere: string
  niveau: string
  anneeAcademique: string
  montantTotal: number
  echeances: Echeance[]
  statut: "ACTIVE" | "BROUILLON"
}

const filieres = [
  "Informatique", "Gestion", "Finance", "Marketing", "Commerce International",
  "Droit", "Architecture", "Médecine", "Pharmacie", "Génie Civil",
  "Génie Électrique", "Génie Mécanique", "Télécommunications", "Réseaux",
  "Cybersécurité", "Data Science", "Intelligence Artificielle", "Design Graphique"
]

const niveaux = ["L1", "L2", "L3", "M1", "M2"]

const anneesAcademiques = ["2024-2025", "2025-2026", "2026-2027"]

// Données exemple
const grillesInitiales: GrilleTarifaire[] = [
  {
    id: "1",
    filiere: "Informatique",
    niveau: "L1",
    anneeAcademique: "2024-2025",
    montantTotal: 400000,
    statut: "ACTIVE",
    echeances: [
      { id: "e1", libelle: "Inscription", pourcentage: 40, dateEcheance: "2024-09-15" },
      { id: "e2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "2024-12-15" },
      { id: "e3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "2025-03-15" }
    ]
  },
  {
    id: "2",
    filiere: "Informatique",
    niveau: "L2",
    anneeAcademique: "2024-2025",
    montantTotal: 450000,
    statut: "ACTIVE",
    echeances: [
      { id: "e4", libelle: "1ère Tranche", pourcentage: 50, dateEcheance: "2024-09-15" },
      { id: "e5", libelle: "2ème Tranche", pourcentage: 50, dateEcheance: "2025-01-15" }
    ]
  },
  {
    id: "3",
    filiere: "Gestion",
    niveau: "L1",
    anneeAcademique: "2024-2025",
    montantTotal: 380000,
    statut: "ACTIVE",
    echeances: [
      { id: "e6", libelle: "Inscription", pourcentage: 35, dateEcheance: "2024-09-10" },
      { id: "e7", libelle: "2ème Tranche", pourcentage: 35, dateEcheance: "2024-12-10" },
      { id: "e8", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "2025-03-10" }
    ]
  }
]

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

export default function GrilleTarifairePage() {
  const [grilles, setGrilles] = useState<GrilleTarifaire[]>(grillesInitiales)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGrille, setEditingGrille] = useState<GrilleTarifaire | null>(null)
  const { planData, listAllPlan, loadingFinData, listAllFeeTypes, feeList, createPlanWithInstallments, processingFinData } = useFinancialData()
  

  
  // Form state
  const [filiere, setFiliere] = useState("")
  const [niveau, setNiveau] = useState("")
  const [anneeAcademique, setAnneeAcademique] = useState("")
  const [montantTotal, setMontantTotal] = useState("")
  const [echeances, setEcheances] = useState<Echeance[]>([
    { id: "1", libelle: "Inscription", pourcentage: 40, dateEcheance: "" },
    { id: "2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "" },
    { id: "3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "" }
  ])
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>("")


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
    const newEcheance: Echeance = {
      id: Date.now().toString(),
      libelle: `${echeances.length + 1}ème Tranche`,
      pourcentage: 0,
      dateEcheance: ""
    }
    setEcheances([...echeances, newEcheance])
  }

  const handleSupprimerEcheance = (id: string) => {
    if (echeances.length > 1) {
      setEcheances(echeances.filter(e => e.id !== id))
    }
  }

  const handleUpdateEcheance = (id: string, field: keyof Echeance, value: any) => {
    setEcheances(echeances.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ))
  }

  const calculerMontantEcheance = (pourcentage: number) => {
    if (!montantTotal) return 0
    return (parseFloat(montantTotal) * pourcentage) / 100
  }

  const totalPourcentage = echeances.reduce((acc, e) => acc + (e.pourcentage || 0), 0)
  const isFormValid = filiere && niveau && anneeAcademique && montantTotal && totalPourcentage === 100 && echeances.every(e => e.dateEcheance)

  const handleSauvegarder = () => {
    const nouvelleGrille: GrilleTarifaire = {
      id: editingGrille?.id || Date.now().toString(),
      filiere,
      niveau,
      anneeAcademique,
      montantTotal: parseFloat(montantTotal),
      statut: "ACTIVE",
      echeances: echeances
    }

    if (editingGrille) {
      setGrilles(grilles.map(g => g.id === editingGrille.id ? nouvelleGrille : g))
    } else {
      setGrilles([...grilles, nouvelleGrille])
    }

    handleReset()
  }

  const handleReset = () => {
    setIsDialogOpen(false)
    setEditingGrille(null)
    setFiliere("")
    setNiveau("")
    setAnneeAcademique("")
    setMontantTotal("")
    setEcheances([
      { id: "1", libelle: "Inscription", pourcentage: 40, dateEcheance: "" },
      { id: "2", libelle: "2ème Tranche", pourcentage: 30, dateEcheance: "" },
      { id: "3", libelle: "3ème Tranche", pourcentage: 30, dateEcheance: "" }
    ])
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

  const handleSupprimer = (id: string) => {
    setGrilles(grilles.filter(g => g.id !== id))
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

      {/* Nouveau Dialog avec react-hook-form */}
      <DialogCreatePlan
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        curriculumList={curriculumList}
        feeList={feeList}
        onSubmit={handleCreatePlan}
        isLoading={processingFinData}
      />

    </div>
  )
}