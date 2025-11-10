import { Calendar, Scale, User, MessageSquare } from "lucide-react"
import { IGradeDetail } from "@/types/userType" // Importez le type depuis votre fichier de types
import Badge from "@/components/custom-ui/Badge"

interface EvaluationItemProps {
  detail: IGradeDetail // Utilisez directement le type de votre API
}

const getNoteColor = (note: number): string => {
  if (note >= 16) return "text-emerald-600 font-semibold"
  if (note >= 14) return "text-blue-600 font-semibold"
  if (note >= 12) return "text-slate-700 font-medium"
  if (note >= 10) return "text-amber-600 font-medium"
  return "text-rose-600 font-medium"
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

export function EvaluationItem({ detail }: EvaluationItemProps) {
  const noteOn20 = (detail.score / detail.max_score) * 20

  return (
    <div className="px-2 hover:bg-slate-50/50 transition-colors border-b last:border-b-0 pb-4 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Titre */}
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            <p className="font-semibold text-slate-900 text-sm sm:text-base break-words">
              {detail.evaluation_title}
            </p>
            <Badge value={detail.evaluation_type} label={detail.evaluation_type} variant="neutral" size="sm" />
          </div>

          {/* UE */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge value={detail.course_unit_code} label={detail.course_unit_code} variant="info" size="sm" />
            <span className="text-xs sm:text-sm text-slate-700 break-words">
              {detail.course_unit_name}
            </span>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>{formatDate(detail.evaluation_date)}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Scale className="h-3 w-3 flex-shrink-0" />
              <span>Coef. {detail.coefficient}</span>
            </div>
            {detail.graded_by_first_name && detail.graded_by_last_name && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {detail.graded_by_first_name} {detail.graded_by_last_name}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Commentaires */}
          {detail.comments && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-900 flex items-start gap-2">
              <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span className="break-words">{detail.comments}</span>
            </div>
          )}

          {/* Statut
          <div className="mt-2">
            <Badge value={detail.grade_status} label={detail.grade_status} variant="neutral" size="sm" />
          </div> */}
        </div>

        {/* Note - Mobile: en haut, Desktop: à droite */}
        <div className="text-left sm:text-right sm:ml-4 flex-shrink-0 order-first sm:order-last">
          <p className={`text-2xl sm:text-3xl font-bold ${getNoteColor(noteOn20)}`}>
            {detail.score.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-1">/ {detail.max_score}</p>
          <p className={`text-xs sm:text-sm mt-2 ${getNoteColor(noteOn20)}`}>
            ({noteOn20.toFixed(2)}/20)
          </p>
        </div>
      </div>
    </div>
  )
}