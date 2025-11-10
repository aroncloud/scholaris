'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileUp } from "lucide-react";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import { Absence } from "@/types/studentmyabsencesTypes";
import ContentLayout from '@/layout/ContentLayout';
import Badge from '@/components/custom-ui/Badge';

interface MyAbsencesListSectionProps {
  filteredAbsences: Absence[];
  handleViewDetails: (absence: Absence) => void;
  handleSubmitJustification: () => void;
  loading: boolean;
}

export default function MyAbsencesListSection({
  filteredAbsences,
  handleViewDetails,
  handleSubmitJustification,
  loading
}: MyAbsencesListSectionProps) {

  const columns: TableColumn<Absence>[] = [
    {
      key: "recorded_at",
      label: "Date",
      render: (value, row) =>
        row.recorded_at
          ? new Date(row.recorded_at).toLocaleDateString("fr-FR")
          : "—",
      priority: "medium"
    },

    {
      key: "course_unit_name",
      label: "UE / Cours",
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.course_unit_name || "—"}</div>
          <div className="text-sm text-muted-foreground">{row.session_title || "—"}</div>
        </div>
      ),
      priority: "medium"
    },
    {
      key: "horaire",
      label: "Horaires",
      render: (_, row) =>
        `${row.start_time ? new Date(row.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"} - ${row.end_time ? new Date(row.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"
        }`,
      priority: "medium"
    },
    {
      key: "status_code",
      label: "Statut",
      render: (_, row) => (
        <Badge value={row.status_code} label={row.status_code} size="sm"/>
      ),
      priority: "low"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => handleViewDetails(row)}>
              <Eye className="mr-2 h-4 w-4" /> Voir détails
            </DropdownMenuItem>

            {row.status_code === "UNJUSTIFIED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSubmitJustification}>
                  <FileUp className="mr-2 h-4 w-4" /> Soumettre justificatif
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      priority: "high"
    },
  ];

  return (
    <div className="p-2 md:p-4 lg:p-6">
      <ContentLayout
        title={"Historique des Absences"}
        description="Liste complète de vos absences par chronologie"
      >
        <ResponsiveTable
          columns={columns}
          data={filteredAbsences}
          searchKey={["course_unit_name", "session_title", "status_code"]}
          locale="fr"
          paginate={5}
          isLoading={loading}
        />
      </ContentLayout>
    </div>
  );
}