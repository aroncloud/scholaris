"use client"

import { useEffect, useMemo, useState } from "react"
import { DollarSign } from "lucide-react"
import { useFactorizedProgramStore } from "@/store/programStore"
import PageHeader from "@/layout/PageHeader"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { IRecordDeposit } from "@/types/financialTypes"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DialogRecordDeposit from "@/components/features/financial/DialogRecordDeposit"
import { showToast } from "@/components/ui/showToast"
import CurrentStudentsList from "@/components/features/financial/CurrentStudentsList"
import ProgramsTabContent, { FinancialDataWrapper } from "@/components/features/financial/ProgramsTabContent"
import {  IListStudent } from "@/types/staffType"
import { getUserList } from "@/actions/programsAction"

export default function GestionScolaritePage() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<FinancialDataWrapper | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loadingStudentList, setLoadingStudentList] = useState(false)
  const [studentList, setStudentList] = useState<IListStudent[]>([])

  const { factorizedPrograms } = useFactorizedProgramStore()
  const { getCurriculumFinancialsInfo, finData, loadingFinData, recordDeposite } = useFinancialData()

  useEffect(() => {
    if(selectedCurriculum) {
      getCurriculumFinancialsInfo(selectedCurriculum)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurriculum])

  const wrappedData: FinancialDataWrapper[] = useMemo(() => 
    finData.map(item => ({
      ...item,
      isPaidOff: item.remaining_balance === 0
    })),
    [finData]
  )

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
      // Refresh student list for the current students tab
      init();

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

  const handleSelectStudent = (student: FinancialDataWrapper) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };


  const init = async () => {
    setLoadingStudentList(true)
    const result = await getUserList();
    if(result.code == 'success') {
        setStudentList(result.data.body);
    } 
    console.log('getUserList.result', result)
    setLoadingStudentList(false)
  }

  useEffect(() => {
    init();
  }, [])
  return (
    <>
      <PageHeader
        Icon={DollarSign}
        title="Gestion des Paiements"
        description="Gérez les paiements de scolarité de vos étudiants"
      />
      <div className="px-2 pb-2 pt-0 md:px-6 md:pb-6 md:pt-0">
        <Tabs defaultValue="etudiants" className="">
          <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mt-6 mb-2">
              <TabsTrigger value="etudiants" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">
                Étudiants 
              </TabsTrigger>
              <TabsTrigger value="programs" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">
                Programmes 
              </TabsTrigger>
            </TabsList>
            <TabsContent value="programs" className="space-y-4">
              <ProgramsTabContent
                factorizedPrograms={factorizedPrograms}
                wrappedData={wrappedData}
                loadingFinData={loadingFinData}
                onSelectStudent={handleSelectStudent}
                onCurriculumChange={setSelectedCurriculum}
              />
            </TabsContent>

            <TabsContent value="etudiants" className="space-y-4">
              <CurrentStudentsList
                studentList={studentList}
                loading={loadingStudentList}
                onRecordPayment={handleRecordDeposit}
              />
            </TabsContent>
        </Tabs>
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