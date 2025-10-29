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
import { Badge } from "@/components/ui/badge";
import ContentLayout from '@/layout/ContentLayout';

interface MyAbsencesListSectionProps {
  filteredAbsences: Absence[];
  getStatutColor: (status: string) => string;
  getStatutLabel: (status: string) => string;
  handleViewDetails: (absence: Absence) => void;
  handleSubmitJustification: () => void;
}

export default function MyAbsencesListSection({
  filteredAbsences,
  getStatutColor,
  getStatutLabel,
  handleViewDetails,
  handleSubmitJustification,
}: MyAbsencesListSectionProps) {

  const columns: TableColumn<Absence>[] = [
    {
      key: "recorded_at",
      label: "Date",
      render: (value, row) =>
        row.recorded_at
          ? new Date(row.recorded_at).toLocaleDateString("fr-FR")
          : "—",
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
    },
    {
      key: "horaire",
      label: "Horaires",
      render: (_, row) =>
        `${row.start_time ? new Date(row.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"} - ${row.end_time ? new Date(row.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"
        }`,
    },
    {
      key: "status_code",
      label: "Statut",
      render: (_, row) => (
        <Badge variant="secondary" className={getStatutColor(row.status_code)}>
          {getStatutLabel(row.status_code)}
        </Badge>
      ),
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

            {/** Optional: if justification_id exists in future API */}
            {/** row.justification_id && (
              <DropdownMenuItem>
                <Link2 className="mr-2 h-4 w-4" /> Voir justificatif lié
              </DropdownMenuItem>
            ) **/}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
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
        />
      </ContentLayout>
    </div>
  );
}