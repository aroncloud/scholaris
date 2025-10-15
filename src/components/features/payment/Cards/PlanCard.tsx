"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Badge from '@/components/custom-ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, MoreVertical, Edit2, Trash2, Calendar, DollarSign } from "lucide-react"
import { IGetPlan } from "@/types/financialTypes"

interface PlanCardProps {
  plan: IGetPlan;
  curriculumName?: string;
  onEdit?: (plan: IGetPlan) => void;
  onDelete?: (feeCode: string) => void;
}

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(montant) + ' FCFA'
}

const formatDateToText = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

const getInstallmentColor = (index: number) => {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-pink-100 text-pink-700 border-pink-200',
  ]
  return colors[index % colors.length]
}

export default function PlanCard({ 
  plan, 
  curriculumName,
  onEdit, 
  onDelete 
}: PlanCardProps) {
  return (
    <Card className="border-2 border-slate-200 hover:shadow-xl transition-all duration-300 group overflow-hidden">
      
      <CardContent className="px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 truncate">
                {curriculumName || "Programme"}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {plan.installments.length} tranche{plan.installments.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                onClick={() => onEdit?.(plan)}
                className="gap-2 cursor-pointer"
              >
                <Edit2 className="h-4 w-4 text-blue-600" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(plan.fee_code)}
                className="gap-2 text-rose-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Montant total */}
        <div className="relative mb-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl" />
          <div className="relative p-4 rounded-xl border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Montant Total
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatMontant(plan.total_amount)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Liste des échéances */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Échéancier de paiement
          </h4>
          
          <div className="space-y-2">
            {plan.installments.map((installment, index) => (
              <div 
                key={installment.installment_code} 
                className="group/item flex items-center justify-between p-3 rounded-lg border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold border-2 ${getInstallmentColor(index)}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {installment.title}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateToText(installment.due_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <Badge variant="neutral" size="sm" value={formatMontant(installment.amount)} />
                  <p className="text-xs text-slate-500 mt-1">
                    {((installment.amount / plan.total_amount) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge statut */}
        {plan.is_active === 1 && (
          <div className="mt-4 pt-4 border-t">
            <Badge variant="success" size="sm" value="✓ Plan actif" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <Button 
            variant="outline-info"
            onClick={() => onEdit?.(plan)}
            className="flex-1"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button 
            variant="outline-danger"
            onClick={() => onDelete?.(plan.fee_code)}
            className="flex-1 flex justify-center items-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}