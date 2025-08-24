"use client";

import React from "react";
import { IUEPerModuleList } from "@/types/programTypes"; // adapte le chemin si besoin
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

type UETableProps = {
  ues: IUEPerModuleList[];
  onEdit: (ue: IUEPerModuleList) => void;
  onDelete: (ue: IUEPerModuleList) => void;
  compact?: boolean; // optionnel: lignes plus serrées
};

const UETable: React.FC<UETableProps> = ({ ues, onEdit, onDelete, compact = true }) => {
  if (!ues || ues.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 border rounded-md">
        Aucune UE pour le moment.
      </div>
    );
  }

  return (
    <div className="rounded-md border mb-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UE</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Heures (CM / TD)</TableHead>
            <TableHead>Coef.</TableHead>
            <TableHead>Obligatoire</TableHead>
            <TableHead>Coord.</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ues.map((ue) => (
            <TableRow key={ue.course_unit_code} className={compact ? "h-10" : undefined}>
              <TableCell className="max-w-[280px]">
                <div className="font-medium">{ue.course_unit_name}</div>
                <div className="text-xs text-muted-foreground">{ue.course_unit_code}</div>
              </TableCell>

              <TableCell className="text-sm">{ue.internal_code || "-"}</TableCell>

              <TableCell className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded border text-xs">CM: {ue.lecture_hours}</span>
                  <span className="px-2 py-0.5 rounded border text-xs">TD: {ue.lab_tutorial_hours}</span>
                </div>
              </TableCell>

              <TableCell className="text-sm">{ue.coefficient}</TableCell>

              <TableCell>
                {ue.is_mandatory === 1 ? (
                  <Badge variant="default" className="text-xs">Oui</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">Non</Badge>
                )}
              </TableCell>

              <TableCell>
                {ue.is_module_coordinator === 1 ? (
                  <Badge variant="default" className="text-xs">Oui</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">Non</Badge>
                )}
              </TableCell>

              <TableCell>
                {/* au besoin branche ton mapping de couleurs ici */}
                <Badge className={getStatusColor(ue.status_code)}>{ue.status_code}</Badge>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(ue)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(ue)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UETable;
