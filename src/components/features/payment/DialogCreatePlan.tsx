/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
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
import { Card, CardContent } from "@/components/ui/card"
import { Combobox } from "@/components/ui/Combobox"
import { DatePicker } from "@/components/DatePicker"
import { Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { ICurriculumDetail } from "@/types/programTypes"
import { INSTALLMENT_TYPES_LIST } from "@/constant"
import { showToast } from "@/components/ui/showToast"

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

interface InstallmentFormData {
  type_code: string
  title: string
  amount: number
  due_date: Date | undefined
}

interface PlanFormData {
  curriculum_code: string
  total_amount: number
  installments: InstallmentFormData[]
}

interface DialogCreatePlanProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  curriculumList: ICurriculumDetail[]
  onSubmit: (data: any) => Promise<boolean>
  isLoading?: boolean
}

export default function DialogCreatePlan({
  open,
  onOpenChange,
  curriculumList,
  onSubmit,
  isLoading = false
}: DialogCreatePlanProps) {

  const installmentTypes = useMemo(() => INSTALLMENT_TYPES_LIST, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<PlanFormData>({
    defaultValues: {
      curriculum_code: "",
      total_amount: 0,
      installments: installmentTypes.map(type => ({
        type_code: type.value,
        title: type.title,
        amount: 0,
        due_date: undefined
      }))
    },
  })

  // Watch form values for validation
    const watchedValues = useWatch({ control })
    const totalAmount = watchedValues.total_amount || 0
    const installments = useMemo(() => watchedValues.installments || [], [watchedValues.installments])

  // Calculate total installments
  const totalInstallments = useMemo(() => {
    return installments.reduce((acc, inst) => {
      return acc + (inst?.amount || 0)
    }, 0)
  }, [installments])

  // Check if amounts are balanced
  const isBalanced = totalAmount > 0 && totalInstallments === totalAmount

  // Validate dates chronologically
  useEffect(() => {
    if (!installments || installments.length === 0) return

    let hasDateError = false

    for (let i = 0; i < installments.length - 1; i++) {
      const currentDate = installments[i]?.due_date
      const nextDate = installments[i + 1]?.due_date

      if (currentDate && nextDate) {
        const current = new Date(currentDate)
        const next = new Date(nextDate)

        if (current >= next) {
          setError(`installments.${i + 1}.due_date` as any, {
            type: "manual",
            message: `La date doit être postérieure au ${installmentTypes[i].title}`
          })
          hasDateError = true
        } else {
          clearErrors(`installments.${i + 1}.due_date` as any)
        }
      }
    }

    if (!hasDateError) {
      // Clear all date errors if dates are valid
      installments.forEach((_, index) => {
        clearErrors(`installments.${index}.due_date` as any)
      })
    }
  }, [installments, setError, clearErrors, installmentTypes])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        curriculum_code: "",
        total_amount: 0,
        installments: installmentTypes.map(type => ({
          type_code: type.value,
          title: type.title,
          amount: 0,
          due_date: undefined
        }))
      })
    }
  }, [open, reset, installmentTypes])

  const onSubmitForm = async (data: PlanFormData) => {
    // Validate amounts balance
    const totalInst = data.installments.reduce((acc, inst) => acc + (inst.amount || 0), 0)
    if (totalInst !== data.total_amount) {
      showToast({
        variant: "error-solid",
        message: "Erreur de validation",
        description: "Le total des échéances doit être égal au montant total",
        position: "top-center",
      })
      return
    }

    // Validate all installments have dates
    const missingDates = data.installments.some(inst => !inst.due_date)
    if (missingDates) {
      showToast({
        variant: "error-solid",
        message: "Erreur de validation",
        description: "Toutes les échéances doivent avoir une date d'échéance",
        position: "top-center",
      })
      return
    }

    // Validate dates are in chronological order
    for (let i = 0; i < data.installments.length - 1; i++) {
      const currentDate = new Date(data.installments[i].due_date!)
      const nextDate = new Date(data.installments[i + 1].due_date!)

      if (currentDate >= nextDate) {
        showToast({
          variant: "error-solid",
          message: "Erreur de validation",
          description: "Les dates d'échéance doivent être dans l'ordre chronologique",
          position: "top-center",
        })
        return
      }
    }

    try {
      const payload = {
        curriculum_code: data.curriculum_code,
        total_amount: data.total_amount,
        installments: data.installments.map(inst => ({
          type_code: inst.type_code,
          title: inst.title,
          amount: inst.amount,
          due_date: inst.due_date!.toISOString().split('T')[0]
        }))
      }

      console.log('-->payload', payload)

      const success = await onSubmit(payload)

      if (success) {
        reset()
        onOpenChange(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    reset()
    onOpenChange(false)
  }

  const curriculumOptions = useMemo(() =>
    curriculumList.map(curriculum => ({
      value: curriculum.curriculum_code,
      label: curriculum.curriculum_name
    })),
    [curriculumList]
  )

  const getColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
    return colors[index % colors.length]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header */}

        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">
            Nouvelle grille tarifaire
          </DialogTitle>

          <DialogDescription className="text-left text-sm text-slate-500 mt-1">Remplissez le formulaire d&apos;une grille tarifaire</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col h-full">
          <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
            {/* Contenu */}


            {/* Curriculum & Montant */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Curriculum <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="curriculum_code"
                  control={control}
                  rules={{ required: "Le curriculum est requis" }}
                  render={({ field }) => (
                    <Combobox
                      value={field.value}
                      onChange={field.onChange}
                      options={curriculumOptions}
                      placeholder="Sélectionner..."
                    />
                  )}
                />
                {errors.curriculum_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.curriculum_code.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Montant Total (FCFA) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="total_amount"
                  control={control}
                  rules={{
                    required: "Le montant total est requis",
                    validate: (value) => value > 0 || "Le montant doit être supérieur à 0"
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="450000"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="h-10 text-lg"
                    />
                  )}
                />
                {errors.total_amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.total_amount.message}</p>
                )}
                {totalAmount > 0 && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {formatMontant(totalAmount)}
                  </p>
                )}
              </div>
            </div>

            {/* Échéances */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Échéances de paiement</h3>
              {installmentTypes.map((type, index) => (
                <Card key={type.value} className="border-slate-200 py-2">
                  <CardContent className="px-2 py-2 space-y-3">

                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg ${getColor(index)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-slate-900">
                        {type.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">
                          Montant <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name={`installments.${index}.amount`}
                          control={control}
                          rules={{
                            required: "Le montant est requis",
                            validate: (value) => value > 0 || "Le montant doit être supérieur à 0"
                          }}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="100000"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="h-10"
                            />
                          )}
                        />
                        {errors.installments?.[index]?.amount && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.installments[index]?.amount?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">
                          Date d&apos;échéance <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name={`installments.${index}.due_date`}
                          control={control}
                          rules={{
                            required: "La date est requise"
                          }}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date || undefined)}
                              label=""
                            />
                          )}
                        />
                        {errors.installments?.[index]?.due_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.installments[index]?.due_date?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Résumé */}
            {totalAmount > 0 && (
              <Card className={`border-2 ${isBalanced ? 'border-emerald-500 bg-emerald-50' : 'border-amber-500 bg-amber-50'
                }`}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    {isBalanced ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isBalanced ? 'text-emerald-900' : 'text-amber-900'
                        }`}>
                        {isBalanced ? 'Montants équilibrés ✓' : 'Attention: Montants non équilibrés'}
                      </p>
                      <p className={`text-xs mt-1 ${isBalanced ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                        Total échéances: {formatMontant(totalInstallments)} / Montant total: {formatMontant(totalAmount)}
                      </p>
                      {!isBalanced && totalAmount > 0 && (
                        <p className="text-xs mt-1 text-amber-700">
                          Différence: {formatMontant(Math.abs(totalAmount - totalInstallments))}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Footer */}
          <DialogFooter className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!isBalanced || isLoading}
                variant={"info"}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}