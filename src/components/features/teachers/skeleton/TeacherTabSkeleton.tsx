import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherTabSkeleton() {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Enseignant</TableHead>
          <TableHead>Spécialité</TableHead>
          <TableHead>Contrat</TableHead>
          <TableHead>Date d&apos;embauche</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((_, idx) => (
          <TableRow key={idx}>
            {/* Enseignant */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </TableCell>

            {/* Spécialité */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </TableCell>

            {/* Contrat */}
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>

            {/* Date d'embauche */}
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>

            {/* Statut */}
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex space-x-0.5">
                <Skeleton className="h-1 w-1 rounded-full" />
                <Skeleton className="h-1 w-1 rounded-full" />
                <Skeleton className="h-1 w-1 rounded-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}