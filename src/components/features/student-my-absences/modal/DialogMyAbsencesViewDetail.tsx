"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUp, Calendar, Clock, BookOpen, Award } from "lucide-react"
import { Absence } from "@/types/studentmyabsencesTypes"
import Badge from "@/components/custom-ui/Badge"

interface DialogMyAbsencesViewDetailProps {
  isDetailsDialogOpen: boolean
  setIsDetailsDialogOpen: (open: boolean) => void
  selectedAbsence: Absence | null
  handleSubmitJustification: () => void
}

const calculateTotalHours = (start?: string, end?: string) => {
  if (!start || !end) return "—"
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  return diff.toFixed(2)
}

export default function DialogMyAbsencesViewDetail({
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  selectedAbsence,
  handleSubmitJustification,
}: DialogMyAbsencesViewDetailProps) {
  return (
    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
      <DialogContent className="max-w-sm md:min-w-xl lg:min-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-6 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Détails de l&apos;absence
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenu avec scroll */}
        <div className="overflow-y-auto px-6 py-4">
          {selectedAbsence && (
            <div className="space-y-4">
              {/* Infos principales */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{selectedAbsence.session_title}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedAbsence.course_unit_name}</p>
                  </div>
                  <Badge value={selectedAbsence.status_code} label={selectedAbsence.status_code} size="sm" />
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Date d&apos;absence
                  </Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedAbsence.recorded_at).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Horaires
                  </Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedAbsence.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(selectedAbsence.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    Durée totale
                  </Label>
                  <p className="text-sm font-medium">
                    {calculateTotalHours(selectedAbsence.start_time, selectedAbsence.end_time)} heures
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-6 py-4 shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDetailsDialogOpen(false)}
            className="flex-1"
          >
            Fermer
          </Button>
          {selectedAbsence?.status_code === "UNJUSTIFIED" && (
            <Button
              onClick={handleSubmitJustification}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Soumettre justificatif
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
