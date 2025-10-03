'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Plus } from "lucide-react";
import { ResponsiveTable } from "@/components/tables/ResponsiveTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Absence {
  id: number;
  dateAbsence: string;
  heureDebut: string;
  heureFin: string;
  dureeHeures: number;
  ue: string;
  cours: string;
  enseignant: string;
  type: "cours" | "tp" | "td" | "examen";
  statut: "non_justifiee" | "justifiee" | "en_attente";
  status_code?: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING' | 'PENDING_REVIEW';
  justificatifId?: number;
  motif?: string;
  absence_code?: string;
}
interface AbsenceHistorySectionProps {
  absences: Absence[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (absence: Absence) => void;
  getTypeColor: (type: string) => string;
  getStatutColor: (statut: string) => string;
  getStatutLabel: (statut: string) => string;
  onRefresh: () => void;
  onSubmitJustificatif: (absenceId?: number) => void;
}

export function AbsenceHistorySection({
  absences,
  searchTerm,
  onSearchChange,
  onViewDetails,
  getTypeColor,
  getStatutColor,
  getStatutLabel,
  onRefresh,
  onSubmitJustificatif,
}: AbsenceHistorySectionProps) {
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string, row: Absence) => (
        <div>{new Date(row.dateAbsence).toLocaleDateString('fr-FR')}</div>
      ),
    },
    {
      key: 'ue',
      label: 'UE / Cours',
      render: (value: string, row: Absence) => (
        <div>
          <div className="font-medium">{row.ue}</div>
          <div className="text-sm text-muted-foreground">{row.cours}</div>
          <div className="text-xs text-muted-foreground">{row.enseignant}</div>
        </div>
      ),
    },
    {
      key: 'horaires',
      label: 'Horaires',
      render: (value: string, row: Absence) => (
        <div>{row.heureDebut} - {row.heureFin}</div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string, row: Absence) => (
        <Badge className={getTypeColor(row.type)}>
          {row.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'duree',
      label: 'Durée',
      render: (value: string, row: Absence) => (
        <div>{row.dureeHeures}h</div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string, row: Absence) => (
        <Badge className={getStatutColor(row.statut)}>
          {getStatutLabel(row.statut)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: string, row: Absence) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(row)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            {row.statut === 'non_justifiee' && (
              <DropdownMenuItem asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const menu = document.activeElement as HTMLElement;
                    if (menu?.closest) {
                      const menuElement = menu.closest('[role="menu"]') as HTMLElement;
                      if (menuElement) {
                        menuElement.style.display = 'none';
                      }
                    }
                    console.log('Justifier clicked for absence:', {
                      id: row.id,
                      absence_code: row.absence_code,
                      status: row.statut,
                      status_code: row.status_code
                    });
                    // Use the absence_code if available, otherwise use the id
                    try {
                      onSubmitJustificatif(row.id);
                    } catch (error) {
                      console.error('Error in onSubmitJustificatif:', error);
                    }
                  }}
                  className="w-full flex items-center px-2 py-1.5 text-sm text-left cursor-pointer hover:bg-gray-100 rounded"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Justifier
                </button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Table */}
      <div className="rounded-md border-y bg-white shadow-sm p-6">

        <ResponsiveTable
          columns={columns}
          data={absences}
          searchKey={['ue', 'cours', 'enseignant']}
          paginate={10}
          locale="fr"
        />
      </div>
    </div>
  );
}
