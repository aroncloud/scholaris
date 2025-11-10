/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Absence } from "@/types/studentmyabsencesTypes"
import {
  Upload,
  FileUp,
  X,
  FileText,
  Clock,
  Stethoscope,
  Users,
  Bus,
  Briefcase,
  FileCheck
} from "lucide-react"
import { submitJustification } from "@/actions/studentMyAbsencesAction"
import { showToast } from "@/components/ui/showToast"
import { useUserStore } from "@/store/useAuthStore"

interface DialogCreateSubmitJustificationProps {
  isSubmitJustificationOpen: boolean
  setIsSubmitJustificationOpen: (open: boolean) => void
  absencesData: Absence[]
  selectedAbsences: number[]
  handleAbsenceSelection: (absenceId: number, checked: boolean) => void
  onJustificationSubmitted?: () => void
}

const justificationTypes = [
  { value: "MEDICAL_CERTIFICATE", label: "Certificat médical", icon: Stethoscope },
  { value: "FAMILY_REASON", label: "Raison familiale", icon: Users },
  { value: "TRANSPORT_ISSUE", label: "Problème de transport", icon: Bus },
  { value: "INTERNSHIP_DOCUMENT", label: "Convention de stage", icon: Briefcase },
  { value: "OTHER", label: "Autre", icon: FileText },
]

export default function DialogCreateSubmitJustification({
  isSubmitJustificationOpen,
  setIsSubmitJustificationOpen,
  absencesData,
  selectedAbsences,
  handleAbsenceSelection,
  onJustificationSubmitted,
}: DialogCreateSubmitJustificationProps) {
  const [reason, setReason] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const user = useUserStore((state) => state.user)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast({ variant: "error-solid", message: "Fichier trop volumineux (max 5MB)", position: 'top-center' })
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!user?.user?.user_code) {
      showToast({ variant: "error-solid", message: "Utilisateur non trouvé", position: 'top-center' })
      return
    }
    if (!selectedType) {
      showToast({ variant: "error-solid", message: "Veuillez sélectionner le type de justificatif", position: 'top-center' })
      return
    }
    if (selectedAbsences.length === 0) {
      showToast({ variant: "error-solid", message: "Veuillez sélectionner au moins une absence", position: 'top-center' })
      return
    }

    setLoading(true)

    const payload = {
      absence_codes: selectedAbsences.map(index => absencesData[index].absence_code),
      reason,
      files: [{ content_url: "", title: selectedFile?.name ?? "", type_code: selectedType }],
    }

    try {
      const result = await submitJustification(payload, selectedFile!, user.user.user_code)

      if (result.code === "success") {
        showToast({ variant: "success-solid", message: "Justificatif soumis avec succès", position: 'top-center' })
        setIsSubmitJustificationOpen(false)
        setReason("")
        setSelectedType("")
        setSelectedFile(null)
        onJustificationSubmitted?.()
      } else {
        showToast({ variant: "error-solid", message: result.error || "Une erreur est survenue", position: 'top-center' })
      }
    } catch (error) {
      showToast({ variant: "error-solid", message: "Erreur lors de la soumission", position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isSubmitJustificationOpen} onOpenChange={setIsSubmitJustificationOpen}>
      <DialogContent className="max-w-sm md:min-w-xl lg:min-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-6 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Soumettre un justificatif
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenu avec scroll */}
        <div className="overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Type de justificatif */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Type de justificatif <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {justificationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Document <span className="text-red-500">*</span>
              </Label>

              {!selectedFile ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">PDF, JPG, PNG (max 5MB)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir un fichier
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-3 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Textarea
                placeholder="Précisions complémentaires..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
            </div>

            {/* Liste des absences */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Absences à justifier <span className="text-red-500">*</span></Label>
                {selectedAbsences.length > 0 && (
                  <Badge variant="secondary">{selectedAbsences.length} sélectionnée(s)</Badge>
                )}
              </div>

              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {absencesData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Aucune absence</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {absencesData.map((absence, index) => {
                      const isDisabled = absence.status_code !== "UNJUSTIFIED"
                      const isSelected = selectedAbsences.includes(index)

                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                            isDisabled
                              ? 'bg-gray-50 cursor-not-allowed opacity-60'
                              : isSelected
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleAbsenceSelection(index, Boolean(checked))}
                            disabled={isDisabled}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {new Date(absence.recorded_at).toLocaleDateString("fr-FR")}
                              </p>
                              {isDisabled && (
                                <Badge variant="outline" className="text-xs">Justifié</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {absence.course_unit_name} — {absence.session_title}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-6 py-4 shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSubmitJustificationOpen(false)}
            disabled={loading}
            className="flex-1"
          >
            Fermer
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedType || selectedAbsences.length === 0 || loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                Soumettre
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
