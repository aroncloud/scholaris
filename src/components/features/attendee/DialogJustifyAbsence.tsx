"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IAbsenceRecord, IJustificationSubmission } from "@/types/absenceTypes"
import { useEffect, useState } from "react"
import { FileText, Upload, AlertCircle, Calendar, Clock, BookOpen, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DialogJustifyAbsenceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  absence: IAbsenceRecord | null
  onSubmit: (data: IJustificationSubmission) => Promise<boolean>
}

const JUSTIFICATION_REASONS = [
  { value: "Maladie", label: "Maladie" },
  { value: "Urgence familiale", label: "Urgence familiale" },
  { value: "Rendez-vous médical", label: "Rendez-vous médical" },
  { value: "Problème de transport", label: "Problème de transport" },
  { value: "Stage/Emploi", label: "Stage/Emploi" },
  { value: "Autre", label: "Autre" },
]

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function DialogJustifyAbsence({
  open,
  onOpenChange,
  absence,
  onSubmit
}: DialogJustifyAbsenceProps) {

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<IJustificationSubmission>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const reason = watch("reason")
  const details = watch("details")

  const isReadOnly = absence?.justification_status !== 'NOT_SUBMITTED'

  useEffect(() => {
    if (absence && open) {
      setValue("absence_id", absence.absence_id)
      if (absence.justification_reason) {
        setValue("reason", absence.justification_reason)
      }
      if (absence.justification_details) {
        setValue("details", absence.justification_details)
      }
    }
  }, [absence, open, setValue])

  const handleFormSubmit = async (data: IJustificationSubmission) => {
    if (!absence) return

    const payload: IJustificationSubmission = {
      ...data,
      document: selectedFile || undefined
    }

    const result = await onSubmit(payload)
    if (result) {
      reset()
      setSelectedFile(null)
      onOpenChange(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700">En attente</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-700">Approuvée</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700">Refusée</Badge>
      default:
        return null
    }
  }

  if (!absence) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:min-w-xl lg:min-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-6 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-left text-2xl font-bold">
              {isReadOnly ? 'Détails de la justification' : 'Justifier l\'absence'}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenu avec scroll */}
        <div className="overflow-y-auto px-6 py-4">
          {/* Informations sur l'absence */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{absence.course_name}</p>
                <p className="text-sm text-gray-600">{absence.group_name}</p>
              </div>
              {isReadOnly && getStatusBadge(absence.justification_status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(absence.session_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{absence.start_time} - {absence.end_time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{absence.room}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>{absence.instructor_name}</span>
              </div>
            </div>
          </div>

          <form id="justification-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Motif */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Motif *
              </Label>
              <Select
                value={reason}
                onValueChange={(value) => setValue("reason", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un motif" />
                </SelectTrigger>
                <SelectContent>
                  {JUSTIFICATION_REASONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
            </div>

            {/* Explication détaillée */}
            <div className="space-y-2">
              <Label>Explication détaillée *</Label>
              <Textarea
                {...register("details", {
                  required: "L'explication est requise",
                  minLength: { value: 10, message: "L'explication doit contenir au moins 10 caractères" }
                })}
                placeholder="Expliquez les circonstances de votre absence..."
                rows={4}
                disabled={isReadOnly}
              />
              {errors.details && <p className="text-sm text-red-500">{errors.details.message}</p>}
            </div>

            {/* Document justificatif */}
            {!isReadOnly && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Document justificatif (optionnel)
                </Label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={isReadOnly}
                />
                {selectedFile && (
                  <p className="text-sm text-green-600">
                    Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 5 MB)
                </p>
              </div>
            )}

            {/* Commentaire du réviseur (si refusée) */}
            {absence.justification_status === 'REJECTED' && absence.reviewer_comment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">Motif du refus</p>
                    <p className="text-sm text-red-800">{absence.reviewer_comment}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Commentaire du réviseur (si approuvée) */}
            {absence.justification_status === 'APPROVED' && absence.reviewer_comment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">Commentaire</p>
                    <p className="text-sm text-green-800">{absence.reviewer_comment}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-6 py-4 shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              reset()
              setSelectedFile(null)
            }}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isReadOnly ? 'Fermer' : 'Annuler'}
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              form="justification-form"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isSubmitting || !reason || !details}
            >
              {isSubmitting ? "Envoi..." : "Envoyer la justification"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
