import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { EvaluationItem } from "./EvaluationItem"
import { IGradeDetail } from "@/types/userType" // Importez le type depuis votre fichier de types

interface ModuleCardProps {
  moduleName: string
  moduleCode?: string
  result?: string | null
  details: IGradeDetail[] // Utilisez directement le type de votre API
}

export function ModuleCard({ moduleName, moduleCode, result, details }: ModuleCardProps) {
  const resultValue = result ? parseFloat(result) : null

  return (
    <Card className="border-slate-200 overflow-hidden pt-0 gap-4">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white pb-2 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              {moduleCode && (
                <Badge variant="secondary" className="font-mono text-xs bg-white/20 text-white border-white/30">
                  {moduleCode}
                </Badge>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold break-words">
              {moduleName}
            </h3>
          </div>
          {resultValue !== null && (
            <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
              <p className="text-xs text-slate-200 mb-1 uppercase tracking-wider">
                Résultat
              </p>
              <p className={`text-2xl font-bold ${resultValue >= 10 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {resultValue.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 md:px-4">
        <div className="pb-2 space-y-6">
          {details.map((detail, idx) => (
            <EvaluationItem key={idx} detail={detail} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}