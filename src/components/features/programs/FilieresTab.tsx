/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  FileText, MoreHorizontal, Edit,
  Trash2, Plus, Eye, Clock
} from "lucide-react";

import { ICreateProgram, IFactorizedProgram } from "@/types/programTypes";
import { DialogCreateProgram } from "./Modal/DialogCreateProgram";
import { showToast } from "@/components/ui/showToast";
import { createProgram, updateProgram } from "@/actions/programsAction";
import DialogUpdateProgram from "./Modal/DialogUpdateProgram";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import ContentLayout from "@/layout/ContentLayout";

type MyComponentProps = {
  programList: IFactorizedProgram[];
  setIExportModalOpen: (open: boolean) => void;
  setIsImportModalOpen: (open: boolean) => void;
  setIsCreateProgramOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  isImportModalOpen: boolean;
  isCreateProgramOpen: boolean;
  isDataLoading: boolean;
  refresh: () => void;
};





const FilieresTab = ({
  programList,
  isCreateProgramOpen,
  refresh,
  setIsCreateProgramOpen,
  isDataLoading
}: MyComponentProps) => {
  const [selectedProgram, setSelectedProgram] = useState<ICreateProgram | null>(null);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);


  const handleCreateProgram = async (program: ICreateProgram) => {
    const response = await createProgram(program);
    console.log("Create program response:", response);
    if (response.code === 'success') {
        setIsCreateProgramOpen(false);
        showToast({
            variant: "success-solid",
            message: 'Filière créé avec succès',
            description: `${program.program_name} a été ajouté.`,
            position: 'top-center',
        })
        refresh()
    } else {
        showToast({
            variant: "error-solid",
            message: "Impossible de créer la filière",
            description: response.code,
            position: 'top-center',
        })
    }
  }
  const handleEditProgram = async (program: ICreateProgram) => {
    const response = await updateProgram(program);
    console.log("Update program response:", response);
    if (response.code === 'success') {
      setIsCreateProgramOpen(false);
      showToast({
          variant: "success-solid",
          message: 'Filière mise a jourr avec succès',
          description: `${program.program_name} a été mis a jour.`,
          position: 'top-center',
      })
      refresh()
    } else {
      showToast({
          variant: "error-solid",
          message: "Impossible de mettre a jour la filière",
          description: response.code,
          position: 'top-center',
      })
    }
  }

  const filiereColumns: TableColumn<IFactorizedProgram>[] = [
    {
      key: "program",
      label: "Filière",
      render: (_, filiere) => (
        <div>
          <div className="font-medium">{filiere.program.program_name}</div>
          <div className="text-sm text-muted-foreground">
            {filiere.program.description}
          </div>
        </div>
      ),
      priority: "medium",
    },
    {
      key: "curriculums",
      label: "Durée",
      render: (_, filiere) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-muted-foreground mb-1" />
          <span>{filiere.curriculums.length} ans</span>
        </div>
      ),
      priority: "medium",
    },
    {
      key: "curriculums",
      label: "Maquettes",
      render: (_, filiere) => (
        <Badge variant="info" size="sm" label={`${filiere.curriculums.length} maquette(s)`} value="curriculum"/>
      ),
      priority: "low",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, filiere) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                setSelectedProgram({
                  program_name: filiere.program.program_name,
                  internal_code: filiere.program.internal_code,
                  degree_name: filiere.program.degree_name,
                  degree_code: filiere.program.degree_code,
                  description: filiere.program.description || '',
                  program_code: filiere.program.program_code,
                });
                setIsEditProgramOpen(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle maquette
            </DropdownMenuItem>

            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> Voir maquettes
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> Archiver
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      priority: "high",
    },
  ];

  
  return (
    <div>
      <ContentLayout
        title={`Filières d'études`}
        description="Gestion des programmes de formation"
      >

        <ResponsiveTable
          columns={filiereColumns}
          data={programList.map(fil => ({...fil, program_code: fil.program.program_code}))}
          paginate={20}
          isLoading={isDataLoading}
        />
      </ContentLayout>




      <DialogCreateProgram
        onOpenChange={setIsCreateProgramOpen}
        onSave={handleCreateProgram}
        open={isCreateProgramOpen}
      />

      {selectedProgram && <DialogUpdateProgram
        onOpenChange={() => {
          setIsEditProgramOpen(false);
          setSelectedProgram(null);
        }}
        onSave={handleEditProgram}
        open={isEditProgramOpen}
        program={selectedProgram}
      />}

    </div>
  );
};

export default FilieresTab;
