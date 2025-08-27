import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicantTabSkeleton() {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidat</TableHead>
          <TableHead>Poste visé</TableHead>
          <TableHead>Qualification</TableHead>
          <TableHead>Expérience</TableHead>
          <TableHead>Salaire</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((_, idx) => (
          <TableRow key={idx}>
            {/* Candidat */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </TableCell>

            {/* Poste visé */}
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </TableCell>

            {/* Qualification */}
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>

            {/* Expérience */}
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>

            {/* Salaire */}
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
