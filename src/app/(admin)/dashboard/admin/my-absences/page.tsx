/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Search } from "lucide-react"
import { showToast } from "@/components/ui/showToast"
import { AbsenceCard } from "@/components/features/attendee/Cards/AbsenceCard"
import { IAbsenceRecord, IJustificationSubmission } from "@/types/absenceTypes"
import DialogJustifyAbsence from "@/components/features/attendee/DialogJustifyAbsence"
import PageHeader from "@/layout/PageHeader"
import { formatDateToText } from "@/lib/utils"

export default function StudentAbsencesPage() {
  const [absences, setAbsences] = useState<IAbsenceRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isJustificationDialogOpen, setIsJustificationDialogOpen] = useState(false)
  const [selectedAbsence, setSelectedAbsence] = useState<IAbsenceRecord | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadAbsences = async () => {
    setIsLoading(true)
    try {
      // TODO: Remplacer par l'appel réel à l'API
      // const result = await getStudentAbsences()
      // if (result.code === 'success') {
      //   setAbsences(result.data)
      // }
      setAbsences([])
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors du chargement",
        description: "Une erreur est survenue lors du chargement de vos absences",
        position: 'top-center',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openJustificationDialog = (absence: IAbsenceRecord) => {
    setSelectedAbsence(absence)
    setIsJustificationDialogOpen(true)
  }

  const handleSubmitJustification = async (data: IJustificationSubmission): Promise<boolean> => {
    try {
      showToast({
        variant: "success-solid",
        message: "Justification envoyée",
        description: "Votre justification a été soumise et sera examinée prochainement",
        position: 'top-center',
      })

      return true
    } catch (error: any) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors de l'envoi",
        description: "Une erreur est survenue lors de l'envoi de la justification",
        position: 'top-center',
      })
      return false
    }
  }

  const filteredAbsences = absences.filter(absence => {
    const matchesFilter = filterStatus === 'all' || absence.justification_status === filterStatus
    const matchesSearch = searchTerm === '' ||
      absence.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.session_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: absences.length,
    notSubmitted: absences.filter(a => a.justification_status === 'NOT_SUBMITTED').length,
    pending: absences.filter(a => a.justification_status === 'PENDING').length,
    approved: absences.filter(a => a.justification_status === 'APPROVED').length,
    rejected: absences.filter(a => a.justification_status === 'REJECTED').length,
  }

  useEffect(() => {
    loadAbsences()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Mes Absences"
        description="Consultez vos absences et soumettez des justifications"
      />

      <div className="p-6">
        <div className="mx-auto space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-gray-700' },
              { label: 'À justifier', value: stats.notSubmitted, color: 'text-orange-600' },
              { label: 'En attente', value: stats.pending, color: 'text-yellow-600' },
              { label: 'Justifiées', value: stats.approved, color: 'text-green-600' },
              { label: 'Refusées', value: stats.rejected, color: 'text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-3 rounded-lg border text-center">
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Contrôles */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="NOT_SUBMITTED">À justifier</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="APPROVED">Justifiées</SelectItem>
                  <SelectItem value="REJECTED">Refusées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liste des absences */}
          <div>
            <div className="space-y-4">
              {filteredAbsences.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucune absence</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Aucun résultat pour ces critères'
                      : 'Vous n\'avez pas d\'absences enregistrées'
                    }
                  </p>
                </div>
              ) : (
                filteredAbsences.map((absence) => (
                  <AbsenceCard
                    key={absence.absence_id}
                    absence={absence}
                    onOpenJustification={openJustificationDialog}
                    onViewJustification={openJustificationDialog}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de justification */}
      <DialogJustifyAbsence
        open={isJustificationDialogOpen}
        onOpenChange={setIsJustificationDialogOpen}
        absence={selectedAbsence}
        onSubmit={handleSubmitJustification}
      />
    </>
  )
}
