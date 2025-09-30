/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, ListCollapse, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import autoAnimate from '@formkit/auto-animate'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ShowMoreOption {
  label?: string;
  url: string;
}

interface FilterOption {
  key: string;
  values: { label: string; value: string }[];
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchKey?: keyof T | (keyof T)[];
  paginate?: number;
  showMore?: ShowMoreOption;
  onRowClick?: (row: T) => void;
  locale?: "fr" | "en";
  isLoading?: boolean;
  filters?: FilterOption[];
}



const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => (
  <TableRow className="animate-pulse">
    {Array.from({ length: columnsCount }).map((_, index) => (
      <TableCell
        key={index}
        className={`px-4 py-4 ${index < columnsCount - 1 ? "border-r border-gray-100" : ""}`}
      >
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </TableCell>
    ))}
  </TableRow>
);


const EmptyState = ({ locale }: { locale: "fr" | "en" }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {locale === "fr" ? "Aucune donnée disponible" : "No data available"}
    </h3>
    <p className="text-gray-500 text-center max-w-sm">
      {locale === "fr"
        ? "Il n'y a actuellement aucune donnée à afficher dans ce tableau."
        : "There is currently no data to display in this table."}
    </p>
  </div>
);

/**
 * Helper générique : récupère la valeur d'un objet via une clé pouvant être en "dot notation".
 * Retourne une chaîne lisible pour la recherche / filtrage.
 */
const getValueByKey = (obj: any, key: string) => {
  if (!obj) return "";
  const parts = key.split(".");
  let value: any = obj;
  for (const part of parts) {
    if (value == null) return "";
    value = value[part];
  }
  if (value == null) return "";
  if (Array.isArray(value)) {
    // Si tableau de primitives
    if (value.every((v) => typeof v !== "object")) return value.join(", ");
    // Si tableau d'objets -> concaténation de leurs valeurs
    return value.map((v) => (typeof v === "object" ? Object.values(v).join(" ") : String(v))).join(" | ");
  }
  if (typeof value === "object") {
    return Object.values(value).join(" ");
  }
  return String(value);
};

export const ResponsiveTable = <T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  paginate,
  showMore,
  onRowClick,
  locale = "fr",
  isLoading = false,
  filters = [],
}: DataTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // const tableBodyRef = useRef(null);
  // useEffect(() => {
  //   if (tableBodyRef.current) {
  //     autoAnimate(tableBodyRef.current, { duration: 300 });
  //   }
  // }, []);
  // Filtrage (search + selects)
  const filteredData = data.filter((row) => {
    // ----- Search
    let matchesSearch = true;
    if (searchTerm) {
      const keys = searchKey ? (Array.isArray(searchKey) ? searchKey : [searchKey]) : columns.map((c) => c.key);
      const term = searchTerm.toString().toLowerCase();
      matchesSearch = keys.some((k) => {
        const str = getValueByKey(row, String(k)).toLowerCase();
        return str.includes(term);
      });
    }

    if (!matchesSearch) return false;

    // ----- Filters selects
    for (const f of filters) {
      const sel = selectedFilters[f.key];
      if (sel && sel !== "") {
        const valStr = getValueByKey(row, f.key).toLowerCase();
        if (!valStr.includes(String(sel).toLowerCase())) return false;
      }
    }

    return true;
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedFilters]);

  const startIndex = paginate ? (page - 1) * paginate : 0;
  const endIndex = paginate ? startIndex + paginate : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = paginate ? Math.max(1, Math.ceil(filteredData.length / paginate)) : 1;

  // Enhanced columns (laisser la possibilité d'un render personnalisé fourni par l'utilisateur)
  const enhancedColumns = columns;

  const anyFilterActive = Object.values(selectedFilters).some((v) => v && v !== "");

  return (
    <div className="w-full space-y-4">
      {/* Barre recherche + filtres */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={locale === "fr" ? "Rechercher..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            disabled={isLoading}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="w-full md:w-48">
            <Select
              value={selectedFilters[filter.key] ?? ""}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  [filter.key]: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    locale === "fr"
                      ? `Filtrer par ${filter.key}`
                      : `Filter by ${filter.key}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === "fr" ? "Tous" : "All"}</SelectItem>
                {filter.values.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Reset filters */}
        {anyFilterActive && (
          <div className="ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFilters({})}
            >
              {locale === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
            </Button>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              {enhancedColumns.map((col, index) => (
                <TableHead
                  key={uuidv4()}
                  className={`px-4 py-2 text-left ${index < enhancedColumns.length - 1 ? "border-r border-gray-100" : ""}`}
                >
                  {isLoading ? (
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: paginate || 5 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={enhancedColumns.length} />
              ))
            ) : paginatedData.length === 0 && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={enhancedColumns.length} className="p-0">
                  <EmptyState locale={locale} />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={enhancedColumns.length} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="font-medium">
                      {locale === "fr" ? "Aucun résultat trouvé" : "No results found"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {locale === "fr" ? "Essayez de modifier votre recherche" : "Try adjusting your search"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={uuidv4()}
                  className={`hover:bg-gray-50 cursor-pointer ${rowIndex < paginatedData.length - 1 ? "border-b border-gray-100" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {enhancedColumns.map((col, colIndex) => (
                    <TableCell
                      key={uuidv4()}
                      className={`px-4 py-2 ${colIndex < enhancedColumns.length - 1 ? "border-r border-gray-100" : ""}`}
                    >
                      {col.render ? col.render(getValueByKey(row, col.key), row) : getValueByKey(row, col.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && paginate && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            {locale === "fr" ? "Précédent" : "Previous"}
          </Button>
          <span className="text-gray-700 px-4">
            {locale === "fr" ? `Page ${page} sur ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            {locale === "fr" ? "Suivant" : "Next"}
          </Button>
        </div>
      )}

      {/* ShowMore link */}
      {!isLoading && showMore && !paginate && (
        <div className="text-center pt-4">
          <a href={showMore.url} className="flex justify-center items-center gap-2 text-gray-600 hover:underline">
            {showMore.label || (locale === "fr" ? "Voir plus" : "Show more")} <ListCollapse size={20} />
          </a>
        </div>
      )}
    </div>
  );
};
