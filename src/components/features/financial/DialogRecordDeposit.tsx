"use client"

import { Controller, useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/Combobox"
import { IRecordDeposit, IStudentGetFinancialInfo } from "@/types/financialTypes"
import { useEffect, useMemo } from "react"
import { DollarSign, Calendar, FileText, Wallet } from "lucide-react"
import Badge from "@/components/custom-ui/Badge"
import { DatePicker } from "@/components/DatePicker"

interface FinancialDataWrapper extends IStudentGetFinancialInfo {
  isPaidOff: boolean;
}


interface DialogRecordDepositProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudent: FinancialDataWrapper | null;
  allStudents: FinancialDataWrapper[];
  onSave: (deposite: IRecordDeposit) => Promise<boolean>;
}

const PAYMENT_METHODS = [
  { value: "BANK_DEPOSIT", label: "Dépôt bancaire" },
  { value: "CASH", label: "Espèces"},
  { value: "MOBILE_MONEY", label: "Mobile Money"},
  { value: "CHECK", label: "Chèque"},
]

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

export default function DialogRecordDeposit({ 
  open, 
  onOpenChange, 
  selectedStudent, 
  allStudents,
  onSave 
}: DialogRecordDepositProps) {
  
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<IRecordDeposit>()
  
  const studentUserCode = watch("student_user_code")
  const amount = watch("amount")
  const paymentMethod = watch("payment_method")

  const currentStudent = useMemo(() => 
    allStudents.find(s => s.enrollment.user_code === studentUserCode),
    [allStudents, studentUserCode]
  )

  useEffect(() => {
    if (selectedStudent && open) {
      setValue("student_user_code", selectedStudent.enrollment.user_code)
      setValue("payment_date", new Date().toISOString().split('T')[0])
      if (selectedStudent.remaining_balance > 0) {
        setValue("amount", selectedStudent.remaining_balance)
      }
    }
  }, [selectedStudent, open, setValue])

  const onSubmit = async (data: IRecordDeposit) => {
    console.log('-->Onsubmit', data)
    const payload = {
      ...data,
      amount: Number(data.amount)
    };
    const result = await onSave(payload);
    if(result) {
      reset();
      onOpenChange(false);
    }
  }

  const studentOptions = allStudents.map(s => ({
    value: s.enrollment.user_code,
    label: `${s.enrollment.first_name} ${s.enrollment.last_name} - ${s.enrollment.student_number}`
  }))

  const newBalance = currentStudent 
    ? Math.max(0, currentStudent.remaining_balance - (amount || 0))
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:min-w-xl lg:min-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-6 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Enregistrer un paiement
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenu avec scroll */}
        <div className="overflow-y-auto px-6 py-4">
          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Sélection étudiant */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span>Étudiant</span>
                {currentStudent?.isPaidOff && (
                  <Badge value="Soldé" variant="success" size="sm" label="Soldé"/>
                )}
              </Label>
              <Combobox
                value={studentUserCode}
                onChange={(value) => setValue("student_user_code", value)}
                options={studentOptions}
                placeholder="Sélectionner un étudiant..."
              />
            </div>

            {/* Infos étudiant */}
            {currentStudent && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total dû</span>
                  <span className="font-semibold">{formatMontant(currentStudent.total_due)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Déjà payé</span>
                  <span className="font-semibold text-green-600">{formatMontant(currentStudent.total_paid)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-1.5">
                  <span className="text-gray-600 dark:text-gray-400">Reste à payer</span>
                  <span className="font-bold text-orange-600">{formatMontant(currentStudent.remaining_balance)}</span>
                </div>
              </div>
            )}

            {/* Montant */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Montant (FCFA)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  {...register("amount", {
                    valueAsNumber: true, 
                    required: "Montant requis", 
                    min: { value: 1, message: "Le montant doit être supérieur à 0" },
                    max: currentStudent ? { 
                      value: currentStudent.remaining_balance, 
                      message: "Le montant ne peut pas dépasser le solde restant" 
                    } : undefined
                  })}
                  placeholder="0"
                  disabled={isSubmitting}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  FCFA
                </span>
              </div>
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              
              {currentStudent && currentStudent.remaining_balance > 0 && amount !== currentStudent.remaining_balance && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setValue("amount", currentStudent.remaining_balance)}
                  className="text-xs text-blue-600 hover:text-blue-700 h-auto py-1"
                >
                  Payer le solde complet ({formatMontant(currentStudent.remaining_balance)})
                </Button>
              )}
            </div>

            {/* Nouveau solde */}
            {amount > 0 && currentStudent && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Nouveau solde</span>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {formatMontant(newBalance)}
                  </span>
                </div>
              </div>
            )}

            {/* Date de paiement */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de paiement
              </Label>
              <Controller
                name="payment_date"
                control={control}
                rules={{ required: "Date requise" }}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    minDate={new Date(1900, 0, 1)}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.payment_date && <p className="text-sm text-red-500">{errors.payment_date.message}</p>}
            </div>

            {/* Mode de paiement */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Mode de paiement
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setValue("payment_method", method.value)}
                    className={`p-2.5 rounded-lg border transition-all text-left ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Référence */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Référence
              </Label>
              <Input
                {...register("reference", { required: "Référence requise" })}
                placeholder="Ex: Bordereau #12345"
                disabled={isSubmitting}
              />
              {errors.reference && <p className="text-sm text-red-500">{errors.reference.message}</p>}
            </div>
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
            }}
            className="flex-1"
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="payment-form"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}