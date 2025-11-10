import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  showAction?: boolean
  onActionClick?: () => void
  actionLabel?: string
}

export function EmptyState({
  title = "Aucune donnée disponible",
  description = "Aucun relevé de notes n'a été trouvé pour cette période.",
  showAction = false,
  onActionClick,
  actionLabel = "Rafraîchir"
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-slate-200 bg-white">
      <CardContent className="pt-12 pb-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <FileQuestion className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            {description}
          </p>
          {showAction && onActionClick && (
            <Button
              variant="outline"
              onClick={onActionClick}
              className="gap-2"
            >
              <Inbox className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}