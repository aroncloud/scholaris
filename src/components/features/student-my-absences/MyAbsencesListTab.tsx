'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  FileUp,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  justificatifId?: number;
  motif?: string;
}

interface MyAbsencesListTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredAbsences: Absence[];
  getTypeColor: (type: string) => string;
  getStatutColor: (statut: string) => string;
  getStatutLabel: (statut: string) => string;
  handleViewDetails: (absence: Absence) => void;
  handleSubmitJustificatif: () => void;
}
export default function MyAbsencesListTab({
  searchTerm,
  setSearchTerm,
  filteredAbsences,
  getTypeColor,
  getStatutColor,
  getStatutLabel,
  handleViewDetails,
  handleSubmitJustificatif,
}: MyAbsencesListTabProps) {

    return(
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Absences</CardTitle>
                  <CardDescription>
                    Liste complète de vos absences par chronologie
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>UE / Cours</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(absence.dateAbsence).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{absence.ue}</div>
                          <div className="text-sm text-muted-foreground">
                            {absence.cours}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {absence.enseignant}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {absence.heureDebut} - {absence.heureFin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getTypeColor(absence.type)}
                        >
                          {absence.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {absence.dureeHeures}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatutColor(absence.statut)}
                        >
                          {getStatutLabel(absence.statut)}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(absence)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            {absence.statut === "non_justifiee" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSubmitJustificatif}>
                                  <FileUp className="mr-2 h-4 w-4" />
                                  Soumettre justificatif
                                </DropdownMenuItem>
                              </>
                            )}
                            {absence.justificatifId && (
                              <DropdownMenuItem>
                                <Link2 className="mr-2 h-4 w-4" />
                                Voir justificatif lié
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    );
}