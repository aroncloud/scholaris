/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Search, ListCollapse, Inbox, Eraser, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Combobox } from "../ui/Combobox";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
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
  searchKey?: string | string[];
  paginate?: number;
  showMore?: ShowMoreOption;
  onRowClick?: (row: T) => void;
  locale?: "fr" | "en";
  isLoading?: boolean;
  filters?: FilterOption[];
  keyField?: string;
}

const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => (
  <tr>
    {Array.from({ length: columnsCount }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="space-y-4">
      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
    </div>
  </div>
);

const EmptyState = ({ locale }: { locale: "fr" | "en" }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      <Inbox className="w-10 h-10 text-blue-400 dark:text-blue-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {locale === "fr" ? "Aucune donnée disponible" : "No data available"}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
      {locale === "fr"
        ? "Il n'y a actuellement aucune donnée à afficher dans ce tableau."
        : "There is currently no data to display in this table."}
    </p>
  </div>
);

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
    if (value.every((v) => typeof v !== "object")) return value.join(", ");
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
  keyField = "id",
}: DataTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const highPriorityColumns = columns.filter((col) => col.priority === 'high');
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium');
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low');

  const filteredData = data.filter((row) => {
    // Recherche
    let matchesSearch = true;
    if (searchTerm) {
      const keys = searchKey 
        ? (Array.isArray(searchKey) ? searchKey : [searchKey]) 
        : columns.map((c) => c.key);
      const term = searchTerm.toString().toLowerCase();
      matchesSearch = keys.some((k) => {
        const str = getValueByKey(row, k).toLowerCase();
        return str.includes(term);
      });
    }

    if (!matchesSearch) return false;

    // Filtres
    for (const f of filters) {
      const sel = selectedFilters[f.key];
      if (sel && sel !== "") {
        const valStr = String(getValueByKey(row, f.key)).toLowerCase();
        if (sel === "true" || sel === "false") {
          if (valStr !== sel) return false;
        } else {
          if (!valStr.includes(String(sel).toLowerCase())) return false;
        }
      }
    }

    return true;
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedFilters]);

  const handlePageChange = (newPage: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  const startIndex = paginate ? (page - 1) * paginate : 0;
  const endIndex = paginate ? startIndex + paginate : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = paginate ? Math.max(1, Math.ceil(filteredData.length / paginate)) : 1;

  const anyFilterActive = Object.values(selectedFilters).some((v) => v && v !== "");

  return (
    <div className="w-full space-y-4">
      {/* Barre recherche + filtres compacte - Mobile uniquement */}
      <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="space-y-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
            <Input
              placeholder={locale === "fr" ? "Rechercher..." : "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 w-full text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Toggle filtres */}
          {filters.length > 0 && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9"
                onClick={() => setShowFilters(!showFilters)}
              >
                <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                {locale === "fr" ? "Filtres" : "Filters"}
                {anyFilterActive && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {Object.values(selectedFilters).filter(v => v && v !== "").length}
                  </span>
                )}
              </Button>

              {showFilters && (
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {filters.map((filter) => (
                    <Combobox
                      key={filter.key}
                      value={selectedFilters[filter.key] || ""}
                      className="h-9 text-sm"
                      onChange={(value) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [filter.key]: value,
                        }))
                      }
                      options={[
                        { value: "", label: locale === "fr" ? "Tous" : "All" },
                        ...filter.values
                      ]}
                      placeholder={
                        locale === "fr"
                          ? `Filtrer par ${filter.key}`
                          : `Filter by ${filter.key}`
                      }
                    />
                  ))}
                  {anyFilterActive && (
                    <Button
                      size="sm"
                      variant="outline-info"
                      className="w-full h-9"
                      onClick={() => {
                        setSelectedFilters({});
                        setShowFilters(false);
                      }}
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      {locale === "fr" ? "Réinitialiser" : "Reset"}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Compteur résultats */}
          {(searchTerm || anyFilterActive) && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">{filteredData.length}</span> {locale === "fr" ? "résultat" : "result"}{filteredData.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Vue Mobile - Cartes */}
      <div className={`md:hidden space-y-3 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {isLoading ? (
          Array.from({ length: paginate || 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : paginatedData.length === 0 && data.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <EmptyState locale={locale} />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {locale === "fr" ? "Aucun résultat trouvé" : "No results found"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {locale === "fr" ? "Essayez de modifier votre recherche" : "Try adjusting your search"}
              </p>
            </div>
          </div>
        ) : (
          paginatedData.map((row) => (
            <div
              key={row[keyField] || uuidv4()}
              onClick={() => onRowClick?.(row)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                {highPriorityColumns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start gap-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-fit">
                      {col.label}:
                    </span>
                    <span className="text-sm text-right text-gray-900 dark:text-gray-100 font-medium">
                      {col.render ? col.render(getValueByKey(row, col.key), row) : getValueByKey(row, col.key)}
                    </span>
                  </div>
                ))}
              </div>
              {mediumPriorityColumns.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
              )}
              <div className="space-y-2">
                {mediumPriorityColumns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start gap-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-fit">
                      {col.label}:
                    </span>
                    <span className="text-sm text-right text-gray-800 dark:text-gray-200">
                      {col.render ? col.render(getValueByKey(row, col.key), row) : getValueByKey(row, col.key)}
                    </span>
                  </div>
                ))}
              </div>
              {lowPriorityColumns.length > 0 && (
                <>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>
                  <div className="space-y-2">
                    {lowPriorityColumns.map((col) => (
                      <div key={col.key} className="flex justify-between items-start gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-fit">
                          {col.label}:
                        </span>
                        <span className="text-xs text-right text-gray-700 dark:text-gray-300">
                          {col.render ? col.render(getValueByKey(row, col.key), row) : getValueByKey(row, col.key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Vue Desktop - Tableau avec recherche intégrée */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            {/* Ligne de recherche et filtres */}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th colSpan={columns.length} className="px-6 py-3">
                <div className="flex items-center gap-3">
                  {/* Barre de recherche compacte */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
                    <Input
                      placeholder={locale === "fr" ? "Rechercher..." : "Search..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 h-9 w-full text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Filtres en ligne */}
                  {filters.length > 0 && (
                    <div className="flex items-center gap-2 flex-1">
                      {filters.map((filter) => (
                        <div key={filter.key} className="w-44">
                          <Combobox
                            value={selectedFilters[filter.key] || ""}
                            className="h-9 text-sm"
                            onChange={(value) =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                [filter.key]: value,
                              }))
                            }
                            options={[
                              { value: "", label: locale === "fr" ? "Tous" : "All" },
                              ...filter.values
                            ]}
                            placeholder={
                              locale === "fr"
                                ? `${filter.key}`
                                : `${filter.key}`
                            }
                          />
                        </div>
                      ))}

                      {anyFilterActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 px-3"
                          onClick={() => setSelectedFilters({})}
                        >
                          <Eraser className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Compteur de résultats */}
                  {(searchTerm || anyFilterActive) && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredData.length}</span> {locale === "fr" ? "résultat" : "result"}{filteredData.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </th>
            </tr>

            {/* Ligne d'en-têtes de colonnes */}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {columns.map((col) => (
                <th
                  key={uuidv4()}
                  className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs"
                >
                  {isLoading ? (
                    <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded w-24 animate-pulse"></div>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`divide-y divide-gray-100 dark:divide-gray-700 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {isLoading ? (
              Array.from({ length: paginate || 5 }).map((_, index) => (
                <SkeletonRow key={index} columnsCount={columns.length} />
              ))
            ) : paginatedData.length === 0 && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState locale={locale} />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {locale === "fr" ? "Aucun résultat trouvé" : "No results found"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {locale === "fr" ? "Essayez de modifier votre recherche" : "Try adjusting your search"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row[keyField] || uuidv4()}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 cursor-pointer transition-all duration-200"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={uuidv4()}
                      className="px-6 py-4 text-gray-800 dark:text-gray-200"
                    >
                      {col.render ? col.render(getValueByKey(row, col.key), row) : getValueByKey(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && paginate && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1 || isTransitioning}
            className="px-4 h-10 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all disabled:opacity-50"
          >
            {locale === "fr" ? "Précédent" : "Previous"}
          </Button>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {locale === "fr" ? `Page ${page} sur ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages || isTransitioning}
            className="px-4 h-10 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all disabled:opacity-50"
          >
            {locale === "fr" ? "Suivant" : "Next"}
          </Button>
        </div>
      )}

      {/* ShowMore link */}
      {!isLoading && showMore && !paginate && (
        <div className="text-center pt-2">
          <a
            href={showMore.url}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-blue-700 dark:text-blue-400 font-medium rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-md"
          >
            {showMore.label || (locale === "fr" ? "Voir plus" : "Show more")}
            <ListCollapse size={18} />
          </a>
        </div>
      )}
    </div>
  );
};