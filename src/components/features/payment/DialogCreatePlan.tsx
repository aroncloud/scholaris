/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Combobox } from "@/components/ui/Combobox"
import { DatePicker } from "@/components/DatePicker"
import { Save, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { IGetFeeType } from "@/types/financialTypes"
import { ICurriculumDetail } from "@/types/programTypes"

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

interface DialogCreatePlanProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  curriculumList: ICurriculumDetail[]
  feeList: IGetFeeType[]
  onSubmit: (data: any) => Promise<boolean>
  isLoading?: boolean
}

export default function DialogCreatePlan({
  open,
  onOpenChange,
  curriculumList,
  feeList,
  onSubmit,
  isLoading = false
}: DialogCreatePlanProps) {

  const mandatoryFees = useMemo(() => feeList.filter(fee => fee.is_mandatory === 1), [feeList])

  const [curriculumCode, setCurriculumCode] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [installments, setInstallments] = useState(
    mandatoryFees.map(fee => ({
      type_code: fee.type_code,
      title: fee.title,
      amount: "",
      due_date: ""
    }))
  )

  const handleInstallmentChange = (index: number, field: string, value: string) => {
    const updated = [...installments]
    updated[index] = { ...updated[index], [field]: value }
    setInstallments(updated)
  }

  const handleSubmit = async () => {
    const payload = {
      curriculum_code: curriculumCode,
      total_amount: parseFloat(totalAmount),
      installments: installments.map(inst => ({
        type_code: inst.type_code,
        title: inst.title,
        amount: parseFloat(inst.amount),
        due_date: inst.due_date
      }))
    }

    const success = await onSubmit(payload)

    if (success) {
      setCurriculumCode("")
      setTotalAmount("")
      setInstallments(mandatoryFees.map(fee => ({
        type_code: fee.type_code,
        title: fee.title,
        amount: "",
        due_date: ""
      })))
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setCurriculumCode("")
    setTotalAmount("")
    setInstallments(mandatoryFees.map(fee => ({
      type_code: fee.type_code,
      title: fee.title,
      amount: "",
      due_date: ""
    })))
    onOpenChange(false)
  }

  const totalInstallments = installments.reduce((acc, inst) => {
    return acc + (parseFloat(inst.amount) || 0)
  }, 0)

  const total = parseFloat(totalAmount) || 0
  const isBalanced = total > 0 && totalInstallments === total

  const curriculumOptions = curriculumList.map(curriculum => ({
    value: curriculum.curriculum_code,
    label: curriculum.curriculum_name
  }))

  const getColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
    return colors[index % colors.length]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-2xl max-w-3xl max-h-[95vh] overflow-hidden p-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Nouvelle grille tarifaire
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Contenu */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-6 py-6 space-y-6">
          
          {/* Curriculum & Montant */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Curriculum
              </label>
              <Combobox
                value={curriculumCode}
                onChange={setCurriculumCode}
                options={curriculumOptions}
                placeholder="Sélectionner..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Montant Total (FCFA)
              </label>
              <Input
                type="number"
                placeholder="450000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="h-10 text-lg"
              />
              {totalAmount && (
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {formatMontant(parseFloat(totalAmount))}
                </p>
              )}
            </div>
          </div>

          {/* Échéances */}
          <div className="space-y-3">
            {mandatoryFees.map((fee, index) => (
              <Card key={fee.type_code} className="border-slate-200">
                <CardContent className="px-4 space-y-3">
                  
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${getColor(index)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-slate-900">
                      {fee.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">
                        Montant
                      </label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={installments[index]?.amount || ""}
                        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div>
                      <DatePicker
                        selected={installments[index]?.due_date ? new Date(installments[index].due_date) : undefined}
                        onChange={(date) => handleInstallmentChange(index, 'due_date', date ? date.toISOString().split('T')[0] : '')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Résumé */}
          {total > 0 && (
            <Card className={`border-2 ${
              isBalanced ? 'border-emerald-500 bg-emerald-50' : 'border-amber-500 bg-amber-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {isBalanced ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${
                      isBalanced ? 'text-emerald-900' : 'text-amber-900'
                    }`}>
                      {isBalanced ? 'Montants équilibrés' : 'Attention'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isBalanced ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      Total: {formatMontant(totalInstallments)} / {formatMontant(total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-6 py-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isBalanced || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "..." : "Enregistrer"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}