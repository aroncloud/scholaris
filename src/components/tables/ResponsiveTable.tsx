/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react";
import { Search, ListCollapse } from "lucide-react";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ShowMoreOption {
  label?: string;
  url: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchKey?: keyof T | (keyof T)[]; // clé unique ou tableau
  paginate?: number;
  showMore?: ShowMoreOption;
  onRowClick?: (row: T) => void;
}

export const ResponsiveTable = <T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  paginate,
  showMore,
  onRowClick,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage
  const filteredData = searchKey && searchTerm
    ? data.filter((row) => {
        const keys = Array.isArray(searchKey) ? searchKey : [searchKey];
        return keys.some((key) => {
          const value = row[key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    : data;

  useEffect(() => setPage(1), [searchTerm]);

  const startIndex = paginate ? (page - 1) * paginate : 0;
  const endIndex = paginate ? startIndex + paginate : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = paginate ? Math.ceil(filteredData.length / paginate) : 1;


  return (
    <div className="w-full space-y-4">
      {searchKey && (
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead 
                  key={uuidv4()}
                  className={`px-4 py-2 text-left ${index < columns.length - 1 ? 'border-r border-gray-200' : ''}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4 text-gray-500">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={uuidv4()}
                  className={`hover:bg-gray-50 cursor-pointer ${rowIndex < paginatedData.length - 1 ? 'border-b border-gray-200' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell 
                      key={uuidv4()} 
                      className={`px-4 py-2 ${colIndex < columns.length - 1 ? 'border-r border-gray-200' : ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginate && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
          <span className="text-gray-700 px-4">Page {page} / {totalPages}</span>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      {showMore && !paginate && (
        <div className="text-center pt-4">
          <a href={showMore.url} className="flex justify-center items-center gap-2 text-blue-600 hover:underline">
            {showMore.label || "Voir plus"} <ListCollapse size={20} />
          </a>
        </div>
      )}
    </div>
  );
};
