/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import {
  FileText, Search, MoreHorizontal, Edit,
  Trash2, Plus, Eye, Clock
} from "lucide-react";

import { ICreateProgram, IFactorizedProgram } from "@/types/programTypes";
import { DialogCreateProgram } from "./Modal/DialogCreateProgram";
import { showToast } from "@/components/ui/showToast";
import { createProgram, updateProgram } from "@/actions/programsAction";
import DialogUpdateProgram from "./Modal/DialogUpdateProgram";

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

const statusOptions = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "actif", label: "Actif" },
  { value: "suspendu", label: "Suspendu" },
  { value: "archive", label: "Archivé" }
];



const FilieresTab = ({
  programList,
  isCreateProgramOpen,
  isDataLoading,
  isExportModalOpen,
  isImportModalOpen,
  refresh,
  setIExportModalOpen,
  setIsCreateProgramOpen,
  setIsImportModalOpen 
}: MyComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("ALL");
  const [selectedProgram, setSelectedProgram] = useState<ICreateProgram | null>(null);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);

  const filteredFilieres = useMemo(() => {
    console.log("program", programList);
    return programList.filter((filiere) => {
      const matchesSearch =
        filiere.program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filiere.program.description.toLowerCase().includes(searchTerm.toLowerCase());
        
    return matchesSearch;
    });
  }, [programList, searchTerm]);

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

  
  return (
    <TabsContent value="program" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filières d&apos;études</CardTitle>
          <CardDescription>Gestion des programmes de formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une filière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filière</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Maquettes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFilieres.map((filiere) => (
                <TableRow key={filiere.program.program_code}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{filiere.program.program_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {filiere.program.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{filiere.curriculums.length} ans</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {filiere.curriculums.length} maquette(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedProgram({
                            program_name: filiere.program.program_name,
                            internal_code: filiere.program.internal_code,
                            degree_name: filiere.program.degree_name,
                            degree_code: filiere.program.degree_code,
                            description: filiere.program.description || '',
                            program_code: filiere.program.program_code,
                          })
                          setIsEditProgramOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem><Plus className="mr-2 h-4 w-4" />Nouvelle maquette</DropdownMenuItem>
                        <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Voir maquettes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Archiver</DropdownMenuItem>
                        <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



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

    </TabsContent>
  );
};

export default FilieresTab;
