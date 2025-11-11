"use client"

import { Controller, useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IRecordDeposit, IGetStudentSummary } from "@/types/financialTypes"
import { useEffect, useState } from "react"
import { DollarSign, Calendar, FileText, Wallet, Loader2, Save } from "lucide-react"
import Badge from "@/components/custom-ui/Badge"
import { DatePicker } from "@/components/DatePicker"
import { getStudentFinancialSummary } from "@/actions/financialAction"
import { useAcademicYearStore } from "@/store/useAcademicYearStore"
import { IListStudent } from "@/types/staffType"

interface DialogRecordSingleDepositProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: IListStudent | null;
  onSave: (deposit: IRecordDeposit) => Promise<boolean>;
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

export default function DialogRecordSingleDeposit({
  open,
  onOpenChange,
  student,
  onSave
}: DialogRecordSingleDepositProps) {

  const { selectedAcademicYear } = useAcademicYearStore();
  const [studentSummary, setStudentSummary] = useState<IGetStudentSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<IRecordDeposit>()

  const amount = watch("amount")
  const paymentMethod = watch("payment_method")

  useEffect(() => {
    const fetchStudentSummary = async () => {
      if (student && open && selectedAcademicYear) {
        setLoading(true);
        try {
          const result = await getStudentFinancialSummary(student.user_code, selectedAcademicYear);
          console.log('-->studentSummary.result', result);
          if (result.code === 'success') {
            setStudentSummary(result.data.body);

            // Set default values
            setValue("student_user_code", student.user_code);
            setValue("payment_date", new Date().toISOString().split('T')[0]);

            if (result.data.body.remaining_balance > 0) {
              setValue("amount", result.data.body.remaining_balance);
            }
          }
        } catch (error) {
          console.error("Error fetching student summary:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudentSummary();
  }, [student, open, selectedAcademicYear, setValue]);

  const onSubmit = async (data: IRecordDeposit) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      student_user_code: student ? student.user_code : ""
    };
    const result = await onSave(payload);
    if(result) {
      reset();
      setStudentSummary(null);
      onOpenChange(false);
    }
  }

  const newBalance = studentSummary
    ? Math.max(0, studentSummary.remaining_balance - (amount || 0))
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
         <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Enregistrer un paiement
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">Remplissez les informations d&apos;un Paiement</DialogDescription>
          </DialogHeader>
    

        {/* Contenu avec scroll */}
         <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Étudiant (read-only) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>Étudiant</span>
                  {studentSummary && studentSummary.remaining_balance === 0 && (
                    <Badge value="Soldé" variant="success" size="sm" label={"Soldé"}/>
                  )}
                </Label>
                <Input
                  value={student ? `${student.first_name} ${student.last_name} - ${student.student_number}` : ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Infos étudiant */}
              {studentSummary && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total dû</span>
                    <span className="font-semibold">{formatMontant(studentSummary.total_due)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Déjà payé</span>
                    <span className="font-semibold text-green-600">{formatMontant(studentSummary.total_paid)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-1.5">
                    <span className="text-gray-600 dark:text-gray-400">Reste à payer</span>
                    <span className="font-bold text-orange-600">{formatMontant(studentSummary.remaining_balance)}</span>
                  </div>
                  {studentSummary.available_credit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Crédit disponible</span>
                      <span className="font-semibold text-blue-600">{formatMontant(studentSummary.available_credit)}</span>
                    </div>
                  )}
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
                      max: studentSummary ? {
                        value: studentSummary.remaining_balance,
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

                {studentSummary && studentSummary.remaining_balance > 0 && amount !== studentSummary.remaining_balance && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue("amount", studentSummary.remaining_balance)}
                    className="text-xs text-blue-600 hover:text-blue-700 h-auto py-1"
                  >
                    Payer le solde complet ({formatMontant(studentSummary.remaining_balance)})
                  </Button>
                )}
              </div>

              {/* Nouveau solde */}
              {amount > 0 && studentSummary && (
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
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                reset()
                setStudentSummary(null)
              }}
              disabled={isSubmitting || loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="payment-form"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              disabled={isSubmitting || loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
