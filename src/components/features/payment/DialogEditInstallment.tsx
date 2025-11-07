/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/DatePicker"
import { Save, Calendar } from "lucide-react"
import { IInstallment } from "@/types/financialTypes"
import { showToast } from "@/components/ui/showToast"

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

interface DialogEditInstallmentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  installment: IInstallment | null
  onSubmit: (installmentCode: string, data: { title?: string; amount?: number; due_date?: string }) => Promise<boolean>
  onDelete?: (installmentCode: string) => Promise<void>
  isLoading?: boolean
}

export default function DialogEditInstallment({
  open,
  onOpenChange,
  installment,
  onSubmit,
  onDelete,
  isLoading = false
}: DialogEditInstallmentProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    dueDate: undefined as Date | undefined
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (installment && open) {
      setFormData({
        title: installment.title,
        amount: installment.amount.toString(),
        dueDate: new Date(installment.due_date)
      })
      setErrors({})
    }
  }, [installment, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis"
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "La date d'échéance est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: keyof typeof formData, value: string | Date | undefined) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const handleSubmit = async () => {
    if (!installment) return

    if (!validate()) {
      showToast({
        variant: "error-solid",
        message: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        position: "top-center",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        due_date: formData.dueDate?.toISOString().split('T')[0]
      }

      const success = await onSubmit(installment.installment_code, payload)

      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!installment || !onDelete) return

    if (confirm("Êtes-vous sûr de vouloir supprimer cette échéance ? Cette action est irréversible.")) {
      await onDelete(installment.installment_code)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (isSubmitting) return
    onOpenChange(false)
  }

  if (!installment) return null

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Modifier l&apos;échéance
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Modification d&apos;une échéance de paiement
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Titre */}
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Titre de l&apos;échéance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Première tranche"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              disabled={isSubmitting}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          {/* Montant */}
          <div className="space-y-1">
            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
              Montant (FCFA) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="150000"
              value={formData.amount}
              onChange={(e) => handleFieldChange("amount", e.target.value)}
              disabled={isSubmitting}
              className={`h-10 text-lg ${errors.amount ? 'border-red-500' : ''}`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount}</p>
            )}
            {formData.amount && !errors.amount && (
              <p className="text-sm text-blue-600 font-medium">
                {formatMontant(parseFloat(formData.amount))}
              </p>
            )}
          </div>

          {/* Date d'échéance */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-slate-700">
              Date d&apos;échéance <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => handleFieldChange("dueDate", date || undefined)}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs">{errors.dueDate}</p>
            )}
          </div>

          {/* Info sur le type */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600">
              <span className="font-semibold">Type de frais:</span> {installment.type_code}
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between w-full">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Supprimer
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant={"info"}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
