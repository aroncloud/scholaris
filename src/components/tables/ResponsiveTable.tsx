/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  searchKey?: keyof T | (keyof T)[];
  paginate?: number;
  showMore?: ShowMoreOption;
  onRowClick?: (row: T) => void;
  locale?: "fr" | "en";
}

// Role translations
const roleTranslations = {
  en: {
    ADMIN_SUPER: "Super Administrator",
    ADMIN_HR: "HR Administrator", 
    ADMIN_ACADEMIC: "Academic Administrator",
    FINANCE: "Finance",
    DEPT_HEAD: "Department Head",
    TEACHER: "Teacher",
    STUDENT: "Student",
    STAFF: "Staff",
  },
  fr: {
    ADMIN_SUPER: "Super Administrateur",
    ADMIN_HR: "Administrateur RH",
    ADMIN_ACADEMIC: "Administrateur Académique",
    FINANCE: "Comptable / Service Financier",
    DEPT_HEAD: "Chef de Département",
    TEACHER: "Enseignant",
    STUDENT: "Étudiant",
    STAFF: "Personnel / Collaborateur",
  },
};

// Helper function to get translated role name
const getTranslatedRoleName = (roleCode: string, locale: "fr" | "en") => {
  return roleTranslations[locale][roleCode as keyof typeof roleTranslations.en] || roleCode;
};

// Helper function to render profiles/roles
const renderProfiles = (profiles: any[], locale: "fr" | "en") => {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    return <span className="text-gray-400 italic">Aucun rôle</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {profiles.map((profile, index) => {
        // Handle both role_title (from backend) and role_code
        const displayName = profile.role_title && locale === "fr" 
          ? profile.role_title 
          : getTranslatedRoleName(profile.role_code, locale);
          
        return (
          <span
            key={profile.profile_code || index}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {displayName}
          </span>
        );
      })}
    </div>
  );
};

export const ResponsiveTable = <T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  paginate,
  showMore,
  onRowClick,
  locale = "fr",
}: DataTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering with support for nested profile search
  const filteredData = searchKey && searchTerm
    ? data.filter((row) => {
        const keys = Array.isArray(searchKey) ? searchKey : [searchKey];
        return keys.some((key) => {
          const value = row[key];
          
          // Special handling for profiles array search
          if (key === 'profiles' && Array.isArray(value)) {
            return value.some(profile => {
              const roleName = profile.role_title || getTranslatedRoleName(profile.role_code, locale);
              return roleName.toLowerCase().includes(searchTerm.toLowerCase());
            });
          }
          
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    : data;

  useEffect(() => setPage(1), [searchTerm]);

  const startIndex = paginate ? (page - 1) * paginate : 0;
  const endIndex = paginate ? startIndex + paginate : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = paginate ? Math.ceil(filteredData.length / paginate) : 1;

  // Enhanced columns with specialized rendering
  const enhancedColumns = columns.map((col) => {
    // Handle profiles column
    if (col.key === "profiles" || col.key === "roles") {
      return {
        ...col,
        render: (profiles: any[]) => renderProfiles(profiles, locale),
      };
    }
    
    // Handle single role column (if you have one)
    if (col.key === "role") {
      return {
        ...col,
        render: (value: string) => getTranslatedRoleName(value, locale),
      };
    }
    
    // Handle status translations
    if (col.key === "status_code") {
      return {
        ...col,
        render: (value: string) => {
          const statusTranslations = {
            fr: {
              ACTIVE: "Actif",
              SUSPENDED: "Suspendu",
              INACTIVE: "Inactif",
            },
            en: {
              ACTIVE: "Active",
              SUSPENDED: "Suspended", 
              INACTIVE: "Inactive",
            }
          };
          
          const translatedStatus = statusTranslations[locale][value as keyof typeof statusTranslations.en] || value;
          
          // Add color styling based on status
          const statusColors = {
            ACTIVE: "bg-green-100 text-green-800",
            SUSPENDED: "bg-red-100 text-red-800", 
            INACTIVE: "bg-gray-100 text-gray-800",
          };
          
          return (
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColors[value as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
              {translatedStatus}
            </span>
          );
        },
      };
    }
    
    return col;
  });

  return (
    <div className="w-full space-y-4">
      {searchKey && (
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={locale === "fr" ? "Rechercher..." : "Search..."}
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
              {enhancedColumns.map((col, index) => (
                <TableHead
                  key={uuidv4()}
                  className={`px-4 py-2 text-left ${index < enhancedColumns.length - 1 ? 'border-r border-gray-200' : ''}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={enhancedColumns.length} className="text-center py-4 text-gray-500">
                  {locale === "fr" ? "Aucun résultat trouvé" : "No results found"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={uuidv4()}
                  className={`hover:bg-gray-50 cursor-pointer ${rowIndex < paginatedData.length - 1 ? 'border-b border-gray-200' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {enhancedColumns.map((col, colIndex) => (
                    <TableCell
                      key={uuidv4()}
                      className={`px-4 py-2 ${colIndex < enhancedColumns.length - 1 ? 'border-r border-gray-200' : ''}`}
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
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setPage((p) => Math.max(p - 1, 1))} 
            disabled={page === 1}
          >
            {locale === "fr" ? "Précédent" : "Previous"}
          </Button>
          <span className="text-gray-700 px-4">
            {locale === "fr" ? `Page ${page} sur ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))} 
            disabled={page === totalPages}
          >
            {locale === "fr" ? "Suivant" : "Next"}
          </Button>
        </div>
      )}

      {showMore && !paginate && (
        <div className="text-center pt-4">
          <a href={showMore.url} className="flex justify-center items-center gap-2 text-blue-600 hover:underline">
            {showMore.label || (locale === "fr" ? "Voir plus" : "Show more")} <ListCollapse size={20} />
          </a>
        </div>
      )}
    </div>
  );
};