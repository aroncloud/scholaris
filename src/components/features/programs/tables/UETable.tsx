"use client";

import React, { useState } from "react";
import { ICreateUE, IGetUEPerModule } from "@/types/programTypes"; // adapte le chemin si besoin
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { DialogUpdateUE } from "../Modal/DialogUpdateUE";
import { showToast } from "@/components/ui/showToast";
import { assignATeacherToACourseUnit, updateUE } from "@/actions/programsAction";
import { useTeacherStore } from "@/store/useTeacherStore";
import { DialogAssignUEToTeacher } from "../Modal/DialogAssignUEToTeacher";

type UETableProps = {
  ues: IGetUEPerModule[];
  compact?: boolean; // optionnel: lignes plus serrées
  refresh: () => void;
};

const UETable: React.FC<UETableProps> = ({ ues, compact = true, refresh }) => {
  const [selectedUE, setSelectedUE] = useState<ICreateUE | null>(null);
  const [isUpdateUEDialogOpen, setIsUpdateUEDialogOpen] = useState(false);
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const { teacherList } = useTeacherStore();

  if (!ues || ues.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 border rounded-md">
        Aucune UE pour le moment.
      </div>
    );
  }


  console.log("Teacher List from Store:", teacherList);
  
  
  const handleUpdateUE = async (ue: ICreateUE) => {
    const result = await updateUE(ue);
    console.log("Update UE result:", result);

    if (result.code === 'success') {
      setIsUpdateUEDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'UE mise à jour avec succès',
        description: `${ue.course_unit_name} a été modifiée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour l'UE",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
      return false;
    }

    return true;
  };

  const assignTeacher = async (ueCode: string, teacherCode: string): Promise<void> => {
    const result = await assignATeacherToACourseUnit(ueCode, teacherCode);
    console.log("Assign Teacher to UE result:", result);
    if(result.code === 'success') {
      showToast({
        variant: "success-solid",
        message: 'Assignation effecué avec succès',
        description: `L'UE ${ues.find(u => u.course_unit_code === ueCode)?.course_unit_name} a été assignée à l'enseignant ${teacherList.find(t => t.user_code === teacherCode)?.first_name} ${teacherList.find(t => t.user_code === teacherCode)?.last_name}.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({ 
        variant: "error-solid",
        message: "Impossible de créer la salle de classe",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
    return;
  };


  return (
    <div className="rounded-md border mb-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UE</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Heures (CM / TD)</TableHead>
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


              <TableCell>
                <Badge variant={ue.is_mandatory === 1 ? "success" : "neutral"} size="sm" label={ue.is_mandatory === 1 ? "Oui" : "Non"} />
              </TableCell>

              <TableCell>
                <Badge size="sm" label={ ue.teacher ? ue.teacher.first_name + ' ' + ue.teacher.last_name : "N/A"} />
              </TableCell>

              <TableCell>
                <Badge size="sm" value={ue.status_code} label={ue.status_code} />
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
                    <DropdownMenuItem onClick={() => {
                      setSelectedUE(ue);
                      setIsUpdateUEDialogOpen(true);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedUE(ue);
                      setIsAssignTeacherDialogOpen(true);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Assigner un enseignant
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => {}}>
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


      {(selectedUE && isUpdateUEDialogOpen) && <DialogUpdateUE
        ueData={selectedUE}
        onOpenChange={setIsUpdateUEDialogOpen}
        open={isUpdateUEDialogOpen}
        moduleCode={selectedUE.module_code}
        onSave={handleUpdateUE}
      />}
      
      {(selectedUE && isAssignTeacherDialogOpen) && <DialogAssignUEToTeacher
        ue={ues.find(u => u.course_unit_code === selectedUE.course_unit_code)!}
        teacherList={teacherList}
        onAssignTeacher={assignTeacher}
        onOpenChange={setIsAssignTeacherDialogOpen}
        open={isAssignTeacherDialogOpen}
      />}
    </div>
  );
};

export default UETable;
