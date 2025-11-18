"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { showToast } from "@/components/ui/showToast"
import { INSTALLMENT_TYPES_LIST } from "@/constant"

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

interface InstallmentFormData {
  typeCode: string
  amount: number
  dueDate: Date | undefined
}

interface DialogAddInstallmentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feeCode: string
  onSubmit: (data: { 
    fee_code: string
    type_code: string
    title: string
    amount: number
    due_date: string 
  }) => Promise<boolean>
  isLoading?: boolean
}

export default function DialogAddInstallment({
  open,
  onOpenChange,
  feeCode,
  onSubmit,
}: DialogAddInstallmentProps) {
  const currentYear = new Date().getFullYear()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<InstallmentFormData>({
    defaultValues: {
      typeCode: INSTALLMENT_TYPES_LIST.length > 0 ? INSTALLMENT_TYPES_LIST[0].value : "",
      amount: 0,
      dueDate: undefined,
    },
  })

  // Watch typeCode to generate title automatically
  const typeCode = watch("typeCode")
  const amount = watch("amount")

  // Generate title based on selected type and current year
  const generateTitle = (typeCode: string): string => {
    const selectedType = INSTALLMENT_TYPES_LIST.find(type => type.value === typeCode)
    if (!selectedType) return ""
    return `${selectedType.title} ${currentYear}`
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        typeCode: INSTALLMENT_TYPES_LIST.length > 0 ? INSTALLMENT_TYPES_LIST[0].value : "",
        amount: 0,
        dueDate: undefined,
      })
    }
  }, [open, reset])

  const onSubmitForm = async (data: InstallmentFormData) => {
    try {
      const payload = {
        fee_code: feeCode,
        type_code: data.typeCode,
        title: generateTitle(data.typeCode),
        amount: data.amount,
        due_date: data.dueDate!.toISOString().split('T')[0]
      }

      const success = await onSubmit(payload)

      if (success) {
        reset()
        onOpenChange(false)
        showToast({
          variant: "success-solid",
          message: "Succès",
          description: "L'échéance a été ajoutée avec succès",
          position: "top-center",
        })
      }
    } catch (error) {
      console.error(error)
      showToast({
        variant: "error-solid",
        message: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'échéance",
        position: "top-center",
      })
    }
  }

  const handleCancel = () => {
    if (isSubmitting) return
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Plus className="h-6 w-6 text-green-600" />
            Ajouter une échéance
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Ajouter une nouvelle échéance au plan de paiement
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="p-6 space-y-5">
            {/* Type de frais */}
            <div className="space-y-1">
              <Label htmlFor="typeCode" className="text-sm font-semibold text-slate-700">
                Type de frais <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="typeCode"
                control={control}
                rules={{
                  required: "Le type de frais est requis"
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="typeCode"
                      className={`w-full ${errors.typeCode ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTALLMENT_TYPES_LIST.map((inst) => (
                        <SelectItem key={inst.value} value={inst.value}>
                          {inst.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.typeCode && (
                <p className="text-red-500 text-xs">{errors.typeCode.message}</p>
              )}
              {/* Preview du titre généré */}
              {typeCode && (
                <p className="text-sm text-blue-600 font-medium">
                  Titre généré: {generateTitle(typeCode)}
                </p>
              )}
            </div>

            {/* Montant */}
            <div className="space-y-1">
              <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
                Montant (FCFA) <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Le montant est requis",
                  validate: (value) => value > 0 || "Le montant doit être supérieur à 0"
                }}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isSubmitting}
                    className={`h-10 text-lg ${errors.amount ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs">{errors.amount.message}</p>
              )}
              {amount > 0 && !errors.amount && (
                <p className="text-sm text-green-600 font-medium">
                  {formatMontant(amount)}
                </p>
              )}
            </div>

            {/* Date d'échéance */}
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-slate-700">
                Date d&apos;échéance <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="dueDate"
                control={control}
                rules={{
                  required: "La date d'échéance est requise"
                }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date || undefined)}
                  />
                )}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-slate-600">
                Nouvelle échéance
              </p>
              <div className="flex items-center space-x-3 justify-between">
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Ajout..." : "Ajouter l'échéance"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}