/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ListCollapse } from 'lucide-react';

// Types
type ResponsiveColumn<T> = ColumnDef<T> & {
  priority?: 'high' | 'medium' | 'low';
  label?: string;
};

interface ShowMoreOption {
  label?: string;
  url: string;
}

interface ResponsiveDataTableProps<T> {
  columns: ResponsiveColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  showMore?: ShowMoreOption;
  paginate?: number;
  searchKey?: string;
  searchPlaceholder?: string;
  enableMobileView?: boolean;
}

export function ResponsiveDataTable<T>({
  columns,
  data,
  onRowClick,
  showMore,
  paginate = 10,
  searchKey,
  searchPlaceholder = "Rechercher...",
  enableMobileView = true,
}: ResponsiveDataTableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginate,
  });

  const highPriorityColumns = columns.filter((col) => col.priority === 'high');
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium');
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination,
    },
  });

  const searchValue = searchKey ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? "" : "";

  const handleSearchChange = (value: string) => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  // Réinitialiser la page lors d'une recherche
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="w-full">
      {/* Barre de recherche */}
      {searchKey && (
        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchValue && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {filteredRowCount} résultat{filteredRowCount !== 1 ? 's' : ''} trouvé{filteredRowCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Vue Mobile - Conditionnelle */}
      {enableMobileView && (
        <div className="md:hidden space-y-2">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className="bg-white dark:bg-gray-800 rounded p-5 shadow-sm border dark:border-gray-600 my-2 space-y-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
            >
              {/* High Priority Fields */}
              <div className="space-y-2">
                {highPriorityColumns.map((col) => {
                  const cell = row.getVisibleCells().find(cell => cell.column.id === col.id);
                  if (!cell) return null;
                  return (
                    <div key={col.id} className="flex justify-between items-start">
                      <span className="font-medium text-gray-600 dark:text-gray-200">
                        {col.label || col.header?.toString()} :
                      </span>
                      <span className="text-right text-gray-600 dark:text-white">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Medium Priority Fields */}
              {mediumPriorityColumns.length > 0 && (
                <>
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                  <div className="space-y-2">
                    {mediumPriorityColumns.map((col) => {
                      const cell = row.getVisibleCells().find(cell => cell.column.id === col.id);
                      if (!cell) return null;
                      return (
                        <div key={col.id} className="flex justify-between items-start">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {col.label || col.header?.toString()} :
                          </span>
                          <span className="text-right text-gray-600 dark:text-gray-200">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Low Priority Fields */}
              {lowPriorityColumns.length > 0 && (
                <>
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                  <div className="space-y-2">
                    {lowPriorityColumns.map((col) => {
                      const cell = row.getVisibleCells().find(cell => cell.column.id === col.id);
                      if (!cell) return null;
                      return (
                        <div key={col.id} className="flex justify-between items-start">
                          <span className="text-gray-500 dark:text-gray-300">
                            {col.label || col.header?.toString()} :
                          </span>
                          <span className="text-right text-gray-600 dark:text-gray-200">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vue Desktop / Tablette avec scroll horizontal */}
      <div className={`${enableMobileView ? 'hidden md:block' : 'block'} bg-white dark:bg-gray-800 rounded shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-2.5 text-gray-900 dark:text-gray-100 whitespace-nowrap"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Message si aucun résultat avec recherche */}
      {table.getRowModel().rows.length === 0 && searchValue && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="mx-auto mb-2" size={48} />
          <p>Aucun résultat trouvé pour &quot;{searchValue}&quot;</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-200">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}

      {/* Show More Link */}
      {showMore && totalPages <= 1 && (
        <>
          <div className={`${enableMobileView ? 'hidden md:block' : 'block'} bg-blue-100 dark:bg-blue-900/60 rounded-b-lg border-t border-blue-100 dark:border-blue-800 text-center py-1.5`}>
            <ShowMoreLink showMore={showMore} />
          </div>
          {enableMobileView && (
            <div className="md:hidden bg-blue-100 dark:bg-blue-900/60 shadow p-2 mt-2 text-center border-t border-blue-100 dark:border-blue-800">
              <ShowMoreLink showMore={showMore} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

const ShowMoreLink = ({ showMore }: { showMore: ShowMoreOption }) => (
  <a
    href={showMore.url}
    className="font-medium text-blue-700 dark:text-blue-300 hover:underline transition flex gap-2 justify-center items-center"
  >
    <span>{showMore.label || 'Voir plus'}</span>
    <span>
      <ListCollapse size={20} className="text-blue-700 dark:text-blue-300" />
    </span>
  </a>
);

// Fonction utilitaire pour créer des colonnes
export const createColumn = <T,>(
  id: string,
  header: string,
  accessorKey: keyof T,
  priority: 'high' | 'medium' | 'low' = 'medium',
  cell?: (info: any) => React.ReactNode
): ResponsiveColumn<T> => ({
  id,
  header,
  accessorKey: accessorKey as string,
  priority,
  label: header,
  cell: cell ? ({ getValue, row }) => cell({ getValue, row: row.original }) : undefined,
});
