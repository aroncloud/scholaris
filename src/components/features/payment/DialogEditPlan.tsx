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
import { Save, DollarSign } from "lucide-react"
import { IGetPlan } from "@/types/financialTypes"
import { showToast } from "@/components/ui/showToast"

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

interface DialogEditPlanProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: IGetPlan | null
  curriculumName?: string
  onSubmit: (feeCode: string, data: { total_amount?: string; is_active?: number }) => Promise<boolean>
  isLoading?: boolean
}

export default function DialogEditPlan({
  open,
  onOpenChange,
  plan,
  curriculumName,
  onSubmit,
  isLoading = false
}: DialogEditPlanProps) {
  const [formData, setFormData] = useState({
    totalAmount: "",
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (plan && open) {
      setFormData({
        totalAmount: plan.total_amount.toString(),
        isActive: plan.is_active === 1
      })
      setErrors({})
    }
  }, [plan, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = "Le montant total doit être supérieur à 0"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const handleSubmit = async () => {
    if (!plan) return

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
        total_amount: formData.totalAmount,
        is_active: formData.isActive ? 1 : 0
      }

      const success = await onSubmit(plan.fee_code, payload)

      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isSubmitting) return
    onOpenChange(false)
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Modifier la grille tarifaire
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            {curriculumName || "Modification du plan de paiement"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Montant Total */}
          <div className="space-y-1">
            <Label htmlFor="total_amount" className="text-sm font-semibold text-slate-700">
              Montant Total (FCFA) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="total_amount"
              type="number"
              placeholder="450000"
              value={formData.totalAmount}
              onChange={(e) => handleFieldChange("totalAmount", e.target.value)}
              disabled={isSubmitting}
              className={`h-11 text-lg ${errors.totalAmount ? 'border-red-500' : ''}`}
            />
            {errors.totalAmount && (
              <p className="text-red-500 text-xs">{errors.totalAmount}</p>
            )}
            {formData.totalAmount && !errors.totalAmount && (
              <p className="text-sm text-blue-600 font-medium">
                {formatMontant(parseFloat(formData.totalAmount))}
              </p>
            )}
          </div>

          {/* Statut Actif */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all duration-200">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-sm font-semibold text-slate-900 cursor-pointer">
                Plan actif
              </Label>
              <p className="text-xs text-slate-500">
                Activer ou désactiver cette grille tarifaire
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                disabled={isSubmitting}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Nombre d'échéances (info) */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{plan.installments.length}</span> échéance{plan.installments.length > 1 ? 's' : ''} configurée{plan.installments.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Pour modifier les échéances, utilisez les boutons dans la carte du plan
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-slate-600">
              {plan.installments.length} échéance{plan.installments.length > 1 ? 's' : ''}
            </p>
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
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
