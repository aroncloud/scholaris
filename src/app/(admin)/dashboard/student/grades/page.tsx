"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText } from "lucide-react"
import PageHeader from "@/layout/PageHeader"
import { IGetStudentReport } from "@/types/userType"
import { showToast } from "@/components/ui/showToast"
import { useUserStore } from "@/store/useAuthStore"
import { getStudentReport } from "@/actions/gradesAction"
import { useAcademicYearStore } from "@/store/useAcademicYearStore"
import { PageLoadingSkeleton } from "@/components/features/grades/skeleton/GradeSkeletons"
import { EmptyState } from "@/components/common/EmptyState"
import { SidebarInfo } from "@/components/features/grades/SidebarInfo"
import { ModuleCard } from "@/components/features/grades/ModuleCard"

const getDecisionStyle = (decision: string) => {
  switch (decision?.toUpperCase()) {
    case "ADMIS":
    case "APPROVED":
    case "PASSED":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    case "AJOURNÉ":
    case "AJOURNE":
    case "PENDING":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20"
    case "REDOUBLE":
    case "FAILED":
      return "bg-rose-500/10 text-rose-700 border-rose-500/20"
    default:
      return "bg-slate-500/10 text-slate-700 border-slate-500/20"
  }
}


export default function ReleveNotesPage() {
  const [reportData, setReportData] = useState<IGetStudentReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("")
  const { user } = useUserStore()
  const { selectedAcademicYear } = useAcademicYearStore()

  const fetchReport = useCallback(async () => {
    setIsLoading(true)
    try {
      if (selectedAcademicYear) {
        const result = await getStudentReport(selectedAcademicYear)
        
        if (result.code === "success" && result.data) {
          setReportData(result.data.body)
          if (result.data.body.grades_by_schedule.length > 0) {
            setActiveTab(result.data.body.grades_by_schedule[0].schedule_code)
          }
        } else {
          showToast({
            variant: "error-solid",
            message: "Erreur de chargement",
            description: result.error || "Impossible de charger le relevé de notes",
            position: 'top-center',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching report:', error)
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        position: 'top-center',
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedAcademicYear])

  useEffect(() => {
    fetchReport()
  }, [fetchReport, selectedAcademicYear])

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Relevé de Notes Officiel"
          description="Consultez vos notes officielles"
          Icon={FileText}
        />
        <PageLoadingSkeleton />
      </>
    )
  }

  if (!reportData || !reportData.grades_by_schedule || reportData.grades_by_schedule.length === 0) {
    return (
      <>
        <PageHeader
          title="Relevé de Notes Officiel"
          description="Consultez vos notes officielles"
          Icon={FileText}
        />
        <div className="p-4 md:p-6">
          <EmptyState
            title="Aucune donnée disponible"
            description="Aucun relevé de notes n'a été trouvé pour l'année académique sélectionnée. Veuillez sélectionner une autre année ou contacter le service de scolarité."
            showAction
            onActionClick={fetchReport}
            actionLabel="Réessayer"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Relevé de Notes Officiel"
        description="Consultez vos notes officielles"
        Icon={FileText}
      >
        <Button size="lg" className="gap-2" variant="info">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Télécharger</span>
        </Button>
      </PageHeader>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="bg-white w-full grid h-auto p-1 rounded-xl border border-slate-200 gap-1 shadow-sm mb-2 overflow-x-auto"
                style={{ gridTemplateColumns: `repeat(${reportData.grades_by_schedule.length}, minmax(120px, 1fr))` }}
              >
                {reportData.grades_by_schedule.map((schedule) => (
                  <TabsTrigger
                    key={schedule.schedule_code}
                    value={schedule.schedule_code}
                    className="px-2 sm:px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
                  >
                    <span className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{schedule.sequence_name}</span>
                      {/* <span className="text-[10px] sm:text-xs font-normal opacity-90">
                        {formatDate(schedule.start_date)}
                      </span> */}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {reportData.grades_by_schedule.map((schedule) => (
                <TabsContent key={schedule.schedule_code} value={schedule.schedule_code} className="mt-0 space-y-4">
                  {/* Info Semestre
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-slate-600 mb-1 uppercase tracking-wider">
                            Période
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-slate-900">
                            {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1 uppercase tracking-wider">
                            Statut
                          </p>
                          <Badge value={schedule.status_code} label={schedule.status_code} size="sm" className="text-xs sm:text-sm" />
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Modules */}
                  {schedule.grades_by_module.length > 0 ? (
                    schedule.grades_by_module.map((module, idx) => (
                      <ModuleCard
                        key={`${module.module_name}-${idx}`}
                        moduleName={module.module_name}
                        moduleCode={module.details[0]?.module_code}
                        result={module.result}
                        details={module.details}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title="Aucune note"
                      description="Aucune note n'est disponible pour ce semestre."
                      showAction={false}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SidebarInfo
              reportData={reportData}
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              getDecisionStyle={getDecisionStyle}
            />
          </div>
        </div>
      </div>
    </>
  )
}