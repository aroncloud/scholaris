import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonMyAbsenceTab() {
  // Create an array of 5 skeleton rows
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b">
        <div className="col-span-1 text-sm font-medium text-gray-500">Date</div>
        <div className="col-span-4 text-sm font-medium text-gray-500">UE / Cours</div>
        <div className="col-span-1 text-sm font-medium text-gray-500">Horaires</div>
        <div className="col-span-1 text-sm font-medium text-gray-500">Type</div>
        <div className="col-span-1 text-sm font-medium text-gray-500">Durée</div>
        <div className="col-span-2 text-sm font-medium text-gray-500">Statut</div>
        <div className="col-span-2 text-right text-sm font-medium text-gray-500">Actions</div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {skeletonRows.map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
            {/* Date */}
            <div className="md:col-span-1 flex items-center">
              <Skeleton className="h-4 w-20" />
            </div>
            
            {/* UE / Cours */}
            <div className="md:col-span-4 space-y-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-32" />
            </div>
            
            {/* Horaires */}
            <div className="md:col-span-1 flex items-center">
              <Skeleton className="h-4 w-24" />
            </div>
            
            {/* Type */}
            <div className="md:col-span-1 flex items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            
            {/* Durée */}
            <div className="md:col-span-1 flex items-center">
              <Skeleton className="h-4 w-12" />
            </div>
            
            {/* Statut */}
            <div className="md:col-span-2 flex items-center">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            {/* Actions */}
            <div className="md:col-span-2 flex justify-end items-center">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
