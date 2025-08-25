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

import { IFactorizedProgram } from "@/types/programTypes";
import { getStatusColor } from "@/lib/utils";

type MyComponentProps = {
  program: IFactorizedProgram[];
};

const statusOptions = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "actif", label: "Actif" },
  { value: "suspendu", label: "Suspendu" },
  { value: "archive", label: "Archivé" }
];

const ActionsMenu = ({ }: { filiere: IFactorizedProgram }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
      <DropdownMenuItem><Plus className="mr-2 h-4 w-4" />Nouvelle maquette</DropdownMenuItem>
      <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Voir maquettes</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Archiver</DropdownMenuItem>
      <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const FilieresTab = ({ program }: MyComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("ALL");

  // ✅ UseMemo pour éviter recalcul inutile
  const filteredFilieres = useMemo(() => {
    return program.filter((filiere) => {
      const matchesSearch =
        filiere.program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filiere.program.description.toLowerCase().includes(searchTerm.toLowerCase());

    //   const matchesStatus =
    //     filterStatut === "ALL" || filiere.program.status?.toLowerCase() === filterStatut;

    //   return matchesSearch && matchesStatus;
    return matchesSearch;
    });
  }, [program, searchTerm]);

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
                <TableHead>Statut</TableHead>
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
                    <Badge className={getStatusColor("ACTIVE")}>
                      ACTIF
                    </Badge>
                  </TableCell>
                  <TableCell><ActionsMenu filiere={filiere} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default FilieresTab;
