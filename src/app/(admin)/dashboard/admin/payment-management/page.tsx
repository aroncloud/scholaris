/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useMemo, useState } from "react"
import { DollarSign } from "lucide-react"
import { useFactorizedProgramStore } from "@/store/programStore"
import PageHeader from "@/layout/PageHeader"
import { useFinancialData } from "@/hooks/feature/financial/useFinancialData"
import { IRecordDeposit, IStudentGetFinancialInfo } from "@/types/financialTypes"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DialogRecordDeposit from "@/components/features/financial/DialogRecordDeposit"
import { showToast } from "@/components/ui/showToast"
import CurrentStudentsList from "@/components/features/financial/CurrentStudentsList"
import ProgramsTabContent, { FinancialDataWrapper } from "@/components/features/financial/ProgramsTabContent"
import { ICreateStudent, IListStudent } from "@/types/staffType"
import { student_statuses } from "@/constant"
import { getUserList } from "@/actions/programsAction"

export default function GestionScolaritePage() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<FinancialDataWrapper | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<'CREATE' | 'UPDATE'>('CREATE')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [sturentFormData, setStudentFormData] = useState<Partial<ICreateStudent>>({})
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
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

  const currentStudents = studentList.filter((student) => {
    return student_statuses[student.status_code as keyof typeof student_statuses] != student_statuses.GRADUATED && 
      student_statuses[student.status_code as keyof typeof student_statuses] != student_statuses.ENROLLED;
  });

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
      <div className="p-2 md:p-6">
        <Tabs defaultValue="etudiants" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="etudiants">
                Étudiants actuels 
              </TabsTrigger>
              <TabsTrigger value="programs">
                Programmes académiques 
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
                setAction={setAction}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setIsStudentDialogOpen={setIsStudentModalOpen}
                setFormData={setStudentFormData}
                setStudentToDelete={setStudentToDelete}
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