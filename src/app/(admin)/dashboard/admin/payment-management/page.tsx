"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, Download, Search, CheckCircle2, Clock, Users, GraduationCap, MoreVertical } from "lucide-react"
import { useFactorizedProgramStore } from "@/store/programStore"
import PageHeader from "@/layout/PageHeader"
import ContentLayout from "@/layout/ContentLayout"
import StatCard from "@/components/cards/StatCard"
import { Combobox } from "@/components/ui/Combobox"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable"
import { IRecordDeposit, IStudentGetFinancialInfo } from "@/types/financialTypes"
import { Avatar } from "@/components/custom-ui/Avatar"
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import DialogRecordDeposit from "@/components/features/financial/DialogRecordDeposit"
import { showToast } from "@/components/ui/showToast"

interface FinancialDataWrapper extends IStudentGetFinancialInfo {
  isPaidOff: boolean;
}

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

export default function GestionScolaritePage() {
  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("")
  const [searchProgram, setSearchProgram] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<FinancialDataWrapper | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { factorizedPrograms } = useFactorizedProgramStore()
  const { getCurriculumFinancialsInfo, finData, loadingFinData, setFinData, recordDeposite } = useFinancialData()

  useEffect(() => {
    if(selectedCurriculum) {
      getCurriculumFinancialsInfo(selectedCurriculum)
    }
  }, [selectedCurriculum, getCurriculumFinancialsInfo])

  const wrappedData: FinancialDataWrapper[] = useMemo(() => 
    finData.map(item => ({
      ...item,
      isPaidOff: item.remaining_balance === 0
    })),
    [finData]
  )

  const stats = useMemo(() => {
    const total = wrappedData.reduce((acc, curr) => acc + curr.total_due, 0)
    const paid = wrappedData.reduce((acc, curr) => acc + curr.total_paid, 0)
    const remaining = wrappedData.reduce((acc, curr) => acc + curr.remaining_balance, 0)
    
    return {
      students: wrappedData.length,
      total,
      paid,
      remaining
    }
  }, [wrappedData])

  const handleRecordDeposit = async (deposit: IRecordDeposit) => {
    console.log("-->deposit", deposit)
    const result = await recordDeposite(deposit);
    console.log('-->result', result)
    if(result.code == "success") {
      showToast({
        variant: "success-solid",
        message: 'Enregistrement',
        description: 'La transaction a été enregistré avec succès',
        position: 'top-center',
      });
      if(selectedCurriculum) {
       getCurriculumFinancialsInfo(selectedCurriculum)
      }

      return true
    } else {
      
      showToast({
        variant: "error-solid",
        message: 'Enregistrement',
        description: result.error || "Erreur lors l'enregistrement de la transaction",
        position: 'top-center',
      });
    }

    return false
  }

  const filteredPrograms = useMemo(() => 
    factorizedPrograms.filter(p => 
      p.program.program_name.toLowerCase().includes(searchProgram.toLowerCase())
    ),
    [factorizedPrograms, searchProgram]
  )

  const columns: TableColumn<FinancialDataWrapper>[] = useMemo(() => [
    {
      key: "enrollment.first_name",
      label: "Étudiant",
      priority: 'high',
      render: (_, data) => (
        <div className="flex items-center gap-3">
          <Avatar
            fallback={`${data.enrollment.first_name} ${data.enrollment.last_name}`}
            variant={data.isPaidOff ? 'success' : data.total_paid === 0 ? 'danger' : 'warning'}
          />
          <div>
            <div className="font-semibold text-gray-900">
              {data.enrollment.first_name} {data.enrollment.last_name}
            </div>
            <div className="text-sm text-gray-500">{data.enrollment.student_number}</div>
          </div>
        </div>
      ),
    },
    {
      key: "total_due",
      label: "Total",
      priority: 'high',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.total_due}</span> <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "total_paid",
      label: "Perçu",
      priority: 'high',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.total_paid}</span> <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "remaining_balance",
      label: "Reste",
      priority: 'high',
      render: (_, data) => (
        <span>
          <span className="text-lg font-bold">{data.remaining_balance}</span> <span className="text-sm text-gray-600">FCFA</span>
        </span>
      ),
    },
    {
      key: "isPaidOff",
      label: "Statut",
      priority: 'medium',
      render: (_, data) => (
        <Badge 
          value={data.isPaidOff ? "Soldé" : "Non soldé"} 
          variant={data.isPaidOff ? "success" : "danger"} 
          size="sm" 
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      priority: 'medium',
      render: (_, data) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStudent(data);
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>Enregistrer un paiement</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                console.log("Voir historique:", data)
              }}
              className="gap-2 cursor-pointer"
            >
              <span>Voir l&apos;historique</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const handleBack = () => {
    setSelectedProgram("")
    setSelectedCurriculum("")
    setFinData([])
  }

  const currentCurriculums = useMemo(() => 
    factorizedPrograms
      .find(p => p.program.program_code === selectedProgram)
      ?.curriculums.map(c => ({value: c.curriculum_code, label: c.curriculum_name})) ?? [],
    [factorizedPrograms, selectedProgram]
  )

  return (
    <>
      <PageHeader
        Icon={DollarSign}
        title="Gestion des Paiements"
        description="Gérez les paiements de scolarité de vos étudiants"
      />
      
      <div className="p-6">
        <ContentLayout
          title={!selectedProgram ? "Programmes académiques" : "Gestion financière"}
          description={!selectedProgram ? "Sélectionnez un programme" : ""}
        >
          {!selectedProgram ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un programme..."
                  value={searchProgram}
                  onChange={(e) => setSearchProgram(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((item) => (
                  <button
                    key={item.program.program_code}
                    onClick={() => setSelectedProgram(item.program.program_code)}
                    className="group relative p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-left hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Cercle décoratif */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                        <GraduationCap className="h-7 w-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                        {item.program.program_name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-blue-100">
                        <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                          {item.curriculums.length} niveau{item.curriculums.length > 1 ? 'x' : ''}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Button variant="outline" onClick={handleBack}>
                  Retour
                </Button>
                <div className="flex-1 w-full sm:w-auto">
                  <Combobox
                    value={selectedCurriculum}
                    onChange={setSelectedCurriculum}
                    options={currentCurriculums}
                  />
                </div>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Étudiants" value={stats.students} icon={Users} variant="info" />
                <StatCard title="Montant Perçu" value={formatMontant(stats.paid)} icon={CheckCircle2} variant="success" main />
                <StatCard title="Reste à Percevoir" value={formatMontant(stats.remaining)} icon={Clock} variant="warning" />
                <StatCard title="Montant Total" value={formatMontant(stats.total)} icon={DollarSign} variant="neutral" />
              </div>

              <ResponsiveTable
                columns={columns}
                data={wrappedData}
                // searchKey={['enrollment.first_name', 'enrollment.last_name', 'enrollment.student_number']}
                paginate={10}
                locale="fr"
                isLoading={loadingFinData}
                keyField="enrollment_code"
                filters={[
                  {
                    key: 'isPaidOff',
                    values: [
                      { label: 'Soldé', value: 'true' },
                      { label: 'Non soldé', value: 'false' },
                    ],
                  },
                ]}
              />
            </>
          )}
        </ContentLayout>
      </div>

      <DialogRecordDeposit
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedStudent={selectedStudent}
        allStudents={wrappedData}
        onSave={handleRecordDeposit}
      />
    </>
  )
}